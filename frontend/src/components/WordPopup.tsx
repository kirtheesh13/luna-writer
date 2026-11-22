import React, { useState } from 'react';
import { Bookmark, Check, Volume2, X } from 'lucide-react';
import { api } from '@/lib/api';

interface WordPopupProps {
  word: string;
  position: { top: number; left: number } | null;
  onClose: () => void;
  sourceTitle?: string;
  onWordAdded?: (word: string) => void;
}

export const WordPopup: React.FC<WordPopupProps> = ({
  word,
  position,
  onClose,
  sourceTitle,
  onWordAdded,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!position || !word) return null;

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-GB';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.addVocabulary({
        word,
        definition: 'Saved directly while reading ' + (sourceTitle ? `"${sourceTitle}"` : ''),
        source_title: sourceTitle,
      });
      setIsSaved(true);
      if (onWordAdded) onWordAdded(word);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        top: `${Math.max(10, position.top - 60)}px`,
        left: `${Math.max(10, Math.min(window.innerWidth - 240, position.left - 80))}px`,
      }}
      className="fixed z-50 flex items-center gap-2 rounded-xl border border-border bg-card/95 p-2 shadow-xl backdrop-blur-md animate-fade-in"
    >
      <div className="flex items-center gap-1.5 pl-2 pr-1">
        <span className="font-serif font-bold text-sm text-foreground">{word}</span>
        <button
          onClick={handleSpeak}
          className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
          title="Listen to pronunciation"
        >
          <Volume2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="h-4 w-px bg-border" />

      <button
        onClick={handleSave}
        disabled={isSaved || isSaving}
        className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
          isSaved
            ? 'bg-emerald-500/15 text-emerald-500'
            : 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-xs'
        }`}
      >
        {isSaved ? <Check className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
        <span>{isSaved ? 'Saved' : 'Save Word'}</span>
      </button>

      <button
        onClick={onClose}
        className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
