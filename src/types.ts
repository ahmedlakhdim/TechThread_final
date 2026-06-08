export interface Article {
  id: string;
  title: string;
  description: string;
  image: string;
  content: string; // HTML or rich-text/markdown content
  author_id?: string;
  source: 'local' | 'custom';
  created_at?: string;
}

export interface Comment {
  id: string;
  article_id: string;
  user_email: string;
  user_name: string;
  content: string;
  created_at: string;
}

export interface WriterRequest {
  id: string;
  full_name: string;
  age: number;
  message: string;
  is_creator: boolean;
  channel_url?: string;
  email?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface InviteCode {
  id: string;
  email: string;
  code: string;
  used: boolean;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  isHTML?: boolean;
}
