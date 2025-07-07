"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { ChatForm } from "@/components/chat-interface";

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
   
  return (
    <div className=" flex flex-col h-svh antialiased">
      <div className="flex-1 min-h-0">
        <Header onToggleSidebar={handleToggleSidebar} />
          <ChatForm />
      </div>
    </div>
  );
}
