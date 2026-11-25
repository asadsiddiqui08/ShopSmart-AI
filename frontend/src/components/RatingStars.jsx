import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 5, numReviews = null, size = 16, showNumber = true }) => {
  const rounded = Math.round(rating * 2) / 2;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${
              star <= rounded
                ? 'fill-amber-400 text-amber-400'
                : star - 0.5 <= rounded
                ? 'fill-amber-400/50 text-amber-400'
                : 'text-slate-300'
            }`}
          />
        ))}
      </div>
      {showNumber && (
        <span className="text-xs font-semibold text-slate-700">
          {rating ? rating.toFixed(1) : '5.0'}
        </span>
      )}
      {numReviews !== null && (
        <span className="text-xs text-slate-400">
          ({numReviews})
        </span>
      )}
    </div>
  );
};

export default RatingStars;
