// 場所・ベニュー関連の型定義
export interface Venue {
  id: number;
  name: string;
  address: string;
  category: string;
  rating: number;
  capacity: number;
  priceRange?: string;
  description?: string;
  amenities?: string[];
  imageUrl?: string;
}

export interface VenueSearchParams {
  activity: string;
  location: string;
  capacity: number;
  date: string;
  timeSlot: 'morning' | 'afternoon' | 'evening';
}

export interface VenueProposal {
  venues: Venue[];
  event: {
    id: number;
    date: string;
    activity: string;
    participants: {
      current: number;
      min: number;
      max: number;
    };
  };
}