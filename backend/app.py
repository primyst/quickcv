from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import easyocr
import cv2
import numpy as np
import gc

app = FastAPI()

# CORS middleware - explicit and detailed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://snaptodoc.vercel.app", "http://localhost:3000", "*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Global reader (lazy loaded)
reader = None

def get_reader():
    global reader
    if reader is None:
        reader = easyocr.Reader(['en'], gpu=False)
    return reader

@app.options("/extract-text")
async def options_extract_text():
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        }
    )

@app.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    try:
        # Read file
        contents = await file.read()
        
        # Decode image
        image = cv2.imdecode(np.frombuffer(contents, np.uint8), cv2.IMREAD_COLOR)
        
        if image is None:
            return JSONResponse({"error": "Invalid image"}, status_code=400)
        
        # Aggressive resizing - max 800px
        h, w = image.shape[:2]
        if max(h, w) > 800:
            scale = 800 / max(h, w)
            image = cv2.resize(image, (int(w * scale), int(h * scale)))
        
        # Convert to grayscale
        image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Extract text
        reader = get_reader()
        result = reader.readtext(image, detail=0)
        text = "\n".join(result)
        
        # Clear memory
        del image
        del contents
        gc.collect()
        
        return JSONResponse(
            content={"text": text},
            headers={"Access-Control-Allow-Origin": "*"}
        )
    
    except Exception as e:
        gc.collect()
        return JSONResponse(
            {"error": str(e)},
            status_code=500,
            headers={"Access-Control-Allow-Origin": "*"}
        )