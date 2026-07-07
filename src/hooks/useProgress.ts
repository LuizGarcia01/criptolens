"use client";

import { useState, useEffect } from "react";

const KEY = "criptolens_progress_v1";

export function useProgress() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setCompleted(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  const markComplete = (slug: string) => {
    setCompleted((prev) => {
      const next = prev.includes(slug) ? prev : [...prev, slug];
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const isComplete = (slug: string) => completed.includes(slug);

  return { completed, loaded, markComplete, isComplete };
}
