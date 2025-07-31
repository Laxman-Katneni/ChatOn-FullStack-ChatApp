import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

// Fetch every user but not ourselves
export const get_users_for_side_bar = async (req, res) => {
  try {
    const logged_user_id = req.user._id;
    const filtered_users = await User.find({
      _id: { $ne: logged_user_id },
    }).select("-password");
    res.status(200).json(filtered_users);
  } catch (error) {
    console.error(
      "Error in get_users_for_side_bar controller: " + error.message
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const get_messages = async (req, res) => {
  try {
    const { id: user_to_chat_id } = req.params;
    const my_id = req.user._id;

    const messages = await Message.find({
      // Find all the messages where I am the sender or the other user is the sender
      $or: [
        { sender_id: my_id, receiver_id: user_to_chat_id },
        { sender_id: user_to_chat_id, receiver_id: my_id },
      ],
    });
    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error in get_messages controller: " + error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Message could be text or a image
export const send_message = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiver_id } = req.params;
    const sender_id = req.user._id;

    let image_url;
    if (image && image != "") {
      const upload_response = await cloudinary.uploader.upload(image); // if user sends us the image, we can upload it to cloudinary, and it will give us a response
      image_url = upload_response.secure_url;
    }
    const new_message = new Message({
      sender_id,
      receiver_id,
      text,
      image: image_url, // if there is one in cloudinary, else undefined
    });
    await new_message.save();

    // Need to add real time functionality here later using socket.io
    // Instead of having to reload everytime

    const receiver_socket_id = getReceiverSocketId(receiver_id);
    // If receiver is online, send the event in real time
    if (receiver_socket_id) {
      //io.emit() broadcasts to everyone
      io.to(receiver_socket_id).emit("new_message", new_message);
    }

    res.status(201).json(new_message);
  } catch (error) {
    console.error("Error in send_message controller: " + error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
