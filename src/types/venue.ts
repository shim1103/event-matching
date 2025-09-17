// 場所・ベニュー関連の型定義
export interface Venue {
  id: string;
  name: string;
  address: string;
  category: string;
  isRecommended: boolean;
  capacity: number;
  rating: number;
  description?: string;
  imageUrl?: string;
  priceRange?: string;
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