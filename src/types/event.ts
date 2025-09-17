// Event/Calendar関連の型定義
export interface Hobby {
  id: number;
  name: string;
  max_capacity: number;
  min_capacity: number;
}

export interface UserCalendar {
  id: number;
  user_id: number;
  hobby_id: number;
  group_id: number | null;
  date: string;
  time_slot: 'morning' | 'afternoon' | 'evening';
  intensity: 'エンジョイ' | 'ガチ';
  capacity: number;
  status: 'recruiting' | 'matched' | 'confirmed' | 'cancelled';
}

// UI設計に基づく追加のイベント型
export interface EventFormData {
  date: string;
  activity: 'ボードゲーム' | 'バレーボール' | 'カラオケ' | '映画鑑賞';
  intensity: 'エンジョイ' | 'ガチ';
  groupSize: number;
  totalCapacity: '4-6人' | '8-12人';
}

export interface CalendarEvent {
  id: number;
  date: string;
  title: string;
  status: 'today' | 'scheduled' | 'available';
  hasEvent: boolean;
}