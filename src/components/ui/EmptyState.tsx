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
      className={`rounded-[12px] border border-dashed border-slate-300 bg-white/80 p-8 text-center flex flex-col items-center justify-center my-4 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      <h4 className="text-base font-semibold text-slate-800 mb-1">{title}</h4>
      <p className="text-sm text-slate-500 max-w-sm mb-4 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#3730A3] bg-[#EEF2FF] rounded-lg hover:bg-indigo-100 transition-colors"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          {actionText}
        </button>
      )}
    </div>
  );
}
