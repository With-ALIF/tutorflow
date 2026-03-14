import React from "react";

export default function Logo({ className }: { className?: string }) {
  return (
    <svg 
      width="420" 
      height="120" 
      viewBox="0 0 420 120" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Book */}
      <path d="M30 70 L60 50 L90 70 L90 95 L60 80 L30 95 Z" fill="#1e40af"/>
      
      {/* Location Pin */}
      <circle cx="60" cy="65" r="10" fill="#f97316"/>
      <circle cx="60" cy="65" r="4" fill="white"/>

      {/* Graduation Cap */}
      <polygon points="45,40 60,30 75,40 60,45" fill="#1e40af"/>
      <line x1="60" y1="45" x2="60" y2="55" stroke="#f97316" strokeWidth="3"/>

      {/* Text Tuition */}
      <text x="110" y="70"
            fontFamily="Arial, sans-serif"
            fontSize="36"
            fontWeight="bold"
            fill="#1e40af">
            Tuition
      </text>

      {/* Text Hub */}
      <text x="260" y="70"
            fontFamily="Arial, sans-serif"
            fontSize="36"
            fontWeight="bold"
            fill="#f97316">
            Hub
      </text>
    </svg>
  );
}
