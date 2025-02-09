import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../../lib/hooks/useChat';
import ChatMessage from './ChatMessage';
import StreamingMessage from './StreamingMessage';
import WelcomeScreen from './WelcomeScreen';
import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import Image from 'next/image';

export default function ChatContainer() {
  const { messages, isLoading, sendMessage } = useChat();
  const [hasInteracted, setHasInteracted] = useState(false);
  const [query, setQuery] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      setHasInteracted(true);
      sendMessage(query.trim());
      setQuery('');
      bottomRef.current?.scrollIntoView({ behavior: 'auto' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Logo in top left */}
      <div className="fixed top-6 left-6">
        <Image 
          src="/logo.png" 
          alt="Bot Logo" 
          width={40} 
          height={40}
          className="rounded-lg"
        />
      </div>

      <AnimatePresence mode="wait">
        {!hasInteracted ? (
          <motion.div
            key="welcome"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen flex items-center justify-center"
          >
            <WelcomeScreen onStart={(message) => {
              setHasInteracted(true);
              sendMessage(message);
            }} />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col"
          >
            {/* Messages container */}
            <div className="flex-1 overflow-y-auto px-4 pt-20 pb-40">
              <div className="max-w-4xl mx-auto space-y-8">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* User query */}
                    {message.role === 'user' && (
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <Search className="h-4 w-4" />
                        <span>{message.content}</span>
                      </div>
                    )}
                    
                    {/* AI response */}
                    {message.role === 'assistant' && (
                      <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl p-6 border border-neutral-800">
                        <ChatMessage message={message} />
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-neutral-900/50 backdrop-blur-sm rounded-xl p-6 border border-neutral-800"
                  >
                    <StreamingMessage />
                  </motion.div>
                )}
                <div ref={bottomRef} className="h-px" />
              </div>
            </div>

            {/* Fixed search input at bottom */}
            <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent pt-20 pb-8">
              <div className="max-w-4xl mx-auto px-4">
                <motion.form 
                  onSubmit={handleSubmit}
                  layout
                >
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="what do you wanna do on web3 today?"
                      className="w-full py-3 pl-12 pr-4 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                      disabled={isLoading}
                    />
                  </div>
                </motion.form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 