import React from "react";
export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`rounded-2xl border border-zinc-800 bg-zinc-900 ${className}`}>{children}</div>;
}
export default Card;
