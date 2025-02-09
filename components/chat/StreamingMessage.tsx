import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export default function StreamingMessage() {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="h-2 w-2 rounded-full bg-blue-500/50"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
} 