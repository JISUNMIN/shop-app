"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { getBotResponse } from "./response";
import { initialBotText, quickReplies } from "./constants";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: initialBotText, sender: "bot", timestamp: new Date() },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [showTooltip, setShowTooltip] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (text?: string) => {
    const messageText = (text ?? inputValue).trim();
    if (!messageText) return;
    setSuggestions([]);

    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const reply = getBotResponse(messageText);

      const botResponse: Message = {
        id: Date.now() + 1,
        text: reply.text,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);

      if (reply.suggestions?.length) {
        setSuggestions(reply.suggestions);
      }
    }, 700);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    const key = "chatbot_tooltip_seen";
    const seen = localStorage.getItem(key);

    if (!seen) {
      setShowTooltip(true);
      localStorage.setItem(key, "1");

      const t = setTimeout(() => setShowTooltip(false), 5000);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="relative">
            <Button
              onClick={() => setIsOpen(true)}
              className="relative w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-[1.03] bg-blue-600 hover:bg-blue-700"
              size="icon"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
          </div>

          {showTooltip && (
            <div className="absolute bottom-16 right-0 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg whitespace-nowrap animate-bounce">
              💬 궁금한 점이 있으신가요?
              <div className="absolute -bottom-1 right-6 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          )}
        </div>
      )}

      {isOpen && (
        <Card className="fixed z-50 flex flex-col overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl border border-slate-200 animate-in slide-in-from-bottom-4 duration-200 right-3 bottom-3 w-[calc(100vw-24px)] h-[calc(100vh-24px)] sm:right-6 sm:bottom-6 sm:w-[380px] sm:h-[580px]">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/15 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-base flex items-center gap-2">RoboShop AI</h3>
                <p className="text-[11px] text-white/80 flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-300 rounded-full" />
                  온라인
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white/90 hover:bg-white/15 h-9 w-9 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* 메세지 */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center mr-2 flex-shrink-0">
                    <Bot className="w-4 h-4 text-slate-600" />
                  </div>
                )}

                <div
                  className={`max-w-[78%] rounded-2xl px-3.5 py-3 shadow-sm ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white rounded-tr-md"
                      : "bg-white text-slate-800 border border-slate-200 rounded-tl-md"
                  }`}
                >
                  <p className="text-[13px] whitespace-pre-wrap leading-relaxed">{message.text}</p>
                  <p
                    className={`text-[11px] mt-1.5 ${
                      message.sender === "user" ? "text-white/70" : "text-slate-400"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center mr-2 flex-shrink-0">
                  <Bot className="w-4 h-4 text-slate-600" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-md px-3.5 py-3 shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:120ms]" />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:240ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 자주 묻는 질문*/}
          <div className="px-4 py-3 border-t border-slate-200 bg-white">
            <p className="text-[11px] font-medium text-slate-600 mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-600" />
              자주 묻는 질문
            </p>
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-[11px] h-8 rounded-full border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition"
                  onClick={() => handleSendMessage(reply)}
                >
                  {reply}
                </Button>
              ))}
            </div>
          </div>

          <div className="p-5 border-t bg-white">
            <div className="flex gap-3">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="메시지를 입력하세요..."
                className="flex-1 rounded-full border-2 border-gray-200 focus:border-blue-500 px-4 h-11"
              />
              <Button
                onClick={() => handleSendMessage()}
                size="icon"
                disabled={!inputValue.trim()}
                className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">Enter를 눌러 전송</p>
          </div>
        </Card>
      )}
    </>
  );
}
