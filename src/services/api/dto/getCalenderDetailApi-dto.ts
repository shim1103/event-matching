interface Shop {
    name: string;
    address: string;
}

interface CalendarDetailResponse {
    userId: number;
    hobbyId: number;
    date: string;
    timeSlot: string;
    intensity: "serious" | "casual";
    mincapacity: number;
    maxcapacity: number;
    capacity: number;
    status: "recruiting" | "matched" | "closed" | null;
    shops: Shop[];
}

export type { CalendarDetailResponse, Shop };