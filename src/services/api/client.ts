import { apiCall } from './api';
import { BASE_URL } from '../../utils/constants';
import { RegisterCalendar, RegisterCalendarResponse } from './dto/registerCalendarApi-dto';
import {  CalendarListResponse } from './dto/getCalendarListApi-dto';
import { CalendarDetailResponse } from './dto/getCalendarDetailApi-dto';
import { HobbyListResponse } from './dto/getHobbyListApi-dto';

// エンドポイント定義
const ENDPOINTS = {
    CALENDARS: {
        // 9.特定のカレンダー詳細を取得
        GET_CALENDAR_DETAIL: (userId: string, calendarId: string) => `/users/${userId}/calendars/${calendarId}`,
        // 16.カレンダーを登録
        REGISTER_CALENDAR:  `/forms`,
        // 19.ユーザーのカレンダー一覧を取得
        GET_USER_CALENDARS: (userId: string) => `/users/${userId}/calendars`,
    },
    HOBBIES: {
        // 7.趣味一覧を取得
        GET_HOBBY_LIST: '/hobbies',
    },
} as const;

// カレンダー登録
export const registerCalendar = async (userId: string, calendar: RegisterCalendar): Promise<RegisterCalendarResponse> => {
    return apiCall<RegisterCalendarResponse>(
        ENDPOINTS.CALENDARS.REGISTER_CALENDAR,
        'POST',
        calendar,
        BASE_URL.REGISTER_CALENDAR
    );
};

// カレンダー一覧取得
export const getCalendarList = async (userId: string): Promise<CalendarListResponse> => {
    return apiCall<CalendarListResponse>(
        ENDPOINTS.CALENDARS.GET_USER_CALENDARS(userId),
        'GET',
        undefined,
        BASE_URL.CALENDAR_LIST
    );
};

// カレンダー詳細取得
export const getCalendarDetail = async (userId: string, calendarId: string): Promise<CalendarDetailResponse> => {
    return apiCall<CalendarDetailResponse>(
        ENDPOINTS.CALENDARS.GET_CALENDAR_DETAIL(userId, calendarId),
        'GET',
        undefined,
        BASE_URL.CALENDAR_DETAIL
    );
};

// 趣味一覧取得
export const getHobbyList = async (): Promise<HobbyListResponse> => {
    return apiCall<HobbyListResponse>(
        ENDPOINTS.HOBBIES.GET_HOBBY_LIST,
        'GET',
        undefined,
        BASE_URL.HOBBY_LIST
    );
};
