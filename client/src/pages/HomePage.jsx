import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import UserProfileDetails from "../components/UserProfileDetails";

const HomePage = () => {
  const { selectedUser, showUserProfileDetails, setShowUserProfileDetails } = useChatStore();

  return (
    <div className="h-screen bg-slate-950 pt-16">
      <div className="flex items-center justify-center px-4 h-full">
        <div className="bg-slate-900/50 shadow-2xl rounded-2xl w-full max-w-7xl h-[calc(100vh-8rem)] glassmorphism overflow-hidden">
          <div className="flex h-full">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : (
              <>
                <ChatContainer />
                {showUserProfileDetails && (
                  <UserProfileDetails 
                    user={selectedUser} 
                    onClose={() => setShowUserProfileDetails(false)} 
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
