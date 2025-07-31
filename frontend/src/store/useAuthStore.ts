// To have a bunch of different states and functions to use in different components

import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/"; // Backend URL

type SignupPayload = {
  full_name: string;
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};
interface AuthStore {
  authUser: any; // Ideally replace `any` with a proper User type later
  isLoggingIn: boolean;
  isSigningUp: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  online_users: string[]; // Array of user._id (just IDs)
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  login: (data: LoginPayload) => Promise<void>;
  signup: (data: SignupPayload) => Promise<void>;
  updateProfile: (profile_pic: any) => Promise<void>;
  socket: any;
  connect_socket: () => void;
  disconnect_socket: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Takes in callback function that returns an object - initial state
  authUser: null, // We don't know if the user is authenticated or not
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true, // when we referesh, we check if the user is authenticated or not
  // While checking, show a loading screen
  online_users: [],
  socket: null,

  checkAuth: async () => {
    // call this function as soon as we visit the application
    try {
      // Send a request to the end point
      const res = await axiosInstance.get("/auth/check"); // Not putting localhost/api as we are already putting it in baseURL, and building on top of it

      set({ authUser: res.data }); // if user not authenticated, set it to null
      get().connect_socket();
    } catch (error) {
      console.log("Error in checkAuth: ", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data }); // So that user would be authenticated as soon as they signup
      toast.success("Account Created Successfully");
      get().connect_socket();
    } catch (error) {
      toast.error("Something went wrong near signup");
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged Out Successfully");

      // Whenever we login, connect to the socket
      get().disconnect_socket();
    } catch (error) {
      toast.error("Something went wrong while logging out");
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in Successfully");
      get().connect_socket();
    } catch (error) {
      toast.error("Something went wrong while logging in");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (profile_pic) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", profile_pic);
      set({ authUser: res.data });
      toast.success("Profile Updated Successfully");
    } catch (error) {
      console.log("error in update profile", error);
      toast.error("Internal Server Error");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connect_socket: () => {
    try {
      const { authUser } = get();
      if (!authUser || get().socket?.connected) {
        return;
      }
      const socket = io(BASE_URL, {
        query: {
          user_id: authUser._id,
        },
      }); //backend url

      socket.connect();
      set({ socket: socket });

      // Listen for online user updates
      // Listening? socket.on()

      socket.on("getOnlineUsers", (userIds) => {
        set({ online_users: userIds });
      });
    } catch (error) {
      console.log("Error in connect_socket: ", error);
    }
  },
  disconnect_socket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
    }
  },
})); // Takes in callback function that returns an object - initial state
