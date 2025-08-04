import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [image_preview, set_image_preview] = useState<string | null>(null);
  //const fileInputRef = useRef(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Typescript pleasing

  const { send_message } = useChatStore(); // Function to send the message/ call our endpoint

  const handle_image_change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!file) {
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        set_image_preview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const remove_image = () => {
    set_image_preview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handle_send_message = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !image_preview) return;

    try {
      await send_message({
        text: text.trim(),
        image: image_preview,
      });

      // Clear form
      setText("");
      set_image_preview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      {image_preview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={image_preview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={remove_image}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handle_send_message} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handle_image_change}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${image_preview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !image_preview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
