interface CalendarItem {
    calenderId: string;
    date: string;
    status: string | "recruiting" | "matched" | "closed" | null;
}

interface CalendarListResponse {
    calendars: CalendarItem[];
}

export type { CalendarItem, CalendarListResponse };