import { useState, useEffect } from 'react';
import { scriptureQuotes } from '@/lib/constants';

export function useScriptureQuote() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setCurrentQuoteIndex(prev => (prev + 1) % scriptureQuotes.length);
    }, 8000); // Rotate every 8 seconds
    
    return () => clearInterval(quoteTimer);
  }, []);

  const currentQuote = scriptureQuotes[currentQuoteIndex];

  return { currentQuote };
} 