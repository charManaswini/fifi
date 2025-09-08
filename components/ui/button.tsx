import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className = "", ...props }: Props) {
  return (
    <button
      className={`px-8 py-3 rounded-full font-bold tracking-wide
        bg-[var(--brand)] text-white text-lg
        shadow-[0_0_12px_rgba(229,9,20,0.7)]
        hover:shadow-[0_0_25px_rgba(229,9,20,1)]
        hover:bg-red-700
        active:scale-95
        transition-all duration-200 ease-in-out
        ${className}`}
      {...props}
    />
  );
}
