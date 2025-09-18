import React from 'react';
import { COLORS } from '../../../utils/constants';
import { Venue } from '../../../types/venue';

interface VenueCardProps {
  venue: Venue;
  isRecommended?: boolean;
  onSelect?: () => void;
}

const VenueCard: React.FC<VenueCardProps> = ({
  venue,
  isRecommended = false,
  onSelect
}) => {
  return (
    <div
      className={`
        p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
        ${isRecommended 
          ? 'border-red-500 bg-red-50' 
          : 'border-gray-200 bg-white hover:border-gray-300'
        }
      `}
      onClick={onSelect}
    >
      {/* おすすめバッジ */}
      {isRecommended && (
        <div className="flex items-center mb-2">
          <span 
            className="text-xs font-bold px-2 py-1 rounded-full text-white"
            style={{ backgroundColor: COLORS.PRIMARY }}
          >
            おすすめ
          </span>
        </div>
      )}
      
      {/* 場所情報 */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 
            className="text-lg font-semibold"
            style={{ color: COLORS.TEXT }}
          >
            {venue.name}
          </h3>
          <div className="flex items-center space-x-1">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-gray-600">{venue.rating}</span>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          📍 {venue.address}
        </div>
        
        <div className="text-sm text-gray-600">
          👥 最大{venue.capacity}人
        </div>
        
        {venue.priceRange && (
          <div className="text-sm text-gray-600">
            💰 {venue.priceRange}
          </div>
        )}
        
        {venue.description && (
          <div className="text-sm text-gray-500 mt-2">
            {venue.description}
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueCard;