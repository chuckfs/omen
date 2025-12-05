import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="animate-fade-in w-full max-w-xl mx-auto p-8 bg-red-950/40 rounded-xl shadow-2xl backdrop-blur-sm border border-red-900/50 text-center">
      <div className="mb-4 flex justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12 text-red-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-red-200 mb-2">Something went wrong</h3>
      <p className="text-red-200/80 mb-6 leading-relaxed">
        {message}
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-red-900/50 hover:bg-red-800 text-red-100 font-semibold rounded-full transition-colors duration-300 border border-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorDisplay;
