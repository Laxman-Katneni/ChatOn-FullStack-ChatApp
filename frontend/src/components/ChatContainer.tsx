import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { format_message_time } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    get_messages,
    selected_user,
    is_messages_loading,
    subscribe_to_messages,
    unsubscribe_from_messages,
  } = useChatStore();

  //const messageEndRef = useRef(null)
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const { authUser } = useAuthStore();
  useEffect(() => {
    if (selected_user) {
      get_messages(selected_user._id);

      subscribe_to_messages();

      return () => {
        unsubscribe_from_messages;
      }; // Whenever we clean up
    }
  }, [
    selected_user?._id,
    get_messages,
    subscribe_to_messages,
    unsubscribe_from_messages,
  ]); // Whenever selected user_id changes, we want this effect to run

  useEffect(() => {
    if (messageEndRef && messages) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (is_messages_loading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 
      
        To Get Every Message 
        And also using daisyUI chat bubble to show the messages | chat-end is sender's message 
        chat-header is also from daisyUI
      
      */}

        {Array.isArray(messages) &&
          messages.map((message) => (
            <div
              key={message._id}
              className={`chat ${
                message.sender_id === authUser._id ? "chat-end" : "chat-start"
              }`}
              ref={messageEndRef}
            >
              {/* Your chat bubble UI */}

              <div className=" chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.sender_id === authUser._id
                        ? authUser.profilePic || "/avatar.png"
                        : selected_user?.profile_pic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {format_message_time(message.createdAt)}
                </time>
              </div>
              <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
