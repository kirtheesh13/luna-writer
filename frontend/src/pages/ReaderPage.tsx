import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  Feather,
  Flame,
  Palette,
  Share2,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import confetti from 'canvas-confetti';

import { api } from '@/lib/api';
import { useTheme } from '@/context/ThemeContext';
import { ReadingHighlight } from '@/types';
import { AIReviewModal } from '@/components/AIReviewModal';
import { WordPopup } from '@/components/WordPopup';

export const ReaderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { readingWidth, fontSize, setIsCustomizerOpen } = useTheme();

  const [popupWord, setPopupWord] = useState<string>('');
  const [popupPos, setPopupPos] = useState<{ top: number; left: number } | null>(null);
  
  // AI Review Modal State
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiData, setAIData] = useState<ReadingHighlight | null>(null);
  const [isAILoading, setIsAILoading] = useState(false);

  // Finished Reading State
  const [isFinished, setIsFinished] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [celebrationMsg, setCelebrationMsg] = useState<string | null>(null);

  // Audio speech synthesis
  const [isSpeaking, setIsSpeaking] = useState(false);

  const { data: writing, isLoading, error } = useQuery({
    queryKey: ['writing', id],
    queryFn: () => api.getWriting(id!),
    enabled: !!id,
  });

  const handleWordClick = (e: React.MouseEvent<HTMLElement>) => {
    const selection = window.getSelection()?.toString().trim();
    const target = e.target as HTMLElement;
    const clickedWord = selection || target.innerText?.trim();

    if (clickedWord && clickedWord.length > 2 && /^[a-zA-Z'-]+$/.test(clickedWord)) {
      const rect = target.getBoundingClientRect();
      setPopupWord(clickedWord);
      setPopupPos({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  };

  const handleAIReviewClick = async () => {
    if (!writing) return;
    setIsAIModalOpen(true);
    if (!aiData) {
      setIsAILoading(true);
      try {
        const res = await api.getReadingHighlights({
          title: writing.title,
          content: writing.content,
          category: writing.category,
        });
        setAIData(res);
      } catch (err) {
        console.error('Error fetching AI highlights:', err);
      } finally {
        setIsAILoading(false);
      }
    }
  };

  const handleFinishedReading = async () => {
    if (!writing || isFinished || isFinishing) return;
    setIsFinishing(true);

    try {
      const res = await api.finishReading({
        writing_id: writing.id,
        writing_title: writing.title,
        category: writing.category,
        word_count: writing.word_count,
      });

      setIsFinished(true);
      setCelebrationMsg(res.message);

      // Trigger celebratory confetti burst!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#7c5cfc', '#f59e0b', '#10b981', '#3b82f6'],
      });
    } catch (err) {
      console.error('Error recording completion:', err);
    } finally {
      setIsFinishing(false);
    }
  };

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window) || !writing) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(writing.content);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl py-24 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4 font-serif text-base text-muted-foreground">Preparing reader...</p>
      </div>
    );
  }

  if (error || !writing) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h2 className="mt-4 font-serif text-xl font-bold text-foreground">Writing Not Found</h2>
        <p className="mt-1 text-xs text-muted-foreground">This piece might have been moved or removed.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
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
              className={`flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors ${
                isSpeaking ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
              title={isSpeaking ? 'Stop audio' : 'Listen to read aloud'}
            >
              {isSpeaking ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              <span>{isSpeaking ? 'Pause Audio' : 'Listen'}</span>
            </button>

            {/* Customizer */}
            <button
              onClick={() => setIsCustomizerOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              title="Appearance & Typography"
            >
              <Palette className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Theme</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Reading Canvas */}
      <article className={`mx-auto ${widthClass} px-4 transition-all duration-200`}>
        
        {/* Article Header */}
        <header className="mb-8 border-b border-border/80 pb-8 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="rounded-md border border-border bg-secondary/80 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-primary">
              {writing.category}
            </span>
            <span className="rounded-md bg-secondary px-2.5 py-0.5 text-xs font-bold text-muted-foreground">
              CEFR Level {writing.level}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1 ml-1">
              <Clock className="h-3 w-3" />
              {writing.reading_time_minutes} min read ({writing.word_count} words)
            </span>
          </div>

          <h1 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
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
                  className="rounded-md border border-border/60 bg-secondary/30 px-2 py-0.5 text-[11px] text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Text Content */}
        <div
          onClick={handleWordClick}
          className={`${fontClass} leading-relaxed text-foreground space-y-6 select-text cursor-text`}
        >
          {writing.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="leading-relaxed">
              {paragraph.split(' ').map((word, wIdx) => (
                <span
                  key={wIdx}
                  className="hover:bg-primary/15 hover:rounded-sm transition-colors cursor-pointer"
                >
                  {word}{' '}
                </span>
              ))}
            </p>
          ))}
        </div>

        {/* Celebratory Completion Alert if Finished */}
        {celebrationMsg && (
          <div className="mt-12 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-center animate-fade-in">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />
            <h4 className="mt-2 font-serif text-lg font-bold text-foreground">
              {celebrationMsg}
            </h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Your reading activity has been recorded in your Achievements and streak tracker!
            </p>
            <Link
              to="/achievements"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
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
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-6 py-3.5 text-sm font-semibold text-primary transition-all hover:bg-primary/20 hover:scale-[1.02] shadow-xs"
          >
            <Sparkles className="h-4 w-4" />
            <span>🤖 AI Review & Learning Highlights</span>
          </button>

          {/* Button 2: Mark as Finished Reading */}
          <button
            onClick={handleFinishedReading}
            disabled={isFinished || isFinishing}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-all shadow-md ${
              isFinished
                ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-500 cursor-default'
                : 'bg-primary text-primary-foreground hover:bg-primary-hover hover:scale-[1.02]'
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
      <WordPopup
        word={popupWord}
        position={popupPos}
        onClose={() => setPopupPos(null)}
        sourceTitle={writing.title}
      />

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
