import { apiCall } from './api';
import { RegisterCalender, RegisterCalenderResponse } from './dto/registerCalendarApi-dto';
import {  CalendarListResponse } from './dto/getCalenderListApi-dto';
import { CalendarDetailResponse } from './dto/getCalenderDetailApi-dto';
import { HobbyListResponse } from './dto/getHobbyListApi-dto';

// エンドポイント定義
const ENDPOINTS = {
    CALENDARS: {
        // 9.特定のカレンダー詳細を取得
        GET_CALENDAR_DETAIL: (userId: string, calendarId: string) => `/users/${userId}/calendars/${calendarId}`,
        // 16.カレンダーを登録
        REGISTER_CALENDAR: (userId: string) => `/users/${userId}/calendars`,
        // 19.ユーザーのカレンダー一覧を取得
        GET_USER_CALENDARS: (userId: string) => `/users/${userId}/calendars`,
    },
    HOBBIES: {
        // 7.趣味一覧を取得
        GET_HOBBY_LIST: '/hobbies',
    },
} as const;

// カレンダー登録
export const registerCalender = async (userId: string, calender: RegisterCalender): Promise<RegisterCalenderResponse> => {
    return apiCall<RegisterCalenderResponse>(
        ENDPOINTS.CALENDARS.REGISTER_CALENDAR(userId),
        'POST',
        calender
    );
};

// カレンダー一覧取得
export const getCalenderList = async (userId: string): Promise<CalendarListResponse> => {
    return apiCall<CalendarListResponse>(
        ENDPOINTS.CALENDARS.GET_USER_CALENDARS(userId),
        'GET'
    );
};

// カレンダー詳細取得
export const getCalendarDetail = async (userId: string, calenderId: string): Promise<CalendarDetailResponse> => {
    return apiCall<CalendarDetailResponse>(
        ENDPOINTS.CALENDARS.GET_CALENDAR_DETAIL(userId, calenderId),
        'GET'
    );
};

// 趣味一覧取得
export const getHobbyList = async (): Promise<HobbyListResponse> => {
    return apiCall<HobbyListResponse>(
        ENDPOINTS.HOBBIES.GET_HOBBY_LIST,
        'GET'
    );
};
