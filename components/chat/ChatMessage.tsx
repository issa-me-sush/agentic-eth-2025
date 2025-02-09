import { motion } from 'framer-motion';
import { Message } from '../../types/chat';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import AppEmbed from '../embed/AppEmbed';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  // Check if message has an embed URL
  const hasEmbed = message.function_call?.name === 'embedApp';
  let embedUrl = null;
  
  if (hasEmbed && message.function_call) {
    try {
      const args = JSON.parse(message.function_call.arguments);
      embedUrl = args.url;
      console.log("Embedding URL in ChatMessage:", embedUrl);
    } catch (e) {
      console.error("Error parsing function arguments:", e);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Always show the text content if it exists */}
      {message.content && (
        <div className="text-base text-neutral-200">
          {message.content}
        </div>
      )}

      {/* Show the iframe if we have a URL */}
      {hasEmbed && embedUrl && (
        <AppEmbed url={embedUrl} />
      )}
    </motion.div>
  );
} 