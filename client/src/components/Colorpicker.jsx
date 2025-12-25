import { Check, Palette } from "lucide-react";
import React, { useState } from "react";

const ColorPicker = ({ onChange, selectedColor }) => {
  const colors = [
    { name: "Blue", value: "#3b82f6" },
    { name: "Red", value: "#ef4444" },
    { name: "Green", value: "#10b981" },
    { name: "Indigo", value: "#6366f1" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Pink", value: "#ec4899" },
    { name: "Teal", value: "#14b8a6" },
    { name: "Orange", value: "#f97316" },
    { name: "Gray", value: "#6b7280" },
    { name: "Black", value: "#1F2937" },
  ];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-purple-600 bg-linear-to-br from-purple-50 to-purple-100 ring-purple-300 hover:ring transition-all px-3 py-2 rounded-lg"
      >
        <Palette size={16} /> <span className="max-sm:hidden">Accent</span>
      </button>

      {isOpen && (
        <div className="grid grid-cols-4 w-60 gap-3 absolute top-full left-0 p-3 mt-2 z-10 bg-white rounded-md border border-gray-200 shadow-md">
          {colors.map((color) => (
            <div
              key={color.value}
              className="relative cursor-pointer group flex flex-col items-center"
              onClick={() => {
                onChange(color.value);
                setIsOpen(false);
              }}
            >
              <div
                style={{ backgroundColor: color.value }}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  selectedColor === color.value
                    ? "border-black/50 scale-105"
                    : "border-transparent hover:border-black/25"
                }`}
              >
                {selectedColor === color.value && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white drop-shadow" />
                  </div>
                )}
              </div>
              <p className="text-xs text-center mt-1 text-gray-600">
                {color.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
