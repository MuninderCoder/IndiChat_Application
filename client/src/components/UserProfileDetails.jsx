import { X } from "lucide-react";

const UserProfileDetails = ({ user, onClose }) => {
  return (
    <div className="w-80 border-l border-slate-800/50 bg-slate-900/50 flex flex-col h-full animate-in slide-in-from-right-10 duration-300">
      <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900/80">
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="size-5" />
        </button>
        <span className="font-semibold text-slate-200">Contact Info</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center custom-scrollbar">
        <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-slate-800 shadow-xl mb-6 relative group cursor-pointer transition-transform hover:scale-105">
          <img
            src={user.profilePic || "/avatar.svg"}
            alt="Profile"
            className="w-full h-full object-cover"
            onClick={() => document.getElementById('full-profile-pic-modal').showModal()}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="text-white text-sm font-medium">View Photo</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-100 mb-1">{user.username}</h2>
        <p className="text-slate-400 text-sm mb-6">{user.email}</p>

        <div className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 text-center shadow-sm">
          <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">About</h3>
          <p className="text-slate-300 text-[15px] leading-relaxed break-words">
            {user.bio || "Hey there! I am using IndiChat."}
          </p>
        </div>
      </div>

      {/* Full screen modal for image */}
      <dialog id="full-profile-pic-modal" className="modal bg-transparent p-0 m-0 w-screen h-screen max-w-none max-h-none backdrop:bg-slate-950/90 backdrop:backdrop-blur-sm">
        <div className="w-full h-full flex items-center justify-center relative">
            <button 
                onClick={() => document.getElementById('full-profile-pic-modal').close()}
                className="absolute top-6 right-6 p-4 bg-slate-800/50 hover:bg-slate-800 rounded-full text-white transition-colors"
            >
                <X className="size-6" />
            </button>
            <img 
                src={user.profilePic || "/avatar.svg"} 
                alt="Profile Full" 
                className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            />
        </div>
      </dialog>
    </div>
  );
};

export default UserProfileDetails;
