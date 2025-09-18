interface RegisterCalendar {
    hobbyId: string;
    userId: string;
    date: string;
    timeSlot: "morning" | "afternoon" | "evening";
    intensity: "serious" | "casual";
    attendees: number;
    status: "recruiting" | "matched" | "closed" | null;
}

interface RegisterCalendarResponse {
    calendarId: string;
    status: "recruiting" | "matched" | "closed" | null;
}


export type { RegisterCalendar, RegisterCalendarResponse };