import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Feather, Heart, Mail, Moon, Scroll, Trophy } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border/60 bg-card/40 mt-16 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          
          {/* Brand Info */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                <Moon className="h-4 w-4 fill-current" />
              </div>
              <span className="font-serif text-lg font-bold text-foreground">
                Luna Writer
              </span>
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              A transformative platform designed to elevate aspiring writers through deep reading, vocabulary mastery, and AI-guided craft polishing.
            </p>
          </div>

          {/* Reading Rooms */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-card-foreground">
              Reading Rooms
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link to="/stories" className="text-muted-foreground hover:text-primary transition-colors">
                  Short Stories & Fiction
                </Link>
              </li>
              <li>
                <Link to="/articles" className="text-muted-foreground hover:text-primary transition-colors">
                  Educational Articles & Essays
                </Link>
              </li>
              <li>
                <Link to="/letters" className="text-muted-foreground hover:text-primary transition-colors">
                  Formal & Informal Letters
                </Link>
              </li>
              <li>
                <Link to="/emails" className="text-muted-foreground hover:text-primary transition-colors">
                  Practical Everyday Emails
                </Link>
              </li>
            </ul>
          </div>

          {/* Writer Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-card-foreground">
              Writing & Growth
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link to="/studio" className="text-muted-foreground hover:text-primary transition-colors">
                  Writing Studio & Prompts
                </Link>
              </li>
              <li>
                <Link to="/achievements" className="text-muted-foreground hover:text-primary transition-colors">
                  Achievements & Reading Habits
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  My Private Vault & Drafts
                </Link>
              </li>
            </ul>
          </div>

          {/* Quality & Levels */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-card-foreground">
              CEFR Standards
            </h4>
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
              Writings are benchmarked against international standards: from A1 (Beginner) to C2 (Mastery), with automated Gemini AI evaluation and feedback.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
                <span
                  key={lvl}
                  className="rounded-md border border-border px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground bg-secondary/40"
                >
                  {lvl}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Luna Writer & Masterclass. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">
            Built with care for writers evolving everyday.
          </p>
        </div>
      </div>
    </footer>
  );
};
