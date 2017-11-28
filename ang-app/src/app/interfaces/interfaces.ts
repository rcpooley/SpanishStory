export interface Opt {
    text: string;
    votes: number;
}

export interface Round {
    id: string;
    prompt: string;
    options: Opt[];
}