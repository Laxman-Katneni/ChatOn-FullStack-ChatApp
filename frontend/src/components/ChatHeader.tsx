import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selected_user, set_selected_user } = useChatStore();
  const { online_users } = useAuthStore();
  if (!selected_user) return null;

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selected_user?.profile_pic || "/avatar.png"}
                alt={selected_user?.full_name}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selected_user?.full_name}</h3>
            <p className="text-sm text-base-content/70">
              {online_users.includes(selected_user._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => set_selected_user(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
