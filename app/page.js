"use client";

import { useState, useEffect, useRef } from "react";
import GitHubRepoCard from "./components/GitHubRepoCard";

const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path
      d="M3.105 3.105a.75.75 0 01.814-.918l12 4a.75.75 0 010 1.316l-12 4a.75.75 0 01-.814-.918V10.875a.75.75 0 01.75-.75h4.694a.75.75 0 010 1.5H3.855a.75.75 0 01-.75-.75v-4.03Z"
      clipRule="evenodd"
    />
    <path
      d="M9.25 10.125a.75.75 0 01.75-.75h4.694a.75.75 0 010 1.5H10a.75.75 0 01-.75-.75Z"
      clipRule="evenodd"
    />
  </svg>
);

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content:
        "Hello! I'm your OSS Advisor. Ask me about finding open-source projects, specific repositories, or contribution guidelines.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    let storedChatId = localStorage.getItem("chatId");
    if (!storedChatId) {
      storedChatId = `web-session-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 15)}`;
      localStorage.setItem("chatId", storedChatId);
      console.log("Generated new chatId:", storedChatId);
    } else {
      console.log("Retrieved existing chatId:", storedChatId);
    }
    setChatId(storedChatId);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading || !chatId) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      // const response = await fetch("http://localhost:3001/api/chat", {
      const response = await fetch("https://osa-web.vercel.app/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput, chatId: chatId }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Failed to parse error response" }));
        console.error("API Error:", errorData);
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      const aiMessage = {
        role: "ai",
        content: data.response || "Received empty response.",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage = {
        role: "ai",
        content: `Sorry, something went wrong: ${error.message}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (prompt) => {
    setInput(prompt);
  };

  const examplePrompts = [
    "Find beginner-friendly Python data science projects",
    "Show me issues labeled 'good first issue' in 'facebook/react'",
    "What's the license for the 'expressjs/express' repo?",
    "Explain how to make a pull request",
  ];

  const renderContentWithCards = (content) => {
    const bracketRepoPattern =
      /\[https:\/\/github\.com\/([^\/\]]+)\/([^\]\s]+)\]/g;

    let parts = [];
    let lastIndex = 0;
    let match;

    while ((match = bracketRepoPattern.exec(content)) !== null) {
      if (match.index > lastIndex) {
        const textBefore = content.substring(lastIndex, match.index);
        parts.push(
          <span key={`text-${lastIndex}`}>
            {textBefore.split("\n").map((line, i) => (
              <span key={`line-${lastIndex}-${i}`}>
                {line}
                {i < textBefore.split("\n").length - 1 && <br />}
              </span>
            ))}
          </span>
        );
      }

      const owner = match[1];
      const repo = match[2].replace(/[^\w.-]/g, "");

      parts.push(
        <GitHubRepoCard
          key={`repo-${lastIndex}-${owner}-${repo}`}
          owner={owner}
          repo={repo}
        />
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      const remainingText = content.substring(lastIndex);
      parts.push(
        <span key={`text-end-${lastIndex}`}>
          {remainingText.split("\n").map((line, i) => (
            <span key={`line-end-${lastIndex}-${i}`}>
              {line}
              {i < remainingText.split("\n").length - 1 && <br />}
            </span>
          ))}
        </span>
      );
    }

    if (parts.length === 0) {
      return content
        .split("\n")
        .map((line, i) => <p key={`p-${i}`}>{line || "\u00A0"}</p>);
    }

    return <div className="space-y-2">{parts}</div>;
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-gray-200 font-sans">
      <header className="sticky top-0 z-10 bg-slate-700/30 backdrop-blur-md p-4 text-center shadow-lg border-b border-white/10">
        <h1 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          Open Source Advisor
        </h1>
      </header>

      <div className="px-4 pt-3 pb-1 text-center">
        <p className="text-xs text-gray-400 mb-2">Try asking:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {examplePrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleExampleClick(prompt)}
              disabled={isLoading}
              className="text-xs px-3 py-1 rounded-full bg-gray-700/50 hover:bg-cyan-600/30 border border-cyan-700/50 text-cyan-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end space-x-2 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "ai" && (
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex-shrink-0"></div>
            )}

            <div
              className={`relative max-w-xl lg:max-w-2xl px-4 py-2 rounded-xl shadow-md transition-all duration-300 ease-out ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white"
                  : "bg-slate-700/50 backdrop-blur-sm border border-white/10 text-gray-200" // AI bubble - glassy
              }`}
            >
              {msg.role === "ai"
                ? renderContentWithCards(msg.content)
                : msg.content.split("\n").map((line, i) => (
                    <p key={i} className="break-words">
                      {line || "\u00A0"}
                    </p>
                  ))}
            </div>
            {msg.role === "user" && (
              <div className="w-6 h-6 rounded-full bg-gray-600 flex-shrink-0"></div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex-shrink-0 animate-pulse"></div>
            <div className="px-4 py-2 rounded-xl shadow bg-slate-700/50 backdrop-blur-sm border border-white/10 text-gray-400">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <footer className="sticky bottom-0 p-4 bg-gray-800/40 backdrop-blur-md border-t border-white/10 shadow-lg">
        <form onSubmit={sendMessage} className="flex space-x-3 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about projects, issues, contributing..."
            className="flex-1 px-4 py-2 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-700/60 text-gray-100 placeholder-gray-400 transition duration-200"
            disabled={isLoading}
          />
          <button
            type="submit"
            title="Send message"
            className={`p-2 rounded-lg text-white font-semibold transition-all duration-200 ease-in-out ${
              isLoading
                ? "bg-gray-500/50 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-md hover:shadow-lg transform hover:-translate-y-px"
            }`}
            disabled={isLoading}
          >
            <SendIcon />
          </button>
        </form>
      </footer>
    </div>
  );
}
