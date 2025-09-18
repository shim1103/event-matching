interface RegisterCalendar {
    hobbyId: string;
    userId: string;
    date: string;
    timeSlot: "morning" | "afternoon" | "evening";
    intensity: "serious" | "casual";
    attendees: number;
    status: "recruiting" | "matched" | "closed" | null;
}

interface Shop {
    name: string;
    address: string;
}

interface RegisterCalendarResponse {
    hobbyId: string;
    userId: string;
    date: string;
    timeSlot: "morning" | "afternoon" | "evening";
    intensity: "serious" | "casual";
    attendees: number;
    status: "recruiting" | "matched" | "closed" | null;
    shops: Shop[];
}


export type { RegisterCalendar, RegisterCalendarResponse };