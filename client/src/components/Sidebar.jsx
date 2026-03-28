import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Users, Search, UserPlus, UserMinus, Plus, Heart } from "lucide-react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { decryptMessage } from "../lib/encryption";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { authUser, onlineUsers, addContact, removeContact, addFavorite, removeFavorite } = useAuthStore();
  
  // Tabs: "myChatBox" | "favourites" | "unread" | "read" | "available"
  const [activeTab, setActiveTab] = useState("myChatBox"); 
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const contactIds = authUser?.contacts || [];
  const favoriteIds = authUser?.favorites || [];

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    const isContact = contactIds.includes(user._id);
    const isFav = favoriteIds.includes(user._id);

    if (activeTab === "myChatBox") return isContact;
    if (activeTab === "favourites") return isFav;
    if (activeTab === "unread") return isContact && user.hasUnread;
    if (activeTab === "read") return isContact && !user.hasUnread && user.hasHistory;
    if (activeTab === "available") return !isContact;
    
    return false;
  });

  if (isUsersLoading) return <SidebarSkeleton />;

  const tabs = [
    { id: "myChatBox", label: "My Chat Box" },
    { id: "favourites", label: "Favourites" },
    { id: "unread", label: "Unread" },
    { id: "read", label: "Read" },
    { id: "available", label: "Available" }
  ];

  return (
    <aside className="h-full w-20 lg:w-[340px] border-r border-indigo-500/10 flex flex-col transition-all duration-300 relative bg-slate-900/10">
      <div className="border-b border-indigo-500/10 w-full p-4 flex flex-col gap-4 bg-slate-900/20 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Users className="size-6 text-indigo-400" />
          <span className="font-medium hidden lg:block text-slate-100">Contacts</span>
        </div>

        <div className="hidden lg:block space-y-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                <input 
                    type="text" 
                    placeholder="Search users..." 
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500 text-slate-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Scrollable Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar hide-scrollbar-on-idle">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`whitespace-nowrap px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border ${
                            activeTab === tab.id 
                                ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
                                : "bg-slate-800/40 border-slate-700/30 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
      </div>

      <div className="overflow-y-auto w-full flex-1 custom-scrollbar">
        {filteredUsers.map((user) => {
            const isFav = favoriteIds.includes(user._id);
            return (
                <div
                    key={user._id}
                    onClick={() => {
                        if(activeTab !== "available") setSelectedUser(user);
                    }}
                    className={`
                    w-full p-3 flex items-center justify-between
                    transition-all group border-b border-white/[0.02] last:border-none
                    ${activeTab !== "available" ? "cursor-pointer hover:bg-slate-800/40" : "hover:bg-slate-900/30"}
                    ${selectedUser?._id === user._id && activeTab !== "available" ? "bg-indigo-500/10 border-l-2 border-indigo-500 pl-2.5" : "border-l-2 border-transparent"}
                    `}
                >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className="relative shrink-0 mx-auto lg:mx-0">
                        <img
                        src={user.profilePic || "/avatar.svg"}
                        alt={user.username}
                        className="size-12 object-cover rounded-full border border-slate-700"
                        />
                        {onlineUsers.includes(user._id) && (
                        <span
                            className="absolute bottom-0 right-0 size-3 bg-green-500 
                            border-2 border-slate-900 rounded-full"
                        />
                        )}
                    </div>

                    <div className="hidden lg:block text-left min-w-0 flex-1">
                        <div className="font-medium truncate text-slate-200">{user.username}</div>
                        <div className="text-xs truncate max-w-[140px] mt-0.5">
                            {user.hasUnread ? (
                                <span className="font-bold text-slate-100">
                                    {decryptMessage(user.unreadText)}
                                </span>
                            ) : user.hasHistory ? (
                                <span className="text-slate-400">
                                    {decryptMessage(user.lastMessageText)}
                                </span>
                            ) : (
                                <span className="text-slate-500">
                                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                                </span>
                            )}
                        </div>
                    </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="hidden lg:flex items-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        {activeTab !== "available" && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (isFav) removeFavorite(user._id);
                                    else addFavorite(user._id);
                                }}
                                className={`p-1.5 rounded-full transition-colors mr-1 cursor-pointer ${
                                    isFav
                                        ? "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                                        : "bg-slate-500/10 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                                }`}
                                title={isFav ? "Remove from Favourites" : "Add to Favourites"}
                            >
                                <Heart className="size-4" fill={isFav ? "currentColor" : "none"} />
                            </button>
                        )}

                        {activeTab === "available" ? (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addContact(user._id);
                                }}
                                className="p-1.5 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white rounded-full transition-colors"
                                title="Add to My Chat Box"
                            >
                                <UserPlus className="size-4" />
                            </button>
                        ) : (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeContact(user._id);
                                    if (selectedUser?._id === user._id) {
                                        setSelectedUser(null);
                                    }
                                }}
                                className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition-colors"
                                title="Remove from My Chat Box"
                            >
                                <UserMinus className="size-4" />
                            </button>
                        )}
                    </div>
                </div>
            );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center justify-center flex flex-col items-center h-full text-slate-500 py-10 px-6 hidden lg:flex text-sm">
             {activeTab === "myChatBox" && "Your chat box is empty. Add contacts from Available."}
             {activeTab === "favourites" && "No favourites yet. Click the heart icon on any contact to add them."}
             {activeTab === "unread" && "No unread messages. You're all caught up!"}
             {activeTab === "read" && "No read messages yet."}
             {activeTab === "available" && "No available users found."}
          </div>
        )}
      </div>

      {/* Floating Action Button to Add Contacts */}
      {activeTab !== "available" && (
        <button
          onClick={() => setActiveTab("available")}
          className="absolute bottom-6 right-6 p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.3)] shadow-indigo-500/40 hover:shadow-indigo-500/60 transition-all duration-300 z-10 hidden lg:flex items-center justify-center cursor-pointer hover:scale-110 border border-indigo-400/20"
          title="Find more friends"
        >
          <Plus className="size-6 shadow-inner" />
        </button>
      )}
    </aside>
  );
};

export default Sidebar;
