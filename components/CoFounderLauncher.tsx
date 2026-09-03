"use client";

import { useEffect, useRef, useState } from "react";
import { initialChat, scriptedCofounderReply, scriptedFounderMessage, startupName } from "@/lib/mock-data";
import { ChatMessage } from "@/lib/types";
import { IconSpark } from "./icons";

let idCounter = 100;

function genericReply(): ChatMessage {
  return {
    id: `c_${idCounter++}`,
    role: "cofounder",
    text: "Got it — I've logged that in your startup memory and will factor it into your next recommended action.",
    memoryUpdate: "Startup memory updated",
  };
}

export default function CoFounderLauncher() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialChat);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);

  function send(text: string) {
    if (!text.trim()) return;
    const founderMsg: ChatMessage = { id: `c_${idCounter++}`, role: "founder", text };
    setMessages((prev) => [...prev, founderMsg]);
    setInput("");
    setTyping(true);

    const isScripted = text.trim() === scriptedFounderMessage;

    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, isScripted ? { ...scriptedCofounderReply, id: `c_${idCounter++}` } : genericReply()]);
    }, 900);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-ink-950 text-paper pl-3.5 pr-4.5 py-3 shadow-pop hover:bg-ink-800 transition-all ${
          open ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
        }`}
        style={{ paddingRight: "1.15rem" }}
      >
        <IconSpark className="w-4 h-4 text-accent-300" />
        <span className="text-[13px] font-medium">Ask your co-founder</span>
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-ink-950/20 backdrop-blur-[1px] transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-white border-l border-ink-100 shadow-pop flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-ink-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-ink-950 flex items-center justify-center">
              <IconSpark className="w-4 h-4 text-accent-300" />
            </div>
            <div>
              <p className="text-[13.5px] font-semibold text-ink-950 leading-tight">AI Co-Founder</p>
              <p className="text-[11.5px] text-ink-500 leading-tight">Knows everything about {startupName}</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-ink-400 hover:bg-ink-50 hover:text-ink-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={m.role === "founder" ? "flex justify-end" : "flex justify-start"}>
              <div className={`max-w-[85%] ${m.role === "founder" ? "items-end" : "items-start"} flex flex-col gap-1.5`}>
                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
                    m.role === "founder"
                      ? "bg-ink-950 text-paper rounded-br-sm"
                      : "bg-ink-50 text-ink-800 rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
                {m.memoryUpdate && (
                  <div className="flex items-center gap-1.5 text-[11.5px] text-good-600 font-medium pl-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-good-500" />
                    {m.memoryUpdate}
                  </div>
                )}
                {m.nextAction && (
                  <div className="rounded-xl border border-accent-100 bg-accent-50 px-3 py-2 text-[12.5px] text-accent-800">
                    <span className="font-medium">Next action: </span>
                    {m.nextAction}
                  </div>
                )}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <div className="bg-ink-50 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-ink-300 animate-pulseSoft" />
                <span className="w-1.5 h-1.5 rounded-full bg-ink-300 animate-pulseSoft [animation-delay:0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-ink-300 animate-pulseSoft [animation-delay:0.3s]" />
              </div>
            </div>
          )}
        </div>

        {messages.length < 2 && (
          <div className="px-5 pb-2">
            <button
              onClick={() => send(scriptedFounderMessage)}
              className="text-left w-full text-[12.5px] text-ink-500 border border-dashed border-ink-200 rounded-xl px-3 py-2.5 hover:border-ink-300 hover:text-ink-700 transition-colors"
            >
              Try: “{scriptedFounderMessage}”
            </button>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="px-5 py-4 border-t border-ink-100 shrink-0 flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell your co-founder what happened…"
            className="flex-1 rounded-full border border-ink-200 px-4 py-2.5 text-[13px] outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition-shadow"
          />
          <button
            type="submit"
            className="rounded-full bg-ink-950 text-paper w-9 h-9 flex items-center justify-center shrink-0 hover:bg-ink-800 disabled:opacity-40"
            disabled={!input.trim()}
            aria-label="Send"
          >
            →
          </button>
        </form>
      </div>
    </>
  );
}
