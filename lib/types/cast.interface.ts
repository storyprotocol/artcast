export interface Cast {
    id: number;
    created_at: string;
    name: string;
    farcaster_id: string;
    image_path: string | null;
    parent_id: number | null;
    branch_num: number;
    num_derivatives: number;
    num_total_derivatives: number;
    prompt_input: string | null;
    layer_1_cast_id: number | null;
    layer_1_cast: { locked: boolean };
    locked: boolean;
    parent_cast?: { farcaster_id: string };
    latest_prompts: Cast[];
    version_history: Cast[]
}