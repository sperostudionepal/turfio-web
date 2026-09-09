import apiClient from './apiClient';

/**
 * A reply can involve several tool round-trips against the LLM provider, so it
 * needs far more headroom than the 10s default on the shared apiClient.
 */
const CHAT_TIMEOUT_MS = 45000;
const STATUS_TIMEOUT_MS = 8000;

/**
 * Chat Service communicating with Express backend `/api/chat` endpoints.
 * The JWT (when present) is attached automatically by the apiClient interceptor,
 * which is what unlocks the personal booking/profile lookups server-side.
 */
export const chatService = {
  /**
   * Send the recent transcript and get the assistant's next reply.
   * @param {Array<{ role: 'user'|'assistant', content: string }>} messages
   */
  async sendMessage(messages) {
    const response = await apiClient.post(
      '/chat',
      { messages },
      { timeout: CHAT_TIMEOUT_MS }
    );
    return response?.data || response; // { reply, meta }
  },

  /**
   * Whether the assistant is configured on the server. Used to hide the widget
   * entirely when no LLM provider key is set.
   */
  async getStatus() {
    const response = await apiClient.get('/chat/status', {
      timeout: STATUS_TIMEOUT_MS,
    });
    return response?.data || response; // { enabled, providers }
  },
};

export default chatService;
