import { motion } from 'framer-motion';

export default function LoadingIndicator() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-1.5 w-16 bg-primary/20 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary/80 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
} 