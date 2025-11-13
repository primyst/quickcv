"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Download,
  FileText,
  Loader2,
  CheckCircle,
  LogOut,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SnapToDocDashboard() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [extractedTexts, setExtractedTexts] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [userAvatar, setUserAvatar] = useState<string>("");
  const [conversionsToday, setConversionsToday] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data.user) return;

        const user = data.user;
        const name =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "User";

        const avatar =
          user.user_metadata?.avatar_url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`;

        setUserName(name);
        setUserAvatar(avatar);

        const { data: existing, error: fetchErr } = await supabase
          .from("user_conversions")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (fetchErr && fetchErr.code !== "PGRST116") {
          console.error(fetchErr.message);
          return;
        }

        if (!existing) {
          await supabase.from("user_conversions").insert({
            user_id: user.id,
            count: 0,
            plan: "free",
          });
          setConversionsToday(0);
        } else {
          setConversionsToday(existing.count);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    if (validFiles.length === 0) {
      setError("Please select image files");
      return;
    }

    if (validFiles.length + selectedFiles.length > 10) {
      setError("Maximum 10 images at a time");
      return;
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    setError("");
    setSuccess(false);

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          setPreviews((prev) => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const preprocessImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        ctx!.filter = "contrast(2) brightness(1.2) saturate(1.5)";
        ctx!.drawImage(img, 0, 0);

        canvas.toBlob(resolve, "image/png");
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const upscaleImage = (canvas: HTMLCanvasElement): HTMLCanvasElement => {
    if (canvas.width < 1000 || canvas.height < 800) {
      const newCanvas = document.createElement("canvas");
      const ctx = newCanvas.getContext("2d");
      newCanvas.width = canvas.width * 2;
      newCanvas.height = canvas.height * 2;
      ctx?.drawImage(canvas, 0, 0, newCanvas.width, newCanvas.height);
      return newCanvas;
    }
    return canvas;
  };

  const grayscaleImage = (canvas: HTMLCanvasElement): HTMLCanvasElement => {
    const ctx = canvas.getContext("2d");
    const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);

    if (imageData) {
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        data[i] = data[i + 1] = data[i + 2] = gray;
      }
      ctx?.putImageData(imageData, 0, 0);
    }
    return canvas;
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    const preprocessed = await preprocessImage(file);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    return new Promise<string>(async (resolve, reject) => {
      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        const upscaled = upscaleImage(canvas);
        grayscaleImage(upscaled);

        const processedBlob = await new Promise<Blob>((resolve) => {
          upscaled.toBlob((blob) => resolve(blob as Blob), "image/png");
        });

        try {
          const { createWorker } = await import("tesseract.js");
          const worker = await createWorker("eng", 1, {
            logger: (m) => {
              if (m.status === "recognizing text") {
                console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
              }
            },
          });

          const result = await worker.recognize(processedBlob);
          const extracted = result.data.text;

          await worker.terminate();

          resolve(extracted.trim());
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(preprocessed);
    });
  };

  const extractText = async () => {
    if (selectedFiles.length === 0) return;

    setIsProcessing(true);
    setError("");

    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) throw new Error("User not logged in");

      const { data: record } = await supabase
        .from("user_conversions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      const filesCanProcess = Math.min(
        selectedFiles.length,
        Math.max(0, 10 - (record?.count || 0))
      );

      if (filesCanProcess === 0) {
        setError(
          "You've reached your free limit of 10 conversions. Upgrade to Premium!"
        );
        setIsProcessing(false);
        return;
      }

      if (filesCanProcess < selectedFiles.length) {
        setError(
          `Can only process ${filesCanProcess} more image(s) with your free limit.`
        );
      }

      const results: string[] = [];
      for (let i = 0; i < filesCanProcess; i++) {
        try {
          const text = await extractTextFromFile(selectedFiles[i]);
          if (!text) throw new Error("No text detected");
          results.push(text);
        } catch (err) {
          results.push(
            `[Error processing image ${i + 1}: ${err instanceof Error ? err.message : "Unknown error"}]`
          );
        }
      }

      setExtractedTexts(results);
      setSuccess(true);

      await supabase
        .from("user_conversions")
        .update({ count: (record?.count || 0) + filesCanProcess })
        .eq("user_id", user.id);

      setConversionsToday((prev) => prev + filesCanProcess);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to extract text");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadAsText = () => {
    const combined = extractedTexts
      .map((text, i) => `--- Image ${i + 1} ---\n${text}`)
      .join("\n\n");

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(combined)
    );
    element.setAttribute("download", "documents.txt");
    element.click();
  };

  const downloadAsDocx = async () => {
    try {
      const { Document, Packer, Paragraph, AlignmentType, PageBreak } =
        await import("docx");

      const children: any[] = [];

      extractedTexts.forEach((text, index) => {
        if (index > 0) {
          children.push(new PageBreak());
        }

        const paragraphs = text.split("\n").map(
          (line: string) =>
            new Paragraph({ text: line || " ", alignment: AlignmentType.LEFT })
        );
        children.push(...paragraphs);
      });

      const doc = new Document({ sections: [{ children }] });
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "documents.docx";
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download DOCX");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <header className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold text-white">SnapToDoc</h1>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2 bg-blue-700/40 px-3 py-2 rounded-lg">
              <img
                src={userAvatar}
                alt="User Avatar"
                className="w-8 h-8 rounded-full border border-white"
              />
              <span className="text-white font-medium truncate max-w-[120px] sm:max-w-none">
                {userName}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition w-full sm:w-auto justify-center"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </header>

        <div className="bg-blue-50 border-b border-blue-100 px-4 sm:px-8 py-3 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-3">
          <p className="text-gray-700 font-medium text-sm sm:text-base">
            Convert your images to text in seconds ✨
          </p>
          <p className="text-sm sm:text-base text-blue-700 font-semibold">
            Free Conversions Left: {Math.max(0, 10 - conversionsToday)} / 10
          </p>
        </div>

        <main className="p-4 sm:p-8">
          {selectedFiles.length === 0 && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-blue-300 rounded-lg p-8 sm:p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <Upload className="w-10 sm:w-12 h-10 sm:h-12 text-blue-500 mx-auto mb-4" />
              <p className="text-base sm:text-lg font-semibold text-gray-700">
                Upload documents
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Select up to 10 images (PNG, JPG, etc.)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {selectedFiles.length > 0 && !extractedTexts.length && (
            <>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  Selected Images ({selectedFiles.length})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {previews.map((preview, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${i + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        onClick={() => removeFile(i)}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition h-32"
                  >
                    <Upload className="w-6 h-6 text-blue-500" />
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              <button
                onClick={extractText}
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing {selectedFiles.length} image(s)...
                  </>
                ) : (
                  "Extract Text from All"
                )}
              </button>
            </>
          )}

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 text-center text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              All texts extracted successfully!
            </div>
          )}

          {conversionsToday >= 10 && (
            <div className="text-center mt-6">
              <p className="text-slate-500 mb-3 font-medium">
                You've used all 10 free conversions this week
              </p>
              <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-yellow-500/50 transition">
                Upgrade to Premium (Coming Soon)
              </button>
            </div>
          )}

          {extractedTexts.length > 0 && (
            <div className="mt-8 space-y-6">
              {extractedTexts.map((text, i) => (
                <div key={i}>
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">
                    Extracted Text - Image {i + 1}
                  </h2>
                  <textarea
                    value={text}
                    onChange={(e) => {
                      const newTexts = [...extractedTexts];
                      newTexts[i] = e.target.value;
                      setExtractedTexts(newTexts);
                    }}
                    className="w-full h-40 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={downloadAsText}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <Download className="w-5 h-5" /> Download as .TXT
                </button>
                <button
                  onClick={downloadAsDocx}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <Download className="w-5 h-5" /> Download as .DOCX
                </button>
              </div>

              <button
                onClick={() => {
                  setSelectedFiles([]);
                  setPreviews([]);
                  setExtractedTexts([]);
                  setSuccess(false);
                  setError("");
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition"
              >
                Start Over
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}