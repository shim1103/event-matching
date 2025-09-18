// アプリケーション定数
export const APP_CONFIG = {
  APP_NAME: 'EventMatching',
  VERSION: '1.0.0',
  API_TIMEOUT: 10000,
} as const;

// UI設計に基づくアクティビティ定数
export const ACTIVITIES = [
  'ボードゲーム',
  'バレーボール',
  'カラオケ',
  '映画鑑賞'
] as const;

export const INTENSITY_OPTIONS = [
  'エンジョイ',
  'ガチ'
] as const;

export const TIME_SLOTS = [
  'morning',
  'afternoon',
  'evening'
] as const;

export const CAPACITY_OPTIONS = [
  '4-6人',
  '8-12人'
] as const;

// ステータス定数
export const EVENT_STATUS = {
  RECRUITING: 'recruiting',
  MATCHED: 'matched',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled'
} as const;

export const GROUP_STATUS = {
  RECRUITING: 'recruiting',
  MATCHED: 'matched',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled'
} as const;

// カラーパレット（UI設計に基づく）
export const COLORS = {
  PRIMARY: '#E53E3E',
  SECONDARY: '#FED7D7',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  BACKGROUND: '#FFFFFF',
  TEXT: '#2D3748'
} as const;

// API エンドポイント
export const API_ENDPOINTS = {
  EVENTS: '/api/events',
  USERS: '/api/users',
  MATCHING: '/api/matching',
  VENUES: '/api/venues',
  GROUPS: '/api/groups',
  CHAT: '/api/chat'
} as const;

export const BASE_URL = {
  CALENDAR_DETAIL: 'https://uh7j650u2c.execute-api.ap-northeast-1.amazonaws.com',
  CALENDAR_LIST: 'https://26os9pzfpb.execute-api.ap-northeast-1.amazonaws.com',
  HOBBY_LIST: 'https://4rcfyrocda.execute-api.ap-northeast-1.amazonaws.com',
  REGISTER_CALENDAR: 'https://a43o1kucik.execute-api.ap-northeast-1.amazonaws.com',
} as const;