interface Hobby {
    hobbyId: string;
    name: string;
}

interface HobbyListResponse {
    hobbies: Hobby[];
}

export type { Hobby, HobbyListResponse };