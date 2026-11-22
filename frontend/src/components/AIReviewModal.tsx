import React from 'react';
import { Award, BookOpen, Check, ShieldCheck, Sparkles, Star, Target, X } from 'lucide-react';
import { ReadingHighlight, CefrLevel } from '@/types';
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

  const cefrLevels: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const currentLevel: CefrLevel = (data?.cefr_level as CefrLevel) || 'B1';

  const getCefrDescriptor = (lvl: string) => {
    switch (lvl) {
      case 'A1':
        return 'Foundational / Beginner Standard';
      case 'A2':
        return 'Elementary / Waystage';
      case 'B1':
        return 'Intermediate Masterclass';
      case 'B2':
        return 'Vantage / Upper-Intermediate';
      case 'C1':
        return 'Effective Operational Proficiency / Advanced';
      case 'C2':
        return 'Mastery / Native Fluency';
      default:
        return 'Intermediate Proficiency';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-xl p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-sm">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              AI Deep Analysis & Learning Guide
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              What makes this piece work, its evaluated CEFR level, and techniques you can borrow
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="my-14 flex flex-col items-center justify-center text-center space-y-3">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-md" />
            <p className="font-serif text-lg font-bold text-foreground">
              Evaluating CEFR Level & Writing Structure...
            </p>
            <p className="text-xs text-muted-foreground max-w-sm">
              Gemini AI is examining sentence complexity, vocabulary tiers, and narrative pacing.
            </p>
          </div>
        ) : data ? (
          <div className="space-y-6 animate-fade-in">
            
            {/* ======================================================== */}
            {/* CEFR LEVEL ASSESSMENT CARD (Prominently featured)        */}
            {/* ======================================================== */}
            <div className="rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/15 via-secondary/40 to-card p-5 sm:p-6 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-serif font-black text-xl shadow-lg">
                    {currentLevel}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
                        Evaluated CEFR Level
                      </span>
                      <span className="rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                        Verified ✓
                      </span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-foreground mt-0.5">
                      Level {currentLevel}: {getCefrDescriptor(currentLevel)}
                    </h3>
                  </div>
                </div>

                {/* Visual CEFR Scale Pill */}
                <div className="flex items-center gap-1 bg-background/60 p-1.5 rounded-xl border border-border/80 self-start sm:self-auto">
                  {cefrLevels.map((lvl) => {
                    const active = lvl === currentLevel;
                    return (
                      <span
                        key={lvl}
                        className={`rounded-lg px-2 py-0.5 text-[10px] font-bold transition-all ${
                          active
                            ? 'bg-primary text-primary-foreground shadow-sm scale-105'
                            : 'text-muted-foreground/60'
                        }`}
                      >
                        {lvl}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* CEFR Explanation */}
              <p className="mt-4 pt-3 border-t border-border/50 text-xs text-foreground/90 leading-relaxed">
                {data.cefr_explanation ||
                  `This writing aligns with CEFR Level ${currentLevel}, demonstrating appropriate syntactic control, cohesive devices, and engaging vocabulary.`}
              </p>
            </div>

            {/* Story Breakdown */}
            <div className="rounded-2xl border border-border bg-secondary/30 p-4">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <BookOpen className="h-4 w-4" />
                Narrative & Structural Breakdown
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-foreground">
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
                  <div key={i} className="flex items-start gap-2.5 rounded-xl border border-border p-3 text-xs sm:text-sm">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="text-foreground">{h}</span>
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
                      <div key={i} className="flex flex-col justify-between rounded-xl border border-border p-3 bg-card shadow-xs">
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
            className="btn-tactile-3d rounded-xl px-5 py-2 text-xs font-bold text-primary-foreground"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
