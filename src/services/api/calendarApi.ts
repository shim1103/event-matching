import userCalendarsData from '../../dummydata/user_calendars.json';

interface UserCalendar {
    id: number;
    user_id: number;
    hobby_id: number;
    group_id: number | null;
    date: string;
    time_slot: string;
    intensity: string;
    attendees: number;
    status: string;
}

interface CalendarResponse {
    calenderid: number;
    date: string;
    status: string;
}

/**
 * ユーザーのカレンダー予定を取得するAPI関数
 * GET /users/{userId}/calendars
 * 
 * @param userId - ユーザーID
 * @returns カレンダー予定の配列
 */
export const getUserCalendars = (userId: number): CalendarResponse[] => {
    const userCalendars: UserCalendar[] = userCalendarsData;

    // 指定されたユーザーIDのカレンダーをフィルタリング
    const userCalendarList = userCalendars.filter(calendar => calendar.user_id === userId);

    // レスポンス形式に変換
    const response: CalendarResponse[] = userCalendarList.map(calendar => ({
        calenderid: calendar.id,
        date: calendar.date,
        status: calendar.status
    }));

    return response;
};


/**
 * 特定の日付範囲のカレンダー予定を取得するAPI関数
 * 
 * @param userId - ユーザーID
 * @param startDate - 開始日（YYYY-MM-DD形式）
 * @param endDate - 終了日（YYYY-MM-DD形式）
 * @returns カレンダー予定の配列
 */
export const getUserCalendarsByDateRange = (
    userId: number,
    startDate: string,
    endDate: string
): CalendarResponse[] => {
    const userCalendars: UserCalendar[] = userCalendarsData;

    // 指定されたユーザーIDと日付範囲のカレンダーをフィルタリング
    const userCalendarList = userCalendars.filter(calendar =>
        calendar.user_id === userId &&
        calendar.date >= startDate &&
        calendar.date <= endDate
    );

    // レスポンス形式に変換
    const response: CalendarResponse[] = userCalendarList.map(calendar => ({
        calenderid: calendar.id,
        date: calendar.date,
        status: calendar.status
    }));

    return response;
};

/**
 * 特定の日付のカレンダー予定を取得するAPI関数
 * 
 * @param userId - ユーザーID
 * @param date - 日付（YYYY-MM-DD形式）
 * @returns カレンダー予定の配列
 */
export const getUserCalendarsByDate = (userId: number, date: string): CalendarResponse[] => {
    return getUserCalendarsByDateRange(userId, date, date);
};
