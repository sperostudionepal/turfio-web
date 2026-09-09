import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X, Send, RotateCcw } from 'lucide-react';

import useChatStore, { WELCOME_MESSAGE } from '../../store/useChatStore';
import chatService from '../../services/chatService';
import RichText from './RichText';

const SUGGESTIONS = [
  'Find turfs in Kathmandu under NPR 1500',
  'Which slots are free tomorrow evening?',
  'How does split payment work?',
];

export default function ChatWidget() {
  const isOpen = useChatStore((state) => state.isOpen);
  const messages = useChatStore((state) => state.messages);
  const isSending = useChatStore((state) => state.isSending);
  const toggle = useChatStore((state) => state.toggle);
  const close = useChatStore((state) => state.close);
  const reset = useChatStore((state) => state.reset);
  const sendMessage = useChatStore((state) => state.sendMessage);

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
      {/* Launcher — sits above the accessibility button in the same corner. */}
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
            className="fixed bottom-24 right-6 z-[9989] flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-slate-900 text-lime-400 shadow-[0_8px_25px_rgba(15,23,42,0.35)] transition-all duration-300 hover:scale-110 hover:bg-slate-800 active:scale-95"
          >
            <MessageCircle className="h-5 w-5 stroke-[2.4]" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-label="Turfio assistant"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{
              width: 'min(380px, calc(100vw - 3rem))',
              height: 'min(560px, calc(100dvh - 9rem))',
            }}
            className="fixed bottom-24 right-6 z-[9989] flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.25)]"
          >
            <header className="flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-900 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lime-400">
                  <MessageCircle className="h-4 w-4 stroke-[2.6] text-slate-950" />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-extrabold text-white">Turfio Assistant</p>
                  <p className="text-[11px] font-medium text-slate-400">
                    Turfs, slots &amp; bookings
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={reset}
                  aria-label="Clear conversation"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close the assistant"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </header>

            <div
              ref={scrollRef}
              role="log"
              aria-live="polite"
              className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-4"
            >
              {transcript.map((message, index) => {
                const isUser = message.role === 'user';

                return (
                  <div
                    key={message.ts ?? `seed-${index}`}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] shadow-sm ${
                        isUser
                          ? 'bg-slate-900 text-white'
                          : message.isError
                            ? 'border border-red-100 bg-red-50 text-red-700'
                            : 'border border-slate-100 bg-white text-slate-700'
                      }`}
                    >
                      {isUser ? (
                        <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      ) : (
                        <RichText text={message.content} />
                      )}
                    </div>
                  </div>
                );
              })}

              {isSending && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl border border-slate-100 bg-white px-3.5 py-3 shadow-sm">
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {messages.length === 0 && !isSending && (
                <div className="space-y-2 pt-1">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => submit(suggestion)}
                      className="block w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-[12px] font-semibold text-slate-600 transition hover:border-lime-400 hover:text-slate-900"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                submit();
              }}
              className="flex items-end gap-2 border-t border-slate-100 bg-white px-3 py-3"
            >
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about turfs, slots or your bookings…"
                maxLength={4000}
                className="max-h-28 flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-lime-400 focus:bg-white"
              />
              <button
                type="submit"
                disabled={!input.trim() || isSending}
                aria-label="Send message"
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-lime-400 text-slate-950 transition hover:bg-lime-500 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                <Send className="h-4 w-4 stroke-[2.4]" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
