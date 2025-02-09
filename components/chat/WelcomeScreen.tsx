import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';

interface WelcomeScreenProps {
  onStart: (message: string) => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onStart(query.trim());
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto p-4"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-block p-3 rounded-2xl bg-gradient-to-r from-neutral-900 to-neutral-800 mb-6"
        >
          <Sparkles className="w-8 h-8 text-neutral-200" />
        </motion.div>
        <h1 className="text-4xl font-bold mb-3 text-neutral-200">
          How can I assist you today?
        </h1>
        <p className="text-neutral-400">
          Ask anything about blockchain and web3
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question..."
          className="w-full px-6 py-4 bg-neutral-900 border border-neutral-800 rounded-2xl text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-700 transition-all"
        />

        <div className="grid grid-cols-2 gap-3">
          {[
            "Explain blockchain technology",
            "Help with smart contracts",
            "Compare DeFi protocols",
            "Analyze NFT trends"
          ].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => onStart(suggestion)}
              className="p-4 text-sm text-left bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </form>
    </motion.div>
  );
} 