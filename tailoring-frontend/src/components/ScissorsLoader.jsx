import React from "react";

export default function ScissorCutLoader({ size = 100 }) {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="relative">
        {/* Cutting line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-dashed-line animate-cut-line"></div>

        {/* Scissor SVG - handles both on left, blades open to the right */}
        <svg
          width={size}
          height={size * 0.6}
          viewBox="0 0 100 60"
          fill="none"
          className="animate-scissor-move"
        >
          {/* Handles */}
          <circle cx="32" cy="15" r="10" fill="#4F8DFD" opacity="0.7" />
          <circle cx="32" cy="45" r="10" fill="#4F8DFD" opacity="0.7" />

          {/* Pivot */}
          <circle cx="40" cy="30" r="5" fill="#666" />

          {/* Blades */}
          {/* Top blade (upper right) */}
          <rect
            x="38"
            y="27"
            width="48"
            height="5"
            rx="2.5"
            fill="#AAA"
            transform="rotate(-15 40 30)"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="-15 40 30"
              to="8 40 30"
              dur="0.7s"
              repeatCount="indefinite"
              direction="alternate"
            />
          </rect>
          {/* Lower blade (lower right) */}
          <rect
            x="38"
            y="27"
            width="48"
            height="5"
            rx="2.5"
            fill="#AAA"
            transform="rotate(15 40 30)"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="15 40 30"
              to="-8 40 30"
              dur="0.7s"
              repeatCount="indefinite"
              direction="alternate"
            />
          </rect>
        </svg>
      </div>
    </div>
  );
}