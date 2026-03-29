import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import UserProfileDetails from "../components/UserProfileDetails";

const HomePage = () => {
  const { selectedUser, showUserProfileDetails, setShowUserProfileDetails } = useChatStore();

  return (
    <div className="h-screen bg-slate-950 pt-16 overflow-hidden">
      <div className="flex items-center justify-center p-0 lg:px-4 h-full">
        <div className="bg-slate-900 shadow-2xl lg:rounded-2xl w-full max-w-7xl h-full lg:h-[calc(100vh-8rem)] glassmorphism overflow-hidden relative">
          <div className="flex h-full">
            {/* Sidebar - Always show on Large, only show when no user selected on Mobile */}
            <div className={`transition-all duration-300 h-full ${selectedUser ? "hidden lg:block lg:w-[340px]" : "w-full lg:w-[340px]"}`}>
              <Sidebar />
            </div>

            {/* Main Chat Area */}
            <div className={`flex-1 h-full flex flex-col transition-all duration-300 ${!selectedUser ? "hidden lg:flex" : "flex w-full"}`}>
              {!selectedUser ? (
                <NoChatSelected />
              ) : (
                <div className="flex h-full w-full relative">
                  <ChatContainer />
                  
                  {/* Floating User Details for Mobile/Desktop Overlay */}
                  {showUserProfileDetails && (
                    <div className="absolute inset-0 z-50 lg:relative lg:inset-auto lg:z-10 lg:w-80 lg:border-l lg:border-indigo-500/10 bg-slate-900 lg:bg-transparent">
                      <UserProfileDetails 
                        user={selectedUser} 
                        onClose={() => setShowUserProfileDetails(false)} 
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
