interface RegisterCalender {
    hobbyId: string;
    userId: string;
    date: string;
    timeSlot: string;
    intensity: "serious" | "casual";
    attendees: number;
    status: "recruiting" | "matched" | "closed" | null;
}

interface Shop {
    name: string;
    address: string;
}

interface RegisterCalenderResponse {
    hobbyId: string;
    userId: string;
    date: string;
    timeSlot: string;
    intensity: "serious" | "casual";
    attendees: number;
    status: "recruiting" | "matched" | "closed" | null;
    shops: Shop[];
}


export type { RegisterCalender, RegisterCalenderResponse };