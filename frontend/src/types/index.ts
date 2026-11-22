export type CategoryType = 'stories' | 'articles' | 'letters' | 'emails';

export type CefrLevel = 'Pre-A1' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  reading_streak: number;
  last_read_date?: string | null;
}

export interface Writing {
  id: string;
  title: string;
  category: CategoryType;
  topic: string;
  level: CefrLevel;
  status: 'draft' | 'published';
  visibility: 'public' | 'private';
  author_id?: string | null;
  author_name: string;
  description: string;
  content: string;
  tags: string[];
  word_count: number;
  reading_time_minutes: number;
  is_sample: boolean;
  is_bookmarked?: boolean;
  created_at: string;
  updated_at: string;
  ai_evaluation?: WritingEvaluation | null;
}

export interface WritingEvaluation {
  cefr_level: CefrLevel;
  score: number;
  can_publish: boolean;
  verdict_message: string;
  word_count: number;
  lexical_diversity: string;
  avg_sentence_length: number;
  strengths: string[];
  vocabulary_gems: string[];
  improvement_tips: string[];
}

export interface ReadingHighlight {
  title: string;
  category: string;
  cefr_level?: CefrLevel;
  cefr_explanation?: string;
  breakdown: string;
  highlights: string[];
  learning_takeaways: {
    technique: string;
    explanation: string;
  }[];
  key_vocabulary: {
    word: string;
    definition: string;
    sample: string;
  }[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: string | null;
}

export interface ReadingStats {
  today_count: number;
  weekly_total: number;
  weekly_average: number;
  total_completed: number;
  streak_days: number;
  last_read_date?: string | null;
  badges: Badge[];
  recent_history: {
    writing_id: string;
    writing_title: string;
    category: CategoryType;
    word_count: number;
    read_date: string;
    completed_at: string;
  }[];
}

export interface VocabularyWord {
  id: string;
  word: string;
  definition: string;
  example_sentence: string;
  synonyms: string[];
  source_title?: string | null;
  mastery: 'learning' | 'mastered';
  created_at: string;
}

export type ThemeType = 'midnight' | 'cyberpunk' | 'oxford' | 'emerald' | 'sunset' | 'minimal' | 'solar';
export type FontType = 'serif' | 'sans' | 'mono';
export type ReadingWidthType = 'comfortable' | 'compact' | 'wide';
export type FontSize = 'normal' | 'large' | 'xlarge';
