import { apiCall } from './api';
import { RegisterCalender, RegisterCalenderResponse } from './dto/registerCalendarApi-dto';
import { CalendarItem } from './dto/getCalenderListApi-dto';
import { CalendarDetailResponse } from './dto/getCalenderDetailApi-dto';

// エンドポイント定義
const ENDPOINTS = {
    CALENDARS: {
        // ユーザーのカレンダー一覧を取得
        GET_USER_CALENDARS: (userId: number) => `/users/${userId}/calendars`,
        
        // 特定のカレンダー詳細を取得
        GET_CALENDAR_DETAIL: (userId: number, calendarId: number) => `/users/${userId}/calendars/${calendarId}`,
        
        // カレンダーを登録
        REGISTER_CALENDAR: (userId: number) => `/users/${userId}/calendars`,
    }
} as const;

// カレンダー登録
export const registerCalender = async (userId: number, calender: RegisterCalender): Promise<RegisterCalenderResponse> => {
    return apiCall<RegisterCalenderResponse>(
        ENDPOINTS.CALENDARS.REGISTER_CALENDAR(userId),
        'POST',
        calender
    );
};

// カレンダー一覧取得
export const getCalenderList = async (userId: number): Promise<CalendarItem[]> => {
    return apiCall<CalendarItem[]>(
        ENDPOINTS.CALENDARS.GET_USER_CALENDARS(userId),
        'GET'
    );
};

// カレンダー詳細取得
export const getCalendarDetail = async (userId: number, calenderId: number): Promise<CalendarDetailResponse> => {
    return apiCall<CalendarDetailResponse>(
        ENDPOINTS.CALENDARS.GET_CALENDAR_DETAIL(userId, calenderId),
        'GET'
    );
};
