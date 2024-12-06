"use client";
import LandingSections from "@/components/LandingSections";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { ArrowDownCircleIcon, MessageCircle, X } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
export default function Chat() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showChatIcon, setShowChatIcon] = useState(false);
  const chatIconRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowChatIcon(true);
      } else {
        setShowChatIcon(false);
        setIsChatOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <LandingSections />
      <AnimatePresence>
        {showChatIcon && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-4 right-4 z-50">
            <Button ref={chatIconRef} onClick={toggleChat} size="icon" className="rounded-full shadow-lg p-2 size-14">
              {!isChatOpen ? <MessageCircle className="size-12" /> : <ArrowDownCircleIcon />}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 70, x: 230, scale: 0 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: 70, x: 230, scale: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed bottom-20 right-6 z-50 w-[95%] md:w-[500px] rounded-lg">
            <Card className="border-2">
              <CardHeader className="flex flex-row space-y-0 items-center justify-between pb-3">
                <CardTitle className="text-lg font-bold">Chat with NoteWorthy Ai</CardTitle>
                <Button onClick={toggleChat} variant="ghost" size="sm" className="px-2 py-0">
                  <X className="size-4" />
                  <span className="sr-only"> Close Chat </span>
                </Button>
              </CardHeader>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
