"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function UpgradeModal({ open, onClose }: UpgradeModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-6 rounded-2xl shadow-2xl w-80 text-center"
      >
        <h2 className="text-xl font-bold mb-3">Upgrade to Pro 🚀</h2>
        <p className="text-gray-600 text-sm mb-6">
          You’ve reached your free conversion limit.
          Unlock <span className="font-medium">unlimited conversions</span> and
          faster processing with Pro.
        </p>

        <button
          onClick={() => alert("Stripe integration coming soon!")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
        >
          Upgrade Now
        </button>

        <button
          onClick={onClose}
          className="mt-3 text-sm text-gray-500 hover:text-gray-700"
        >
          Maybe later
        </button>
      </motion.div>
    </div>
  );
}