export interface Cast {
  id: number;
  created_at: string;
  name: string;
  wallet_address: string;
  image_path: string | null;
  parent_id: number | null;
  branch_num: number;
  num_derivatives: number;
  num_total_derivatives: number;
  prompt_input: string | null;
  latest_prompts: Cast[];
  version_history: Cast[];
  story_explorer_url: string | null;
  ip_id: string | null;
  using_ai: boolean;
}
