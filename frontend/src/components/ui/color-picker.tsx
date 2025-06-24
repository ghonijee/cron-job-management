import React, { useState } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308',
  '#84cc16', '#22c55e', '#10b981', '#14b8a6',
  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ 
  value, 
  onChange, 
  label 
}) => {
  const [showCustom, setShowCustom] = useState(false);

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-900 mb-2">
          {label}
        </label>
      )}
      
      <div className="grid grid-cols-8 gap-3 p-3 bg-gray-50 rounded-lg border">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
              value === color 
                ? 'border-gray-700 shadow-lg ring-2 ring-blue-500 ring-opacity-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
            title={`Select ${color}`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => setShowCustom(!showCustom)}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          <span className="mr-1">🎨</span>
          {showCustom ? 'Hide Custom Color' : 'Custom Color'}
        </button>
        {showCustom && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Pick:</span>
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-10 h-8 rounded-lg border border-gray-300 cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
};