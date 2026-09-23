import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Bot, 
  Minus, 
  X, 
  Search, 
  Calendar, 
  Tag, 
  Users, 
  ArrowUpRight, 
  Paperclip, 
  Send, 
  Zap, 
  RotateCcw
} from 'lucide-react';

import useChatStore, { WELCOME_MESSAGE } from '../../store/useChatStore';
import useAuthStore from '../../store/useAuthStore';
import chatService from '../../services/chatService';
import RichText from './RichText';

const QUICK_ACTIONS = [
  {
    id: 1,
    title: 'Find turfs near me',
    subtitle: 'Search by location',
    icon: Search,
    query: 'Find turfs near me',
  },
  {
    id: 2,
    title: 'Check availability',
    subtitle: 'See live slots',
    icon: Calendar,
    query: 'Which slots are free tomorrow evening?',
  },
  {
    id: 3,
    title: 'Turfs under NPR 1500',
    subtitle: 'Budget friendly',
    icon: Tag,
    query: 'Find turfs in Kathmandu under NPR 1500',
  },
  {
    id: 4,
    title: 'How does booking work?',
    subtitle: 'Get started guide',
    icon: Users,
    query: 'How do I book a turf?',
  },
];

const PROMPT_SUGGESTIONS = [
  'Are there any free slots tomorrow evening?',
  'What payment methods can I use?',
  'Show turfs in Lalitpur',
];

export default function ChatWidget() {
  const isOpen = useChatStore((state) => state.isOpen);
  const messages = useChatStore((state) => state.messages);
  const isSending = useChatStore((state) => state.isSending);
  const toggle = useChatStore((state) => state.toggle);
  const close = useChatStore((state) => state.close);
  const reset = useChatStore((state) => state.reset);
  const sendMessage = useChatStore((state) => state.sendMessage);

  const user = useAuthStore((state) => state.user);

  const [isEnabled, setIsEnabled] = useState(false);
  const [input, setInput] = useState('');

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Hide the widget completely when no LLM provider is configured server-side.
  useEffect(() => {
    let cancelled = false;

    chatService
      .getStatus()
      .then((data) => {
        if (!cancelled) setIsEnabled(Boolean(data?.enabled));
      })
      .catch(() => {
        if (!cancelled) setIsEnabled(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Keep the newest message in view.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSending, isOpen]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') close();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  const submit = (text) => {
    const value = String(text ?? input).trim();
    if (!value || isSending) return;
    setInput('');
    sendMessage(value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  if (!isEnabled) return null;

  const transcript = messages.length > 0 ? messages : [WELCOME_MESSAGE];

  return (
    <>
      {/* Launcher Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            type="button"
            onClick={toggle}
            aria-label="Open the Turfio assistant"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-[5.25rem] right-6 z-[9989] flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-lime-400 text-slate-950 shadow-xl shadow-lime-400/25 transition-all duration-300 hover:scale-110 hover:bg-lime-500 active:scale-95 group"
          >
            <Bot className="h-5 w-5 stroke-[2.4] transition-transform group-hover:rotate-6 text-slate-950" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-900 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-slate-950 border-2 border-white" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-label="Turfio AI"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: 'min(410px, calc(100vw - 2rem))',
              height: 'min(600px, calc(100dvh - 8rem))',
            }}
            className="fixed bottom-[5.25rem] right-6 z-[9989] flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_20px_50px_-10px_rgba(15,23,42,0.18)]"
          >
            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-5 pt-5 pb-3.5 bg-white border-b border-slate-100 shadow-[0_4px_12px_-4px_rgba(15,23,42,0.06)]">
              <div className="flex items-center gap-3">
                {/* Robot Avatar */}
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-lime-400 text-slate-950 shadow-md shadow-lime-400/20 shrink-0">
                  <Bot className="h-6 w-6 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Turfio AI</h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-lime-100 px-2 py-0.5 text-[11px] font-bold text-lime-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-lime-500 animate-pulse" />
                      Online
                    </span>
                  </div>
                  <p className="text-[12px] font-medium text-slate-400">
                    Your futsal booking assistant
                  </p>
                </div>
              </div>

              {/* Window Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={reset}
                  title="Clear chat"
                  aria-label="Clear chat"
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-slate-100/80 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={close}
                  title="Minimize"
                  aria-label="Minimize"
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-slate-100/80 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
                >
                  <Minus className="h-3.5 w-3.5 stroke-[2.5]" />
                </button>
                <button
                  type="button"
                  onClick={close}
                  title="Close"
                  aria-label="Close"
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-slate-100/80 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
                >
                  <X className="h-3.5 w-3.5 stroke-[2.5]" />
                </button>
              </div>
            </header>

            {/* Chat Content Body */}
            <div
              ref={scrollRef}
              role="log"
              aria-live="polite"
              className="flex-1 overflow-y-auto px-5 pt-4 pb-3 space-y-4 bg-white"
            >
              {/* Show welcome prompt or ongoing chat log */}
              {messages.length === 0 ? (
                <div className="space-y-4">
                  {/* Greeting Bubble */}
                  <div className="rounded-xl bg-slate-50/90 p-4 border border-slate-100/80 text-[13px] leading-relaxed text-slate-700">
                    Hi! 👋 I&apos;m <strong>Turfio AI</strong>. I can help you find turfs, check availability, view prices, and answer any questions about bookings. What are you looking for?
                  </div>

                  {/* Quick Actions Header */}
                  <div className="pt-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 text-[13px]">
                        <Zap className="h-4 w-4 text-lime-500 fill-lime-500" />
                        <span>Quick actions</span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 cursor-pointer">
                        See all &gt;
                      </span>
                    </div>

                    {/* 2x2 Grid of Quick Actions */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {QUICK_ACTIONS.map((action) => {
                        const IconComponent = action.icon;
                        return (
                          <button
                            key={action.id}
                            type="button"
                            onClick={() => submit(action.query)}
                            className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-white p-3 text-left transition-all duration-200 hover:border-lime-300 hover:shadow-sm hover:bg-lime-50/20 active:scale-[0.98] group cursor-pointer"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lime-100/70 text-lime-700 transition-colors group-hover:bg-lime-400 group-hover:text-slate-950">
                              <IconComponent className="h-4.5 w-4.5 stroke-[2.2]" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[12px] font-bold text-slate-900 leading-tight truncate">
                                {action.title}
                              </p>
                              <p className="text-[10px] font-medium text-slate-400 leading-tight truncate mt-0.5">
                                {action.subtitle}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Prompt Suggestions Divider */}
                  <div className="relative my-3 text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-100" />
                    </div>
                    <span className="relative bg-white px-3 text-[11px] font-medium text-slate-400">
                      Or ask anything…
                    </span>
                  </div>

                  {/* Prompt Suggestion Pills */}
                  <div className="space-y-2">
                    {PROMPT_SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => submit(suggestion)}
                        className="flex w-full items-center justify-between rounded-xl border border-slate-100/90 bg-white px-4 py-2.5 text-left text-[12px] font-medium text-slate-700 shadow-2xs transition hover:border-lime-400 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.99] cursor-pointer group"
                      >
                        <span className="truncate pr-2">{suggestion}</span>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-700" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Ongoing Message Transcript */
                <div className="space-y-4 pt-1">
                  {transcript.map((message, index) => {
                    const isUser = message.role === 'user';

                    return (
                      <div
                        key={message.ts ?? `seed-${index}`}
                        className={`flex items-end gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        {/* Bot Avatar */}
                        {!isUser && (
                          <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-full bg-lime-400 text-slate-950 shadow-xs mb-0.5">
                            <Bot className="h-4.5 w-4.5 stroke-[2.2]" />
                          </div>
                        )}

                        <div
                          className={`max-w-[78%] px-4 py-3 text-[13px] leading-relaxed ${
                            isUser
                              ? 'bg-lime-400 text-slate-950 font-medium rounded-2xl rounded-br-xs'
                              : message.isError
                                ? 'bg-red-50 text-red-700 rounded-2xl rounded-bl-xs'
                                : 'bg-slate-100/80 text-slate-800 rounded-2xl rounded-bl-xs'
                          }`}
                        >
                          {isUser ? (
                            <p className="whitespace-pre-wrap">{message.content}</p>
                          ) : (
                            <RichText text={message.content} />
                          )}
                        </div>

                        {/* User Avatar */}
                        {isUser && (
                          <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-800 shadow-xs overflow-hidden mb-0.5 border border-slate-200">
                            {(user?.profilePicture || user?.avatar) ? (
                              <img
                                src={user?.profilePicture || user?.avatar}
                                alt={user?.firstName || 'User'}
                                className="h-full w-full object-cover"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />
                            ) : null}
                            {!(user?.profilePicture || user?.avatar) && (
                              <span className="text-[12px] font-bold text-slate-900 uppercase">
                                {(user?.firstName || user?.name || user?.email || 'U').charAt(0)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Typing indicator */}
              {isSending && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 border border-slate-100">
                    <span className="text-[12px] font-medium text-slate-400">Turfio AI is typing</span>
                    <div className="flex items-center gap-1">
                      {[0, 150, 300].map((delay) => (
                        <span
                          key={delay}
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-lime-500"
                          style={{ animationDelay: `${delay}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar & Footer */}
            <div className="p-4 bg-white border-t border-slate-100">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  submit();
                }}
                className="flex items-center gap-2"
              >
                {/* Paperclip Icon */}
                <button
                  type="button"
                  title="Attach file"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100/70 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 cursor-pointer"
                >
                  <Paperclip className="h-4.5 w-4.5 rotate-45 stroke-[2]" />
                </button>

                {/* Input Field */}
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message here..."
                    maxLength={4000}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-[13px] text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-lime-400 focus:bg-white focus:ring-2 focus:ring-lime-400/20"
                  />
                </div>

                {/* Lime Round Send Button */}
                <button
                  type="submit"
                  disabled={!input.trim() || isSending}
                  aria-label="Send message"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lime-400 text-slate-950 shadow-md shadow-lime-400/25 transition hover:bg-lime-500 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none cursor-pointer"
                >
                  <Send className="h-4.5 w-4.5 stroke-[2.4] translate-x-[-0.5px]" />
                </button>
              </form>

              {/* Disclaimer */}
              <p className="mt-2.5 text-center text-[10px] font-medium text-slate-400">
                Turfio AI can make mistakes. Please verify important information.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


