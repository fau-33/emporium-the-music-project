import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  LoaderCircle,
  MessageCircle,
  Music,
  Plus,
  Send,
  X,
} from "lucide-react";
import { checkApiHealth, sendChatMessage } from "../services/api";
import type { ChatMessage } from "../types";

export const Header: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const conversationIdRef = useRef(0);

  useEffect(() => {
    // Check backend connection status on component mount
    checkApiHealth()
      .catch((error: unknown) => {
        console.error("Backend health check failed:", error);
      });
  }, []);

  useEffect(() => {
    const handleOpenAssistant = () => setIsChatOpen(true);
    window.addEventListener("emporium:open-assistant", handleOpenAssistant);
    return () =>
      window.removeEventListener("emporium:open-assistant", handleOpenAssistant);
  }, []);

  useEffect(() => {
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isSending]);

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = messageInput.trim();
    if (!text || isSending) return;
    const conversationId = conversationIdRef.current;

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      sender: "user",
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setMessageInput("");
    setChatError(null);
    setIsSending(true);

    try {
      const reply = await sendChatMessage(text);
      if (conversationId !== conversationIdRef.current) return;
      const agentMessage: ChatMessage = {
        id: `${Date.now()}-agent`,
        sender: "agent",
        text: reply,
        timestamp: new Date().toISOString(),
      };
      setMessages((currentMessages) => [...currentMessages, agentMessage]);
    } catch (error: unknown) {
      console.error("Failed to send chat message:", error);
      if (conversationId === conversationIdRef.current) {
        setChatError("We couldn't send your message. Please try again.");
      }
    } finally {
      if (conversationId === conversationIdRef.current) {
        setIsSending(false);
      }
    }
  };

  const handleNewConversation = () => {
    conversationIdRef.current += 1;
    setMessages([]);
    setMessageInput("");
    setChatError(null);
    setIsSending(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[rgba(29,28,24,0.13)] bg-[#f4f0e8]/95 text-[#181815] shadow-[0_8px_24px_rgba(29,28,24,0.06)] backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[76px] items-center justify-between gap-3 xl:grid xl:grid-cols-[1fr_auto_1fr]">
            {/* Brand Logo & Title */}
            <a
              href="#home"
              className="flex min-w-0 items-center gap-2.5 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c99545] sm:gap-3"
              aria-label="Empório da Música home"
            >
              <span className="shrink-0 rounded-xl bg-[#c99545] p-2.5 text-[#fffdf8] shadow-md shadow-[#c99545]/20">
                <Music className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-extrabold tracking-[0.08em] text-[#181815] sm:text-base">
                  EMPÓRIO DA MÚSICA
                </span>
                <span className="mt-0.5 block truncate text-[10px] font-medium tracking-wide text-[#756f64] sm:text-xs">
                  Musical Instruments • Campo Grande, MS
                </span>
              </span>
            </a>

            {/* Navigation Links */}
            <nav
              aria-label="Main navigation"
              className="hidden items-center gap-5 text-xs font-semibold text-[#756f64] lg:flex xl:gap-7 xl:text-sm"
            >
              <a
                href="#home"
                className="whitespace-nowrap transition-colors duration-200 hover:text-[#a8752e] focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c99545]"
              >
                Home
              </a>
              <a
                href="#catalog"
                className="whitespace-nowrap transition-colors duration-200 hover:text-[#a8752e] focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c99545]"
              >
                Instruments
              </a>
              <a
                href="#footer"
                className="whitespace-nowrap transition-colors duration-200 hover:text-[#a8752e] focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c99545]"
              >
                Contact
              </a>
            </nav>

            <div className="flex shrink-0 items-center justify-end">
              <button
                type="button"
                onClick={() => setIsChatOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#181815] text-[#e7b25d] shadow-md shadow-black/10 transition-all duration-200 hover:scale-105 hover:bg-[#292821] hover:text-[#f3c879] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c99545] active:scale-95"
                aria-label="Open Music Store Assistant"
                aria-haspopup="dialog"
                aria-expanded={isChatOpen}
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <nav
            aria-label="Main navigation"
            className="-mx-1 flex gap-5 overflow-x-auto px-1 pb-3 text-xs font-semibold text-[#756f64] lg:hidden"
          >
            <a
              href="#home"
              className="shrink-0 rounded-sm transition-colors duration-200 hover:text-[#a8752e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c99545]"
            >
              Home
            </a>
            <a
              href="#catalog"
              className="shrink-0 rounded-sm transition-colors duration-200 hover:text-[#a8752e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c99545]"
            >
              Instruments
            </a>
            <a
              href="#footer"
              className="shrink-0 rounded-sm transition-colors duration-200 hover:text-[#a8752e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c99545]"
            >
              Contact
            </a>
          </nav>
        </div>
      </header>

      {isChatOpen &&
        createPortal(
          <section
            className="fixed inset-x-3 bottom-3 z-[60] flex max-h-[min(34rem,calc(100dvh-1.5rem))] flex-col overflow-hidden rounded-2xl border border-[rgba(29,28,24,0.13)] bg-[#fffdf8] shadow-2xl shadow-black/25 sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[min(24rem,calc(100vw-2rem))]"
            role="dialog"
            aria-modal="false"
            aria-labelledby="music-assistant-title"
          >
            <div className="flex items-center justify-between gap-3 border-b border-[rgba(29,28,24,0.13)] bg-[#f4f0e8] px-4 py-3.5">
              <div>
                <h2
                  id="music-assistant-title"
                  className="text-sm font-bold text-[#181815]"
                >
                  Music Store Assistant
                </h2>
                <p className="mt-0.5 text-xs text-[#756f64]">
                  Seu assistente virtual do Empório da Música
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={handleNewConversation}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold text-[#756f64] transition-colors hover:bg-[#e9e2d6] hover:text-[#181815] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c99545]"
                  aria-label="New conversation"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span>New conversation</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsChatOpen(false)}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#756f64] transition-colors hover:bg-[#e9e2d6] hover:text-[#181815] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c99545]"
                  aria-label="Close assistant"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div
              ref={messageListRef}
              className="min-h-36 flex-1 space-y-3 overflow-y-auto p-4"
              aria-live="polite"
              aria-relevant="additions text"
            >
              {messages.length === 0 && (
                <p className="rounded-2xl rounded-tl-sm bg-[#f4f0e8] px-3.5 py-3 text-sm leading-relaxed text-[#3d3932]">
                  Welcome! Ask us about instruments, availability, or store
                  services.
                </p>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <p
                    className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      message.sender === "user"
                        ? "rounded-br-sm bg-[#181815] text-[#fffdf8]"
                        : "rounded-bl-sm bg-[#f4f0e8] text-[#3d3932]"
                    }`}
                  >
                    {message.text}
                  </p>
                </div>
              ))}
              {isSending && (
                <div
                  className="flex items-center gap-2 text-xs text-[#756f64]"
                  role="status"
                >
                  <LoaderCircle
                    className="h-4 w-4 animate-spin text-[#c99545]"
                    aria-hidden="true"
                  />
                  Assistant is typing...
                </div>
              )}
              {chatError && (
                <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800" role="alert">
                  {chatError}
                </p>
              )}
            </div>

            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-2 border-t border-[rgba(29,28,24,0.13)] p-3"
            >
              <label className="sr-only" htmlFor="assistant-message">
                Your message
              </label>
              <input
                id="assistant-message"
                type="text"
                value={messageInput}
                onChange={(event) => setMessageInput(event.target.value)}
                placeholder="Type your message..."
                autoComplete="off"
                className="h-11 min-w-0 flex-1 rounded-xl border border-[rgba(29,28,24,0.13)] bg-white px-3 text-sm text-[#181815] outline-none transition focus:border-[#c99545] focus:ring-2 focus:ring-[#c99545]/20"
                disabled={isSending}
              />
              <button
                type="submit"
                disabled={isSending || !messageInput.trim()}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#181815] text-[#e7b25d] transition-colors hover:bg-[#292821] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c99545] disabled:cursor-not-allowed disabled:opacity-45"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          </section>,
          document.body,
        )}
    </>
  );
};
