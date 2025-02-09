import { Geist } from "next/font/google";
import ChatContainer from "../components/chat/ChatContainer";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className={`${geist.variable} min-h-screen bg-black`}>
      <ChatContainer />
    </div>
  );
}
