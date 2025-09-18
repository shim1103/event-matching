interface CalendarItem {
    calendarId: string;
    date: string;
    status: string | "recruiting" | "matched" | "closed" | null;
}

// APIから配列が直接返ってくる場合
export type CalendarListResponse = CalendarItem[];

export type { CalendarItem };