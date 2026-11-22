import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  Feather,
  Heart,
  Palette,
  Share2,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { WordPopup } from '@/components/WordPopup';
import { AIReviewModal } from '@/components/AIReviewModal';
import { ReadingHighlight } from '@/types';

export const ReaderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, font, fontSize, readingWidth, setIsCustomizerOpen } = useTheme();

  const [popupWord, setPopupWord] = useState<string | null>(null);
  const [popupPos, setPopupPos] = useState<{ top: number; left: number } | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [celebrationMsg, setCelebrationMsg] = useState<string | null>(null);

  // AI Modal
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiData, setAiData] = useState<ReadingHighlight | null>(null);
  const [isAILoading, setIsAILoading] = useState(false);

  // Scroll Progress
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch writing
  const { data: writing, isLoading, error } = useQuery({
    queryKey: ['writing', id],
    queryFn: () => (id ? api.getWriting(id) : Promise.reject('No ID')),
    enabled: !!id,
    retry: 2,
  });

  // Speech synthesis cleanup
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window) || !writing) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(writing.content);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleWordClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target && target.tagName === 'SPAN') {
      const word = target.innerText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’]/g, '').trim();
      if (word && word.length > 1) {
        const rect = target.getBoundingClientRect();
        setPopupWord(word);
        setPopupPos({
          top: rect.bottom + window.scrollY + 6,
          left: rect.left + window.scrollX,
        });
      }
    }
  };

  const handleAIReviewClick = async () => {
    if (!writing) return;
    setIsAIModalOpen(true);
    setIsAILoading(true);
    try {
      const res = await api.getReadingHighlights({
        title: writing.title,
        content: writing.content,
        category: writing.category,
      });
      if (!res.cefr_level && writing.level) {
        res.cefr_level = writing.level;
      }
      setAiData(res);
    } catch (err) {
      console.error('Failed to generate AI review:', err);
      // Fallback with writing's level
      setAiData({
        title: writing.title,
        category: writing.category,
        cefr_level: writing.level,
        cefr_explanation: `Assessed at CEFR Level ${writing.level} with appropriate grammatical control and vocabulary.`,
        breakdown: writing.description || 'A well-crafted piece featuring structured progression.',
        highlights: [
          'Effective narrative tone and cohesive scene construction.',
          'Atmospheric pacing that draws the reader in.',
        ],
        learning_takeaways: [
          { technique: 'Pacing & Tone', explanation: 'Balances descriptive pacing with narrative momentum.' },
        ],
        key_vocabulary: [],
      });
    } finally {
      setIsAILoading(false);
    }
  };

  const handleFinishedReading = async () => {
    if (!writing || isFinished || isFinishing) return;
    setIsFinishing(true);

    try {
      // Trigger confetti celebration!
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'],
        });
      } catch (e) {
        // Safe confetti fallback
      }

      await api.finishReading({
        writing_id: writing.id,
        writing_title: writing.title,
        category: writing.category,
        word_count: writing.word_count,
      });
      setIsFinished(true);
      setCelebrationMsg(`Outstanding! You finished "${writing.title}". Today's count updated.`);
    } catch (err) {
      console.error('Failed to log reading:', err);
      // Still celebrate UI-side
      setIsFinished(true);
      setCelebrationMsg(`Congratulations on finishing "${writing.title}"!`);
    } finally {
      setIsFinishing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 py-12 animate-pulse">
        <div className="h-8 w-40 rounded-xl bg-secondary" />
        <div className="h-14 w-full rounded-2xl bg-secondary" />
        <div className="space-y-3 pt-6">
          <div className="h-4 w-full rounded bg-secondary" />
          <div className="h-4 w-5/6 rounded bg-secondary" />
          <div className="h-4 w-4/6 rounded bg-secondary" />
        </div>
      </div>
    );
  }

  if (error || !writing) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h2 className="mt-4 font-serif text-2xl font-bold text-foreground">
          Writing Not Found
        </h2>
        <p className="mt-2 text-xs text-muted-foreground">
          The requested piece could not be loaded or may have been removed.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="btn-tactile-3d mt-6 inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold text-primary-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Go Back</span>
        </button>
      </div>
    );
  }

  const widthClass =
    readingWidth === 'compact'
      ? 'reader-container-compact'
      : readingWidth === 'wide'
      ? 'reader-container-wide'
      : 'reader-container-comfortable';

  const fontClass =
    fontSize === 'large' ? 'text-lg sm:text-xl' : fontSize === 'xlarge' ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg';

  return (
    <div className="relative pb-24">
      
      {/* Dynamic 3D Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-border/40">
        <div
          className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Top Reading Navigation Bar */}
      <div className="sticky top-16 z-30 mb-8 border-b border-border/50 bg-background/90 backdrop-blur-md py-3 transition-colors">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4">
          <Link
            to={`/${writing.category}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to {writing.category.charAt(0).toUpperCase() + writing.category.slice(1)}</span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Audio Listen */}
            <button
              onClick={toggleSpeech}
              className={`flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-semibold transition-all ${
                isSpeaking ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
              title={isSpeaking ? 'Stop audio' : 'Listen to read aloud'}
            >
              {isSpeaking ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              <span>{isSpeaking ? 'Pause Audio' : 'Listen'}</span>
            </button>

            {/* Customizer */}
            <button
              onClick={() => setIsCustomizerOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground"
              title="Appearance & Typography"
            >
              <Palette className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Theme</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 3D Editorial Book Canvas */}
      <article className={`mx-auto ${widthClass} px-6 sm:px-12 py-10 rounded-4xl book-3d-canvas border border-border/80 transition-all duration-300 shadow-2xl`}>
        
        {/* Article Header */}
        <header className="mb-10 border-b border-border/80 pb-8 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              {writing.category}
            </span>
            <span className="rounded-lg bg-secondary px-3 py-1 text-xs font-bold text-muted-foreground">
              CEFR Level {writing.level}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1 ml-1 font-medium">
              <Clock className="h-3.5 w-3.5" />
              {writing.reading_time_minutes} min read ({writing.word_count} words)
            </span>
          </div>

          <h1 className="mt-5 font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.18]">
            {writing.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-muted-foreground">
            <span>By <strong className="text-foreground">{writing.author_name}</strong></span>
            <span>•</span>
            <span>Topic: {writing.topic}</span>
          </div>

          {writing.tags && writing.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-1.5">
              {writing.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-border/60 bg-secondary/40 px-2 py-0.5 text-[11px] text-muted-foreground font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Text Content with Word Dictionary on Click */}
        <div
          onClick={handleWordClick}
          className={`${fontClass} leading-relaxed text-foreground space-y-6 select-text cursor-text`}
        >
          {writing.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="leading-relaxed">
              {paragraph.split(' ').map((word, wIdx) => (
                <span
                  key={wIdx}
                  className="hover:bg-primary/20 hover:rounded-sm transition-colors cursor-pointer"
                >
                  {word}{' '}
                </span>
              ))}
            </p>
          ))}
        </div>

        {/* Celebratory Completion Alert if Finished */}
        {celebrationMsg && (
          <div className="mt-12 rounded-3xl border border-emerald-500/40 bg-emerald-500/10 p-6 text-center animate-fade-in shadow-lg">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
            <h4 className="mt-3 font-serif text-xl font-bold text-foreground">
              {celebrationMsg}
            </h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Your reading activity has been recorded in your Achievements and streak tracker!
            </p>
            <Link
              to="/achievements"
              className="btn-tactile-3d mt-4 inline-flex items-center gap-1.5 rounded-2xl px-5 py-2.5 text-xs font-bold text-primary-foreground"
            >
              <span>View Reading Achievements</span>
              <span>→</span>
            </Link>
          </div>
        )}

        {/* ======================================================== */}
        {/* TWO BOTTOM ACTION BUTTONS: AI REVIEW & FINISHED READING */}
        {/* ======================================================== */}
        <div className="mt-14 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Button 1: AI Review & Highlights */}
          <button
            onClick={handleAIReviewClick}
            className="btn-tactile-secondary w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border-primary/40 px-6 py-3.5 text-sm font-bold text-primary"
          >
            <Sparkles className="h-4 w-4" />
            <span>🤖 AI Review & Learning Highlights</span>
          </button>

          {/* Button 2: Mark as Finished Reading */}
          <button
            onClick={handleFinishedReading}
            disabled={isFinished || isFinishing}
            className={`btn-tactile-3d w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl px-7 py-3.5 text-sm font-bold ${
              isFinished
                ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-400 cursor-default opacity-90'
                : 'text-primary-foreground'
            }`}
          >
            {isFinished ? (
              <>
                <Check className="h-4 w-4" />
                <span>Finished Reading ✓</span>
              </>
            ) : (
              <>
                <Trophy className="h-4 w-4" />
                <span>{isFinishing ? 'Saving...' : '✅ Finished Reading'}</span>
              </>
            )}
          </button>
        </div>

      </article>

      {/* Dictionary / Vocabulary Popup */}
      {popupWord && popupPos && (
        <WordPopup
          word={popupWord}
          position={popupPos}
          onClose={() => {
            setPopupPos(null);
            setPopupWord(null);
          }}
          sourceTitle={writing.title}
        />
      )}

      {/* AI Review Deep Dive Modal */}
      <AIReviewModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        data={aiData}
        isLoading={isAILoading}
      />

    </div>
  );
};
