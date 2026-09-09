import { create } from 'zustand';
import chatService from '../services/chatService';

const STORAGE_KEY = 'turfio_chat_history';

/** How many messages we keep in localStorage. */
const MAX_STORED = 30;

/** How many messages we send back as context on each request. */
const MAX_CONTEXT = 12;

/**
 * Shown at the top of an empty conversation. Not persisted — it is rendered
 * from here so a cleared chat always starts the same way.
 */
export const WELCOME_MESSAGE = {
  role: 'assistant',
  content:
    "Hi! I'm the **Turfio Assistant**. I can help you find a turf, check which slots are free, and look up your bookings. What are you after?",
};

const loadHistory = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Private mode or disabled storage — start fresh rather than break the widget.
    return [];
  }
};

const saveHistory = (messages) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_STORED)));
  } catch {
    // Quota or disabled storage — the in-memory transcript still works.
  }
};

export const useChatStore = create((set, get) => ({
  isOpen: false,
  messages: loadHistory(),
  isSending: false,
  error: null,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),

  /** Clear the transcript and start over. */
  reset: () => {
    saveHistory([]);
    set({ messages: [], error: null });
  },

  /**
   * Append the user's message, ask the server for a reply, and append that.
   * Failures are surfaced as an inline error bubble and excluded from the
   * context sent on subsequent requests.
   */
  sendMessage: async (text) => {
    const content = String(text || '').trim();
    if (!content || get().isSending) return;

    const withUser = [...get().messages, { role: 'user', content, ts: Date.now() }];
    set({ messages: withUser, isSending: true, error: null });
    saveHistory(withUser);

    try {
      const history = withUser
        .filter((m) => (m.role === 'user' || m.role === 'assistant') && !m.isError)
        .slice(-MAX_CONTEXT)
        .map(({ role, content: text }) => ({ role, content: text }));

      const data = await chatService.sendMessage(history);
      const reply = data?.reply || "Sorry — I couldn't put an answer together for that.";

      // A throttled or not-configured reply is a notice, not an answer: show it,
      // but keep it out of the context sent on later turns so the model never
      // sees it as something it previously said.
      const isNotice = Boolean(data?.meta?.throttled || data?.meta?.disabled);

      const withReply = [
        ...get().messages,
        { role: 'assistant', content: reply, ts: Date.now(), isError: isNotice },
      ];
      set({ messages: withReply, isSending: false });
      saveHistory(withReply);
    } catch (err) {
      const message = err?.message || 'Something went wrong.';
      const withError = [
        ...get().messages,
        {
          role: 'assistant',
          content: `I couldn't reach the assistant just now — ${message}`,
          ts: Date.now(),
          isError: true,
        },
      ];
      set({ messages: withError, isSending: false, error: message });
      saveHistory(withError);
    }
  },
}));

export default useChatStore;
