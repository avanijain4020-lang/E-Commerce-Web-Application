import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="glass rounded-premium shadow-premium p-4 flex flex-col gap-4 animate-pulse">
      <div className="w-full aspect-square bg-slate-200 dark:bg-slate-800 rounded-premium"></div>
      <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
      <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
      <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded"></div>
      <div className="flex justify-between items-center mt-2">
        <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
        <div className="h-9 w-24 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="glass rounded-premium shadow-premium p-6 flex items-center justify-between animate-pulse">
      <div className="flex flex-col gap-2 w-2/3">
        <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>
      <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800"></div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr className="animate-pulse border-b border-slate-100 dark:border-slate-800/50">
      {Array.from({ length: cols }).map((_, idx) => (
        <td key={idx} className="px-6 py-4">
          <div className={`h-4 bg-slate-200 dark:bg-slate-800 rounded ${idx === 0 ? 'w-24' : 'w-16'}`}></div>
        </td>
      ))}
    </tr>
  );
}

export function ListSkeleton({ count = 3 }) {
  return (
    <div className="flex flex-col gap-4 w-full animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="glass rounded-premium p-4 flex gap-4 items-center">
          <div className="h-16 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-3 w-1/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
          <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
        </div>
      ))}
    </div>
  );
}
