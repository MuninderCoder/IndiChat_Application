import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-slate-900/10">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center animate-bounce">
              <MessageSquare className="w-10 h-10 text-indigo-500" />
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">
          Welcome to IndiChat
        </h2>
        <p className="text-slate-400 text-lg">
          Select a conversation from the sidebar to start chatting in real-time.
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
