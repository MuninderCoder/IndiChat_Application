import { X, ChevronLeft } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, setShowUserProfileDetails } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-4 border-b border-indigo-500/10 bg-slate-900/40 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Back button for mobile */}
          <button
            onClick={() => setSelectedUser(null)}
            className="lg:hidden p-2 -ml-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-indigo-400"
          >
            <ChevronLeft className="size-6" />
          </button>

          <div 
            className="flex items-center gap-3 cursor-pointer hover:bg-slate-800/50 p-1 rounded-xl transition-colors"
            onClick={() => setShowUserProfileDetails(true)}
          >
          <div className="size-10 rounded-full border-2 border-slate-800 overflow-hidden relative">
            <img src={selectedUser.profilePic || "/avatar.svg"} alt={selectedUser.username} className="w-full h-full object-cover" />
            {onlineUsers.includes(selectedUser._id) && (
              <span className="absolute bottom-0 right-0 size-2.5 bg-green-500 border-2 border-slate-900 rounded-full" />
            )}
          </div>

          <div>
            <h3 className="font-semibold text-slate-100">{selectedUser.username}</h3>
            <p className="text-xs text-slate-500">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>

      <button 
            onClick={() => setSelectedUser(null)}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors group"
        >
          <X className="size-5 text-slate-400 group-hover:text-red-400" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
