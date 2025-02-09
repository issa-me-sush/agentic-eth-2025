import { motion } from 'framer-motion';

interface AppEmbedProps {
  url: string;
}

export default function AppEmbed({ url }: AppEmbedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-[600px] rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm"
    >
      <iframe
        src={url}
        className="w-full h-full"
        frameBorder="0"
        allow="clipboard-write; clipboard-read; web-share"
        allowFullScreen
      />
    </motion.div>
  );
} 