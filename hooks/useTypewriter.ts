'use client';

import { useState, useEffect } from 'react';

export function useTypewriter(text: string | null, speed: number = 20) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (!text) {
      setDisplayText('');
      return;
    }

    setDisplayText('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(text.substring(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return displayText;
}
