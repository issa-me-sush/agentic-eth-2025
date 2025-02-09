import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="relative w-full max-w-4xl mx-auto"
      initial={false}
    >
      <div className="relative flex items-end rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="what do you wanna do on web3 today?"
          className="w-full p-4 pr-20 text-base rounded-2xl border-0 bg-transparent focus:ring-0 focus:outline-none resize-none max-h-[200px] placeholder:text-gray-500"
          disabled={disabled}
          rows={1}
        />
        <div className="absolute right-2 bottom-2">
          <AnimatePresence mode="wait">
            <motion.button
              key={disabled ? 'loading' : 'send'}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              type="submit"
              disabled={disabled || !input.trim()}
              className="p-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {disabled ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </motion.button>
          </AnimatePresence>
        </div>
      </div>
      
      <motion.div 
        initial={false}
        animate={{ 
          opacity: input.length > 0 ? 1 : 0,
          y: input.length > 0 ? 0 : 5
        }}
        className="absolute -bottom-6 left-4 text-xs text-gray-500"
      >
        Press ⏎ to send, Shift + ⏎ for new line
      </motion.div>
    </motion.form>
  );
} 