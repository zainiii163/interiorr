import React from 'react';
import { Search, FolderOpen, FileText, AlertCircle, Package } from 'lucide-react';

const icons = {
  search: Search,
  empty: FolderOpen,
  document: FileText,
  alert: AlertCircle,
  default: Package,
};

export default function EmptyState({
  icon = 'empty',
  title = 'No data available',
  description = 'There are no items to display at this time.',
  action,
  actionLabel,
  className = '',
}) {
  const Icon = icons[icon] || icons.default;

  return (
    <div className={`text-center py-16 px-4 ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-stone-400" />
      </div>
      <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">{title}</h3>
      <p className="text-stone-500 text-sm max-w-md mx-auto mb-6">{description}</p>
      {action && actionLabel && (
        <button
          onClick={action}
          className="btn-terracotta px-6 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
