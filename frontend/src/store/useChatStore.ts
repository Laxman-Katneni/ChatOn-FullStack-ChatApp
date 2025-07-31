// Storing everything related to chat frontend

import { create } from "zustand"; // global state space
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

// Hook
// To store messages
interface Message {
  _id: string;
  sender_id: string;
  receiver_id: string;
  text: string;
  image: string;
  createdAt: string;
}

interface User {
  _id: string;
  full_name: string;
  email: string;
  profile_pic?: string;
}

interface ChatStore {
  messages: Message[];
  users: User[];
  selected_user: User | null;
  is_users_loading: boolean;
  is_messages_loading: boolean;

  get_users: () => Promise<void>;
  get_messages: (user_id: string) => Promise<void>;

  send_message: (messageData: {
    text: string;
    image: string | null;
  }) => Promise<void>;

  subscribe_to_messages: () => void;
  unsubscribe_from_messages: () => void;

  set_selected_user: (user: User | null) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  users: [],
  selected_user: null,
  is_users_loading: false,
  is_messages_loading: false,

  get_users: async () => {
    set({ is_users_loading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      console.log("Error in get_users", error);
      toast.error("Something went wrong");
    } finally {
      set({ is_users_loading: false });
    }
  },

  get_messages: async (user_id: string) => {
    set({ is_messages_loading: true });
    try {
      const res = await axiosInstance.get(`/messages/${user_id}`);
      set({ messages: res.data.messages });
    } catch (error) {
      console.log("Error in get_messages", error);
      toast.error("Something went wrong");
    } finally {
      set({ is_messages_loading: false });
    }
  },

  // to listen to messages
  subscribe_to_messages: () => {
    const { selected_user } = get();
    if (!selected_user) {
      return;
    }
    const socket = useAuthStore.getState().socket;
    socket.on("new_message", (new_message: any) => {
      const is_message_sent_from_selected_user =
        new_message.sender_id !== selected_user._id;
      if (is_message_sent_from_selected_user) {
        return;
      }
      //set({ messages: [...get().messages, new_message] });
      const currentMessages = get().messages;
      if (!currentMessages.some((msg) => msg._id === new_message._id)) {
        set({ messages: [...currentMessages, new_message] });
      }
    });
  },
  // When we logout or close the tab
  unsubscribe_from_messages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("new_message");
  },

  set_selected_user: (selected_user) => set({ selected_user }),
  send_message: async (messageData: { text: string; image: string | null }) => {
    // messages // This doesn't get the state
    // so use a getter from zustand
    //const { selected_user, messages } = get();
    /*Even though you initialize messages: [],
     Zustand state can temporarily get undefined if get_messages hasn’t set it yet due to async race conditions.
      */
    const { selected_user, messages = [] } = get(); // <- fallback to empty array

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selected_user?._id}`,
        messageData
      );

      //set({ messages: [...messages, res.data] }); // Keep all the messages we had earlier, and add the very last one to the end
      /*
      if (Array.isArray(messages)) {
        set({ messages: [...messages, res.data] });
      } else {
        set({ messages: [res.data] });
      }*/
      if (
        Array.isArray(messages) &&
        !messages.some((msg) => msg._id === res.data._id)
      ) {
        set({ messages: [...messages, res.data] });
      }
    } catch (error) {
      console.log("Error in send_message", error);
      toast.error("Something went wrong");
    }
  },
}));

/*

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  users: [],
  selected_user: null,
  // To show skeleton while these are loading
  is_users_loading: false,
  is_messages_loading: false,
  get_users: async () => {
    set({ is_users_loading: true });
    try {
      const res = await axiosInstance.get("/messages/users"); // sending a get request to the backend to the endpoint we created, we'll get some data back to set the users with it
      set({ users: res.data }); // updating our state from the data that we got back
    } catch (error) {
      console.log("Error in get_users", error);
      toast.error("Something went wrong");
    } finally {
      set({ is_users_loading: false });
    }
  },
  get_messages: async (user_id: string) => {
    set({ is_messages_loading: true });
    try {
      const res = await axiosInstance.get(`/messages/${user_id}`);
      set({ messages: res.data });
    } catch (error) {
      console.log("Error in get_users", error);
      toast.error("Something went wrong");
    } finally {
      set({ is_messages_loading: false });
    }
  },
  // To set the state to the selected user
  //optimize this later
  set_selected_user: (selected_user: any) => set({ selected_user }),
}));
*/
