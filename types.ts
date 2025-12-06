export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: Date;
}

export interface Topic {
  id: string;
  label: string;
  icon: string;
  prompt: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}