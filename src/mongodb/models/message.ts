import mongoose from "mongoose";

interface MessageInput {
  user_id: mongoose.Schema.Types.ObjectId;
  sent_By: "user" | "gemini";
  message_content: string;
}

const messageSchema = new mongoose.Schema({
    user_id : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sent_By : { type : String , enum : ["user", "gemini"], required : true }, 
    message_content : { type : String , required : true },
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);

export default Message; 

// Message Actions
export const getMessages = () => Message.find();
export const getMessageById = (id: string) => Message.findById(id);
export const getMessagesByUserId = (userId: string, limit = 50, skip = 0) =>
  Message.find({ user_id: userId })
    .sort({ createdAt: -1 }) // 🧠 newest first
    .skip(skip)
    .limit(limit)
    .lean(); // faster since it’s read-only
export const createMessage = (values: MessageInput) => {
  console.log('Creating message with values:', values);
  return new Message(values).save()
    .then((message) => message.toObject())
    .catch((error) => {
      console.error('Error creating message:', error);
      throw error;
    });
};
export const deleteMessageById = (id: string) => Message.findOneAndDelete({ _id: id });
export const updateMessageById = (id: string, values: Partial<MessageInput>) => Message.findByIdAndUpdate(id, values, { new: true });