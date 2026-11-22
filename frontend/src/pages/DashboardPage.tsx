import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Check,
  Edit3,
  Feather,
  Globe,
  Lock,
  Plus,
  Sparkles,
  Star,
  Trash2,
  User as UserIcon,
  Volume2,
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { VocabularyWord, Writing } from '@/types';

export const DashboardPage: React.FC = () => {
  const { user, openAuthModal } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'drafts' | 'published' | 'vocabulary'>('drafts');

  // Load user writings
  const { data: myWritings, isLoading: isWritingsLoading } = useQuery({
    queryKey: ['my_writings'],
    queryFn: () => api.getMyWritings(),
    enabled: !!user,
  });

  // Load vocabulary
  const { data: vocabulary, isLoading: isVocabLoading } = useQuery({
    queryKey: ['my_vocabulary'],
    queryFn: () => api.getVocabulary(),
  });

  // Delete writing mutation
  const deleteWritingMutation = useMutation({
    mutationFn: (id: string) => api.deleteWriting(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my_writings'] });
    },
  });

  // Delete vocab mutation
  const deleteVocabMutation = useMutation({
    mutationFn: (id: string) => api.deleteVocabulary(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my_vocabulary'] });
    },
  });

  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(word);
      u.lang = 'en-GB';
      window.speechSynthesis.speak(u);
    }
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-md py-20 text-center animate-fade-in">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <Lock className="h-8 w-8" />
        </div>
        <h2 className="mt-4 font-serif text-2xl font-bold text-foreground">
          Sign In to Access Your Private Vault
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Your private drafts, works-in-progress, and personal vocabulary words are safely protected under your private account.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary-hover transition-all"
        >
          <span>Sign In or Register</span>
        </button>
      </div>
    );
  }

  const drafts = myWritings?.items?.filter((w) => w.visibility === 'private' || w.status === 'draft') || [];
  const published = myWritings?.items?.filter((w) => w.visibility === 'public' && w.status === 'published') || [];

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* User Header Profile Card */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-serif text-2xl font-bold shadow-md">
            {user.full_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">
              {user.full_name}
            </h1>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <span>{user.email}</span>
              <span>•</span>
              <span>Writer Profile</span>
            </p>
          </div>
        </div>

        <Link
          to="/studio"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary-hover transition-all self-start sm:self-auto"
        >
          <Feather className="h-4 w-4" />
          <span>New Writing Draft</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex rounded-2xl border border-border bg-card p-1.5 gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('drafts')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'drafts'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
          }`}
        >
          <Lock className="h-4 w-4" />
          <span>My Private Vault / Drafts ({drafts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('published')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'published'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
          }`}
        >
          <Globe className="h-4 w-4" />
          <span>My Published Pieces ({published.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('vocabulary')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'vocabulary'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
          }`}
        >
          <Star className="h-4 w-4 fill-current text-amber-500" />
          <span>My Word Bank ({vocabulary?.length || 0})</span>
        </button>
      </div>

      {/* Tab 1: Private Vault / Drafts */}
      {activeTab === 'drafts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>Only you have access to these drafts. They remain confidential until published.</span>
          </div>

          {drafts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/40"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                        {draft.category}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-amber-500 font-semibold">
                        <Lock className="h-3 w-3" />
                        Private Draft
                      </span>
                    </div>

                    <h3 className="mt-3 font-serif text-base font-bold text-foreground">
                      {draft.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {draft.content}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-muted-foreground text-[11px]">{draft.word_count} words</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => deleteWritingMutation.mutate(draft.id)}
                        className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete draft"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <Link
                        to={`/studio/${draft.id}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-secondary px-2.5 py-1 font-semibold text-foreground hover:bg-secondary/80 transition-colors"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-primary" />
                        <span>Edit</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <Lock className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <h3 className="mt-3 font-serif text-base font-bold text-foreground">
                Your private vault is empty
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Start writing a new draft—everything you type will be securely auto-saved here.
              </p>
              <Link
                to="/studio"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
              >
                <Feather className="h-3.5 w-3.5" />
                <span>Open Writing Studio</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Published Pieces */}
      {activeTab === 'published' && (
        <div className="space-y-4">
          <div className="text-xs text-muted-foreground px-1">
            <span>These writings passed the AI quality check and are publicly visible to all readers.</span>
          </div>

          {published.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {published.map((w) => (
                <div
                  key={w.id}
                  className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                        {w.category}
                      </span>
                      <span className="rounded-md bg-emerald-500/15 text-emerald-500 px-2 py-0.5 text-[10px] font-bold">
                        CEFR {w.level}
                      </span>
                    </div>

                    <h3 className="mt-3 font-serif text-base font-bold text-foreground">
                      {w.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {w.description || w.content}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-muted-foreground text-[11px]">{w.word_count} words</span>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/reader/${w.id}`}
                        className="rounded-lg bg-primary/10 text-primary px-2.5 py-1 font-semibold hover:bg-primary/20 transition-colors"
                      >
                        View in Reader →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <Globe className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <h3 className="mt-3 font-serif text-base font-bold text-foreground">
                No published pieces yet
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Write a story, article, letter, or email and click "Publish to Community" once it meets the A1 benchmark!
              </p>
              <Link
                to="/studio"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
              >
                <Feather className="h-3.5 w-3.5" />
                <span>Write Now</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Vocabulary Vault */}
      {activeTab === 'vocabulary' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>Words you discovered and saved while reading. Click the speaker to hear pronunciation.</span>
          </div>

          {vocabulary && vocabulary.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vocabulary.map((vocab) => (
                <div
                  key={vocab.id}
                  className="rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-base text-foreground capitalize">
                          {vocab.word}
                        </span>
                        <button
                          onClick={() => speakWord(vocab.word)}
                          className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                          title="Listen"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => deleteVocabMutation.mutate(vocab.id)}
                        className="p-1 text-muted-foreground hover:text-destructive"
                        title="Remove word"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      {vocab.definition}
                    </p>

                    {vocab.source_title && (
                      <span className="mt-2 block text-[10px] text-primary/80 italic">
                        Found in: {vocab.source_title}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <Star className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <h3 className="mt-3 font-serif text-base font-bold text-foreground">
                Your Vocabulary Vault is empty
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Click or highlight any unfamiliar word while reading to save it straight to your personal vault!
              </p>
              <Link
                to="/stories"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Explore Stories</span>
              </Link>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
