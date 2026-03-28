import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { encryptMessage } from "../lib/encryption";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isTyping: false,
  showUserProfileDetails: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const tempId = Date.now().toString();
    
    // Encrypt message text
    const encryptedData = {
        ...messageData,
        text: encryptMessage(messageData.text)
    };

    // Optimistic update
    const optimisticMessage = {
        ...messageData,
        _id: tempId,
        senderId: useAuthStore.getState().authUser._id,
        createdAt: new Date().toISOString(),
        status: 'sending'
    };
    set({ messages: [...messages, optimisticMessage] });

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, encryptedData);
      
      // Update the optimistic message with the actual one from DB
      set({ 
          messages: get().messages.map(m => m._id === tempId ? res.data : m) 
      });

      // Emit via socket for real-time
      const socket = useAuthStore.getState().socket;
      socket.emit("sendMessage", { ...res.data, tempId });

    } catch (error) {
      toast.error(error.response.data.message);
      // Remove optimistic message on failure
      set({ messages: get().messages.filter(m => m._id !== tempId) });
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageFromSelectedUser = newMessage.senderId === selectedUser?._id;
      
      if (!isMessageFromSelectedUser) {
          // Update the user's unread status in the sidebar instantly
          set({
             users: get().users.map(u => 
                 u._id === newMessage.senderId 
                 ? { ...u, hasUnread: true, hasHistory: true, unreadText: newMessage.text }
                 : u
             )
          });
          return;
      }

      set({
        messages: [...get().messages, newMessage],
      });

      // Mark as seen
      socket.emit("markAsSeen", { messageId: newMessage._id, senderId: newMessage.senderId });
    });

    socket.on("messageStatusUpdate", ({ tempId, messageId, status }) => {
        set({
            messages: get().messages.map(m => {
                if (tempId && m._id === tempId) return { ...m, status };
                if (messageId && m._id === messageId) return { ...m, status };
                return m;
            })
        });
    });

    // Typing listener
    socket.on("displayTyping", ({ senderId, isTyping }) => {
        if (senderId === selectedUser._id) {
            set({ isTyping });
        }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("messageStatusUpdate");
    socket.off("displayTyping");
  },

  sendTypingStatus: (isTyping) => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;
    socket.emit("typing", { receiverId: selectedUser._id, isTyping });
  },

  editMessage: async (messageId, newText) => {
    try {
      const res = await axiosInstance.put(`/messages/edit/${messageId}`, { text: encryptMessage(newText) });
      set({ messages: get().messages.map(m => m._id === messageId ? res.data : m) });
      toast.success("Message edited");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to edit message");
    }
  },

  deleteMessage: async (messageId) => {
    try {
      const res = await axiosInstance.put(`/messages/delete/${messageId}`);
      set({ messages: get().messages.map(m => m._id === messageId ? res.data : m) });
      toast.success("Message deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete message");
    }
  },

  setSelectedUser: (user) => {
      set({ 
          selectedUser: user, 
          isTyping: false, 
          showUserProfileDetails: false,
          // instantly mark as read in sidebar local state
          users: get().users.map(u => u._id === user?._id ? { ...u, hasUnread: false, hasHistory: true } : u)
      });
  },
  setShowUserProfileDetails: (show) => set({ showUserProfileDetails: show }),
}));
