import React from "react";
import { Inbox, RefreshCcw } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = "No data available",
  description = "There are no records matching your current filter criteria or selection.",
  actionText,
  onAction,
  icon,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`border-2 border-black bg-white p-8 text-center flex flex-col items-center justify-center my-4 shadow-[4px_4px_0px_0px_#000000] font-sans ${className}`}
    >
      <div className="w-12 h-12 bg-black border-2 border-black text-[#FF4D00] flex items-center justify-center mb-3 shadow-[2px_2px_0px_0px_#FF4D00]">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      <h4 className="font-headline text-base sm:text-lg text-black mb-1">{title}</h4>
      <p className="font-sans text-xs sm:text-sm text-neutral-600 max-w-sm mb-4 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-1.5 px-4 py-2 font-headline text-xs font-bold text-black bg-[#FF4D00] border-2 border-black hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_#000000] active:translate-y-0.5"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          {actionText}
        </button>
      )}
    </div>
  );
}
