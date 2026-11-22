import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Clock,
  Feather,
  FileText,
  Lock,
  Mail,
  RefreshCw,
  Save,
  Scroll,
  Send,
  Sparkles,
  UploadCloud,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { CategoryType, CefrLevel, WritingEvaluation } from '@/types';

export const WritingStudioPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();

  // Parse category from query param if provided (e.g. /studio?category=articles)
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = (queryParams.get('category') as CategoryType) || 'stories';

  const [writingId, setWritingId] = useState<string | null>(id || null);
  const [category, setCategory] = useState<CategoryType>(initialCategory);
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('General');
  const [level, setLevel] = useState<CefrLevel>('A1');
  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);

  // Auto-save status
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // AI Evaluation State
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<WritingEvaluation | null>(null);
  
  // Flash Message State (specifically for when < A1)
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const [canPublish, setCanPublish] = useState<boolean | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // File Upload State
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing draft if editing
  useEffect(() => {
    if (id) {
      api.getWriting(id).then((w) => {
        setWritingId(w.id);
        setTitle(w.title);
        setCategory(w.category);
        setTopic(w.topic);
        setLevel(w.level);
        setContent(w.content);
        setIsPrivate(w.visibility === 'private');
        setSaveStatus('saved');
      }).catch((e) => console.error('Could not load draft:', e));
    }
  }, [id]);

  // Word count & reading time
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.round(words / 200));

  // Auto-Save effect: triggers 3 seconds after typing stops
  useEffect(() => {
    if (!title.trim() && !content.trim()) return;

    setSaveStatus('unsaved');
    const timer = setTimeout(async () => {
      await performSave(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [title, content, category, topic, level, isPrivate]);

  const performSave = async (showNotification = false) => {
    if (!title.trim() && !content.trim()) return;
    setSaveStatus('saving');

    const draftData = {
      title: title.trim() || 'Untitled Draft',
      content: content.trim() || '...',
      category,
      topic,
      level,
      status: 'draft' as const,
      visibility: isPrivate ? ('private' as const) : ('public' as const),
    };

    try {
      if (writingId) {
        await api.updateWriting(writingId, draftData);
      } else {
        const created = await api.createWriting(draftData);
        setWritingId(created.id);
      }
      setSaveStatus('saved');
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      if (showNotification) {
        setFlashMessage('Draft saved securely to your private vault.');
        setTimeout(() => setFlashMessage(null), 4000);
      }
    } catch (err) {
      console.error('Auto-save error:', err);
      setSaveStatus('unsaved');
    }
  };

  // AI Evaluation
  const handleEvaluate = async () => {
    if (words < 10) {
      setFlashMessage('Please write at least 10 words before evaluating.');
      return;
    }

    setIsEvaluating(true);
    setFlashMessage(null);

    try {
      const result = await api.evaluateWriting({
        title: title.trim() || 'Untitled',
        content,
        category,
      });

      setEvaluation(result);
      setCanPublish(result.can_publish);

      if (!result.can_publish) {
        // Flash message as specifically requested by user!
        setFlashMessage(
          'Sorry, your writing is not up to the mark yet, but you can save it in your private folder to keep practicing!'
        );
      } else {
        setFlashMessage(
          `Excellent work! Your writing is at CEFR Level ${result.cefr_level} and is eligible to be published!`
        );
      }
    } catch (e: any) {
      setFlashMessage(e.message || 'AI evaluation failed. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Publish to Community
  const handlePublish = async () => {
    if (!title.trim() || words < 20) {
      setFlashMessage('Please add a title and write at least 20 words to publish.');
      return;
    }

    // Step 1: Run evaluation if not already done
    setIsEvaluating(true);
    try {
      let evalResult = evaluation;
      if (!evalResult) {
        evalResult = await api.evaluateWriting({
          title,
          content,
          category,
        });
        setEvaluation(evalResult);
        setCanPublish(evalResult.can_publish);
      }

      // Step 2: Check publication gate (must be >= A1)
      if (!evalResult.can_publish) {
        setFlashMessage(
          'Sorry, your writing is not up to the mark yet, but you can save it in your private folder to keep practicing!'
        );
        setIsEvaluating(false);
        return;
      }

      // Step 3: Publish to community showcase
      const publishData = {
        title,
        content,
        category,
        topic,
        level: evalResult.cefr_level,
        status: 'published' as const,
        visibility: 'public' as const,
        ai_evaluation: evalResult,
      };

      if (writingId) {
        await api.updateWriting(writingId, publishData);
      } else {
        const created = await api.createWriting(publishData);
        setWritingId(created.id);
      }

      setPublishSuccess(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        navigate(`/${category}`);
      }, 2500);

    } catch (e: any) {
      setFlashMessage(e.message || 'Failed to publish. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  // File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const data = await api.uploadFile(file);
      setTitle(data.title);
      setContent(data.content);
      setFlashMessage(`Successfully imported "${data.filename}" (${data.word_count} words).`);
      setTimeout(() => setFlashMessage(null), 5000);
    } catch (err: any) {
      setFlashMessage(err.message || 'Failed to parse file.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const categoryOptions: { id: CategoryType; label: string; icon: any }[] = [
    { id: 'stories', label: 'Story', icon: BookOpen },
    { id: 'articles', label: 'Article', icon: Scroll },
    { id: 'letters', label: 'Letter', icon: Feather },
    { id: 'emails', label: 'Email', icon: Mail },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-24 animate-fade-in">
      
      {/* Studio Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs">
        
        {/* Category Type Selector Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1 hidden sm:inline">
            Type:
          </span>
          {categoryOptions.map((opt) => {
            const Icon = opt.icon;
            const active = category === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setCategory(opt.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  active
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'border border-border bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Auto-Save & Privacy Indicators */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          
          {/* Privacy Switch */}
          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold select-none">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
            />
            <Lock className="h-3.5 w-3.5 text-amber-500" />
            <span className={isPrivate ? 'text-foreground' : 'text-muted-foreground'}>
              Keep Private
            </span>
          </label>

          <div className="h-4 w-px bg-border hidden sm:block" />

          {/* Auto-Save status badge */}
          <div className="flex items-center gap-1.5 font-medium">
            {saveStatus === 'saving' ? (
              <>
                <RefreshCw className="h-3 w-3 animate-spin text-primary" />
                <span>Auto-saving...</span>
              </>
            ) : saveStatus === 'saved' ? (
              <>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Saved {lastSavedTime ? `at ${lastSavedTime}` : ''}</span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span>Unsaved changes</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Flash Message Banner */}
      {flashMessage && (
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-4 text-xs sm:text-sm animate-fade-in ${
            canPublish === false
              ? 'border-amber-500/40 bg-amber-500/10 text-amber-200'
              : canPublish === true
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
              : 'border-border bg-secondary/50 text-foreground'
          }`}
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{flashMessage}</span>
          </div>

          {/* If writing is below A1: show button to save in private folder */}
          {canPublish === false && (
            <button
              onClick={() => performSave(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold px-3.5 py-1.5 text-xs shadow-xs shrink-0"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save to Private Folder</span>
            </button>
          )}
        </div>
      )}

      {/* Publish Success Overlay Modal */}
      {publishSuccess && (
        <div className="rounded-2xl border border-emerald-500/50 bg-emerald-500/15 p-6 text-center animate-fade-in">
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400" />
          <h3 className="mt-2 font-serif text-xl font-bold text-foreground">
            🎉 Successfully Published to the Community!
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Your {category.slice(0, -1)} has passed the AI check and is now live in the {category} showcase for everyone to read. Redirecting...
          </p>
        </div>
      )}

      {/* Document Upload Area (Mini Dropzone) */}
      <div className="rounded-2xl border border-dashed border-border/80 bg-secondary/20 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <UploadCloud className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs font-semibold text-foreground">
              Have a draft in Word (.docx), Markdown (.md), or text (.txt)?
            </p>
            <p className="text-[11px] text-muted-foreground">
              Upload it directly to import your content into the studio.
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.md,.docx,.json"
          onChange={handleFileUpload}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="rounded-xl border border-border bg-secondary px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary/70 transition-colors shrink-0"
        >
          {isUploading ? 'Importing file...' : 'Upload Document'}
        </button>
      </div>

      {/* Main Studio Canvas */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm space-y-6">
        
        {/* Title Input */}
        <div>
          <input
            type="text"
            placeholder={`Title of your ${category.slice(0, -1)}...`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground placeholder:text-muted-foreground/40 bg-transparent border-none outline-hidden focus:ring-0"
          />
        </div>

        {/* Metadata Controls */}
        <div className="flex flex-wrap items-center gap-4 text-xs pt-2 border-t border-border/50 text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-foreground">Topic:</span>
            <input
              type="text"
              placeholder="e.g. Travel, Mystery"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground focus:border-primary outline-hidden"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{words} words • {readingTime} min read</span>
          </div>
        </div>

        {/* Content Textarea */}
        <textarea
          rows={16}
          placeholder={`Begin writing your ${category.slice(0, -1)} here...\n\nPour your ideas freely. Auto-save is on, so every sentence is protected.`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full resize-y rounded-2xl border border-input bg-background/50 p-4 sm:p-6 text-sm sm:text-base leading-relaxed text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
        />

        {/* Bottom Studio Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Manual Save Draft Button */}
            <button
              onClick={() => performSave(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-secondary/60 px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-secondary transition-all"
            >
              <Save className="h-4 w-4 text-muted-foreground" />
              <span>Save Draft</span>
            </button>

            {/* AI Quality Check Button */}
            <button
              onClick={handleEvaluate}
              disabled={isEvaluating}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 px-4 py-2.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isEvaluating ? 'Evaluating...' : 'AI Quality Check'}</span>
            </button>
          </div>

          {/* The Publish to Community Button */}
          <button
            onClick={handlePublish}
            disabled={isEvaluating}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary-hover hover:scale-[1.02] disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            <span>Publish to Community Showcase</span>
          </button>
        </div>
      </div>

      {/* AI Evaluation Results Panel (if evaluated) */}
      {evaluation && (
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-foreground">
                  AI Writing Mentor Evaluation
                </h3>
                <span className="text-xs text-muted-foreground">
                  CEFR Benchmark Score: <strong>{evaluation.score}/100</strong> • Level: <strong>{evaluation.cefr_level}</strong>
                </span>
              </div>
            </div>

            <span
              className={`rounded-xl px-3 py-1 text-xs font-bold border ${
                evaluation.can_publish
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                  : 'border-amber-500/40 bg-amber-500/10 text-amber-300'
              }`}
            >
              {evaluation.can_publish ? 'Eligible to Publish ✓' : 'Practice Draft Only'}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-foreground bg-secondary/40 p-3 rounded-xl border border-border">
            {evaluation.verdict_message}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="rounded-xl border border-border p-4 bg-background/50">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Strengths</h4>
              <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                {evaluation.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-500">✓</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvement Tips */}
            <div className="rounded-xl border border-border p-4 bg-background/50">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500">How to Elevate Your Craft</h4>
              <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                {evaluation.improvement_tips.map((t, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-primary">•</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
