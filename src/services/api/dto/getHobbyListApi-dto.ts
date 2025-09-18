interface Hobby {
    hobbyId: string;
    name: string;
}

// APIから配列が直接返ってくる場合
export type HobbyListResponse = Hobby[];

export type { Hobby };