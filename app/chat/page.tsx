import type { Metadata } from "next";
import { Suspense } from "react";
import ChatWorkspace from "@/app/components/ChatWorkspace";

export const metadata: Metadata = {
  title: "AI Assistant",
  description:
    "Chat with the CityMitra AI assistant to plan trips, find markets, hotels, food, and services across Indian cities. Your conversations are saved.",
  alternates: { canonical: "/chat" }
};

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="chatApp" />}>
      <ChatWorkspace />
    </Suspense>
  );
}
