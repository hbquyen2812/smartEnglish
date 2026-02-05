import React from 'react';

export default function Input({ label, type = "text", placeholder, ...props }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
      <input 
        type={type} 
        className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none placeholder:text-slate-400"
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
}