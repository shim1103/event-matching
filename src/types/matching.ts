// マッチング関連の型定義
export interface Group {
  id: number;
  hobby_id: number;
  organizer_user_id: number;
  date: string;
  time_slot: 'morning' | 'afternoon' | 'evening';
  intensity: 'エンジョイ' | 'ガチ';
  capacity: number;
  location: string;
  description: string;
  status: 'recruiting' | 'matched' | 'confirmed' | 'cancelled';
}

export interface MatchingStatus {
  eventId: number;
  currentParticipants: number;
  minCapacity: number;
  maxCapacity: number;
  status: 'searching' | 'found' | 'confirmed';
  isRecommended?: boolean;
}

export interface GroupChat {
  id: number;
  group_id: number;
  user_id: number;
  timestamp: string;
  message: string;
}

// UI画面用のマッチング情報
export interface MatchingInfo {
  event: {
    date: string;
    activity: string;
    time: string;
  };
  participants: {
    current: number;
    min: number;
    max: number;
  };
  status: 'recruiting' | 'ready' | 'confirmed';
}