import React from 'react';
import { motion } from 'framer-motion';

const shimmer = {
  initial: { backgroundPosition: '200% 0' },
  animate: { backgroundPosition: '-200% 0' },
  transition: { duration: 2, repeat: Infinity, ease: 'linear' }
};

export const SkeletonLoader = () => (
  <motion.div
    {...shimmer}
    className="bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] rounded-lg"
  />
);

export const CardSkeleton = ({ count = 3 }) => (
  <div className="grid md:grid-cols-3 gap-8">
    {Array.from({ length: count }).map((_, idx) => (
      <div key={idx} className="space-y-4">
        <SkeletonLoader />
        <div className="space-y-2">
          <SkeletonLoader />
          <SkeletonLoader />
        </div>
      </div>
    ))}
  </div>
);

export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, rowIdx) => (
      <div key={rowIdx} className="flex gap-4">
        {Array.from({ length: columns }).map((_, colIdx) => (
          <div key={colIdx} className="flex-1">
            <SkeletonLoader />
          </div>
        ))}
      </div>
    ))}
  </div>
);

export const TextSkeleton = ({ lines = 3 }) => (
  <div className="space-y-3">
    {Array.from({ length: lines }).map((_, idx) => (
      <SkeletonLoader key={idx} />
    ))}
  </div>
);

export const HeroSkeleton = () => (
  <div className="space-y-6">
    <div className="h-16 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-lg animate-pulse" />
    <div className="h-32 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-lg animate-pulse" />
    <div className="flex gap-4">
      <div className="h-12 w-40 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-lg animate-pulse" />
      <div className="h-12 w-40 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-lg animate-pulse" />
    </div>
  </div>
);
