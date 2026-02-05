import React from 'react';

export default function Badge({ text, color = 'green' }) {
  const styles = {
    green: "bg-green-50 text-green-700 border-green-100",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-100",
    red: "bg-red-50 text-red-700 border-red-100",
    gray: "bg-slate-100 text-slate-600 border-slate-200",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
  };

  return (
    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${styles[color] || styles.gray}`}>
      {text}
    </span>
  );
}