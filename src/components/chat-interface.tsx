"use client";

import type React from "react";
import { cn } from "@/lib/utils";
import { useChat } from "ai/react";
import { ArrowUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { AutoResizeTextarea } from "@/components/autoresize-textarea";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";

export function ChatForm({ className, ...props }: React.ComponentProps<"div">) {
  const [chatSessionId, setChatSessionId] = useState<string | null>(null)

  const { messages, input, setInput, append, isLoading, error } = useChat({
    api: "/api/query",
     body: { chatSessionId }, 
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      void append({ content: input, role: "user" });
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        void append({ content: input, role: "user" });
        setInput("");
      }
    }
  };

  const header = (
    <h1 className="text-5xl font-semibold text-center py-12 leading-none tracking-tight mb-4">
      Ask me anything...
    </h1>
  );
useEffect(() => {
  const createSession = async () => {
    try {
      const res = await fetch("/api/session", {
        method: "POST",
      });
      const data = await res.json();
      setChatSessionId(data.chatSessionId);
    } catch (err) {
      console.error("Failed to create session:", err);
    }
  };

  createSession();
}, []);

  return (
    <div className={cn("flex flex-col h-[90%]", className)} {...props}>
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              {header}
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex w-full",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-900"
                    )}
                  >
                    <ReactMarkdown>
                      {Array.isArray(message.content)
                        ? message.content.join("\n")
                        : message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="text-sm text-gray-500 text-center pt-2">
                  Generating response...
                </div>
              )}
              {error && (
                <div className="text-sm text-red-500 text-center pt-2">
                  Error: {error.message}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Input Area */}
      <div className="border-t relative bottom-0 p-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative flex items-end border border-gray-300 rounded-2xl hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors">
              <AutoResizeTextarea
                value={input}
                onChange={(value) => setInput(value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question in any language..."
                className="flex-1 resize-none border-0 bg-transparent px-4 py-3 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-0 min-h-[44px] max-h-[200px]"
              />
              <div className="flex items-end p-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="submit"
                        size="sm"
                        disabled={!input.trim() || isLoading}
                        className={cn(
                          "h-8 w-8 rounded-full p-0 transition-colors",
                          input.trim()
                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        )}
                      >
                        <ArrowUpIcon size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Send message</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
