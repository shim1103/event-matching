// API関連の型定義
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: 'success' | 'error';
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
}

// API エンドポイント用の型
export interface CreateEventRequest {
  userId: number;
  date: string;
  activityType: string;
  intensity: 'エンジョイ' | 'ガチ';
  groupSize: number;
  totalCapacity: string;
}

export interface MatchingResponse {
  eventId: number;
  status: 'searching' | 'found';
  participants: {
    current: number;
    min: number;
    max: number;
  };
  venues?: Venue[];
}

// 共通レスポンス型
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Import types from other files
import { Venue } from './venue';