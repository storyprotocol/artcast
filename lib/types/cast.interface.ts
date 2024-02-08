export interface Cast {
    id: number;
    name: string;
    farcaster_id: string;
    image_path: string;
    parent_id: number | null;
    branch_num: number;
    num_derivatives: number;
    prompt_input: string | null;
}