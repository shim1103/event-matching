interface CalendarItem {
    calenderId: number;
    date: string;
    status: string | "recruiting" | "matched" | "closed" | null;
}

export type { CalendarItem };