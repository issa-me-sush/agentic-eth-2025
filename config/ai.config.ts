interface AIModelConfig {
  name: string;
  maxTokens: number;
  contextWindow: number;
  temperature: number;
  provider: 'openai' | 'anthropic';
  description: string;
  category: 'premium' | 'standard' | 'fast';
}

interface RAGConfig {
  enabled: boolean;
  provider: 'pinecone' | 'weaviate' | 'none';
  config: {
    environment?: string;
    index?: string;
  };
}

export const AI_MODELS = {
  'gpt-4o': {
    name: 'gpt-4o',
    maxTokens: 16384,
    contextWindow: 128000,
    temperature: 0.7,
    provider: 'openai',
    description: 'Most advanced model with text and image capabilities',
    category: 'premium'
  },
  'gpt-4o-mini': {
    name: 'gpt-4o Mini',
    maxTokens: 16384,
    contextWindow: 128000,
    temperature: 0.7,
    provider: 'openai',
    description: 'Fast and efficient for focused tasks',
    category: 'fast'
  },
  'gpt-4': {
    name: 'gpt-4',
    maxTokens: 8192,
    contextWindow: 8192,
    temperature: 0.7,
    provider: 'openai',
    description: 'Highly capable for complex reasoning',
    category: 'premium'
  },
  'gpt-3.5-turbo': {
    name: 'gpt-3.5 Turbo',
    maxTokens: 4096,
    contextWindow: 4096,
    temperature: 0.7,
    provider: 'openai',
    description: 'Fast and cost-effective',
    category: 'standard'
  },
  'claude-3-opus': {
    name: 'claude-3-opus',
    maxTokens: 4096,
    temperature: 0.7,
    provider: 'anthropic',
  },
} as const;

export const AI_CONFIG = {
  model: AI_MODELS[process.env.AI_MODEL as keyof typeof AI_MODELS] || AI_MODELS['gpt-3.5-turbo'],
  streaming: true,
  providers: {
    openai: {
      enabled: true,
      apiKey: process.env.OPENAI_API_KEY,
    },
    anthropic: {
      enabled: !!process.env.ANTHROPIC_API_KEY,
      apiKey: process.env.ANTHROPIC_API_KEY,
    },
  },
  rag: {
    enabled: process.env.RAG_ENABLED === 'true',
    provider: (process.env.RAG_PROVIDER || 'none') as RAGConfig['provider'],
    config: {
      environment: process.env.PINECONE_ENVIRONMENT,
      index: process.env.PINECONE_INDEX,
    },
  },
} as const;

export type AIProvider = keyof typeof AI_CONFIG.providers;
export type AIModel = keyof typeof AI_MODELS; 