import React from 'react';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

export default function Button({ children, variant = 'primary', className, to, ...props }) {
  const baseStyles = "inline-flex items-center justify-center px-6 py-2.5 rounded-lg font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover shadow-lg shadow-slate-900/10",
    secondary: "bg-white text-slate-700 border border-border hover:bg-slate-50",
    ghost: "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };

  const classes = twMerge(baseStyles, variants[variant], className);

  if (to) return <Link to={to} className={classes}>{children}</Link>;
  return <button className={classes} {...props}>{children}</button>;
}