import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="animate-fade-in w-full max-w-xl mx-auto p-8 bg-[#1a0f0f]/90 dark:bg-[#1a0f0f]/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-red-900/30 text-center">
      <div className="mb-6 flex justify-center">
        <div className="p-4 bg-red-500/10 rounded-full ring-1 ring-red-500/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 text-red-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
        </div>
      </div>
      <h3 className="text-lg font-medium text-red-200 mb-2 tracking-wide">Disturbance in the Veil</h3>
      <p className="text-red-300/70 mb-8 leading-relaxed font-light">
        {message}
      </p>
      <button
        onClick={onRetry}
        className="px-8 py-3 bg-red-900/30 hover:bg-red-900/50 text-red-100 font-medium rounded-full transition-all duration-300 border border-red-800/50 hover:border-red-700"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorDisplay;