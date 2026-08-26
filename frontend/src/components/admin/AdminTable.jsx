/** Wrap admin data tables for horizontal scroll on small screens. */
export default function AdminTable({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden ${className}`}>
      <div className="overflow-x-auto overscroll-x-contain admin-table-wrap">
        {children}
      </div>
    </div>
  );
}
