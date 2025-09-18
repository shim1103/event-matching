import React from 'react';

// Venue型定義を簡素化
interface Venue {
  id: number;
  name: string;
  address: string;
}

interface VenueCardProps {
  venue: Venue;
  onSelect?: () => void;
}

const VenueCard: React.FC<VenueCardProps> = ({
  venue,
  onSelect
}) => {
  return (
    <div
      className="p-4 rounded-lg border-2 bg-white hover:border-gray-300 cursor-pointer transition-all duration-200 border-gray-200"
      onClick={onSelect}
    >
      {/* 場所情報 */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">
          {venue.name}
        </h3>
        
        <div className="text-sm text-gray-600">
          📍 {venue.address}
        </div>
      </div>
    </div>
  );
};

export default VenueCard;