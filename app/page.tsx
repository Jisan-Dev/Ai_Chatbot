"use client";
import LandingSections from "@/components/LandingSections";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { ArrowDownCircleIcon, Loader2, MessageCircle, Send, X } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
export default function Chat() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showChatIcon, setShowChatIcon] = useState(false);
  const chatIconRef = useRef<HTMLButtonElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, stop, reload, error } = useChat({ api: "/api/gemini" });

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
            initial={{ opacity: 0, y: 220, x: 230, scale: 0 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: 220, x: 230, scale: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed bottom-20 right-6 z-50 w-[95%] md:w-[500px] rounded-lg">
            <Card className="border-2">
              <CardHeader className="flex flex-row space-y-0 items-center justify-between pb-3">
                <CardTitle className="text-lg font-bold">Chat with NoteWorthy Ai</CardTitle>
                <Button onClick={toggleChat} variant="ghost" size="sm" className="px-2 py-0">
                  <X className="size-4" />
                  <span className="sr-only"> Close Chat </span>
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  {messages?.length === 0 && <div className="w-full mt-32 text-gray-500 flex gap-3 items-center justify-center">No messages yet.</div>}
                  {messages?.map((message, index) => (
                    <div key={index} className="flex flex-col items-center space-y-2 px-4 py-3 text-sm">
                      fdsdd
                    </div>
                  ))}
                  {isLoading && (
                    <div className="w-full items-center flex justify-center gap-3">
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                      <button className="underline" type="button" onClick={() => stop()}>
                        abort
                      </button>
                    </div>
                  )}
                  {error && (
                    <div className="w-full items-center flex justify-center gap-3">
                      <div>An error occurred</div>
                      <button className="underline" type="button" onClick={() => reload()}>
                        Retry
                      </button>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
                  <Input value={input} onChange={handleInputChange} className="flex-1" placeholder="Type your message here..." />
                  <Button type="submit" className="size-9" size="icon" disabled={isLoading}>
                    <Send className="size-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
