interface Shop {
    name: string;
    address: string;
}

interface CalendarDetailResponse {
    userId: string;
    hobbyId: string;
    date: string;
    timeSlot: "morning" | "afternoon" | "evening";
    intensity: "serious" | "casual";
    mincapacity: number;
    maxcapacity: number;
    attendees: number;
    count: number;
    status: "recruiting" | "matched" | "closed" | null;
    shops: Shop[];
}

export type { CalendarDetailResponse, Shop };