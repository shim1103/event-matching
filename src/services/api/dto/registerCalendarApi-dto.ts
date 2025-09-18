interface RegisterCalender {
    hobbyId: number;
    userId: number;
    date: string;
    timeSlot: string;
    intensity: "serious" | "casual";
    attendees: number;
    status: "recruiting" | "matched" | "closed" | null;
}

interface RegisterCalenderResponse {
    calenderId: number;
}

export type { RegisterCalender, RegisterCalenderResponse };