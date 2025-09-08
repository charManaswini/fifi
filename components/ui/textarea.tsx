import React from "react";
type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
export function Textarea({ className = "", ...props }: Props) {
  return (
    <textarea
      className={`w-full rounded-lg bg-black border border-zinc-800 text-white p-3 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[var(--brand)] ${className}`}
      {...props}
    />
  );
}
export default Textarea;
