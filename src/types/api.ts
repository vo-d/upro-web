// API response types

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  user_id: string;
}

export interface Account {
  id: number;
  auth_user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateAccountRequest {
  first_name?: string;
  last_name?: string;
}
