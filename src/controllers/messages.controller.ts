import { Request, Response } from 'express';
import { getMessages, getMessageById, getMessagesByUserId, createMessage, deleteMessageById, updateMessageById } from '../mongodb/models/message.js';
import { createChat } from '../utlils/gemini.js';

export const getAllMessages = async (req: Request, res: Response): Promise<Response> => {
  try {
    const messages = await getMessages();
    return res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
};

export const getMessage = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'No id provided' });
    }
    const message = await getMessageById(id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    return res.json(message);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getMessagesByuserId = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 30;
    const skip = (page - 1) * limit;

    const messages = await getMessagesByUserId(id, limit, skip);

    return res.status(200).json({
      data: messages,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const createNewMessage = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { user_id, sent_By, message_content } = req.body;
    if (!user_id || !sent_By || !message_content) {
      return res.status(400).json({ message: 'User ID, sent_By, and message_content are required' });
    }
    const message = await createMessage({ user_id, sent_By, message_content });
    const response = await createChat(message_content);
    const gemini_response = await createMessage({ user_id, sent_By: "gemini", message_content: response });
    return res.status(201).json(gemini_response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteMessage = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const deletedMessage = await deleteMessageById(id);
    return res.json(deletedMessage);
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
};

export const updateMessage = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { user_id, sent_By, message_content } = req.body;
    if (!user_id || !sent_By || !message_content) {
      return res.sendStatus(400);
    }
    const updatedMessage = await updateMessageById(id, { user_id, sent_By, message_content });
    return res.status(200).json(updatedMessage);
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
};