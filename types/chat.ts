export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  function_call?: {
    name: string;
    arguments: string;
  };
  timestamp: number;
  metadata?: {
    model?: string;
    provider?: string;
    context?: string[];
  };
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error?: string;
}

export interface StreamChunk {
  content: string;
  done: boolean;
}

export interface CustomComponent {
  type: string;
  data: any;
} 