import React from 'react';
import { BookOpen, Check, Sparkles, Star, Target, X } from 'lucide-react';
import { ReadingHighlight } from '@/types';
import { api } from '@/lib/api';

interface AIReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ReadingHighlight | null;
  isLoading: boolean;
  onWordSaved?: (word: string) => void;
}

export const AIReviewModal: React.FC<AIReviewModalProps> = ({
  isOpen,
  onClose,
  data,
  isLoading,
  onWordSaved,
}) => {
  const [savedWords, setSavedWords] = React.useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const handleSaveWord = async (word: string, definition: string) => {
    try {
      await api.addVocabulary({
        word,
        definition,
        source_title: data?.title,
      });
      setSavedWords((prev) => ({ ...prev, [word]: true }));
      if (onWordSaved) onWordSaved(word);
    } catch (e) {
      console.error('Failed to save word:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-card-foreground">
              AI Deep Analysis & Learning Guide
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              What makes this piece work and how you can borrow its strengths
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="my-12 flex flex-col items-center justify-center text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="mt-4 font-serif text-base font-semibold text-foreground">
              Analyzing writing structure and vocabulary...
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Gemini AI is examining sentence patterns, pacing, and literary devices
            </p>
          </div>
        ) : data ? (
          <div className="mt-6 space-y-6">
            
            {/* Story Breakdown */}
            <div className="rounded-xl border border-border bg-secondary/30 p-4">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <BookOpen className="h-4 w-4" />
                Narrative & Structural Breakdown
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-card-foreground">
                {data.breakdown}
              </p>
            </div>

            {/* Highlights */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Key Story Highlights
              </h3>
              <div className="mt-2.5 space-y-2">
                {data.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 rounded-xl border border-border p-3 text-sm">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="text-card-foreground">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actionable Learning Takeaways */}
            <div>
              <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Target className="h-4 w-4 text-primary" />
                Actionable Techniques for Your Own Writing
              </h3>
              <div className="mt-2.5 space-y-2.5">
                {data.learning_takeaways.map((item, i) => (
                  <div key={i} className="rounded-xl border border-border/80 bg-background/50 p-3.5">
                    <span className="font-semibold text-sm text-primary">{item.technique}</span>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Vocabulary Gems */}
            {data.key_vocabulary && data.key_vocabulary.length > 0 && (
              <div>
                <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <Star className="h-4 w-4 text-amber-500 fill-current" />
                  Key Vocabulary in This Piece
                </h3>
                <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {data.key_vocabulary.map((vocab, i) => {
                    const isSaved = savedWords[vocab.word];
                    return (
                      <div key={i} className="flex flex-col justify-between rounded-xl border border-border p-3">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-serif font-bold text-sm text-foreground">{vocab.word}</span>
                            <button
                              onClick={() => handleSaveWord(vocab.word, vocab.definition)}
                              disabled={isSaved}
                              className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border transition-colors ${
                                isSaved
                                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500'
                                  : 'border-border hover:border-primary text-muted-foreground hover:text-primary'
                              }`}
                            >
                              {isSaved ? <Check className="h-3 w-3" /> : <Star className="h-3 w-3" />}
                              <span>{isSaved ? 'Saved' : 'Save'}</span>
                            </button>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">{vocab.definition}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : null}

        <div className="mt-7 border-t border-border pt-4 text-right">
          <button
            onClick={onClose}
            className="rounded-xl bg-secondary px-5 py-2 text-sm font-semibold text-foreground hover:bg-secondary/70"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
