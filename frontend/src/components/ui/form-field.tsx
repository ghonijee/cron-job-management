import React from 'react'
import type { FieldError } from 'react-hook-form'

interface FormFieldProps {
  label: string
  error?: FieldError
  children: React.ReactNode
  required?: boolean
}

export function FormField({ label, error, children, required }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error.message}
        </p>
      )}
    </div>
  )
}