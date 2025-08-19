import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatMessage } from '@/types';

export interface ChatRoom {
  id: string;
  participants: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TypingIndicator {
  userId: string;
  userName: string;
  isTyping: boolean;
}

class ChatService {
  private static instance: ChatService;
  private socket: Socket | null = null;
  private currentUserId: string | null = null;
  private messageListeners: ((message: ChatMessage) => void)[] = [];
  private typingListeners: ((typing: TypingIndicator) => void)[] = [];
  private connectionListeners: ((connected: boolean) => void)[] = [];
  private isConnected = false;

  private constructor() {}

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  async initialize(userId: string): Promise<void> {
    this.currentUserId = userId;
    await this.connect();
  }

  private async connect(): Promise<void> {
    try {
      // In a real app, this would be your backend WebSocket server
      const serverUrl = 'ws://localhost:3001'; // Replace with your actual server URL
      
      this.socket = io(serverUrl, {
        auth: {
          userId: this.currentUserId,
        },
        transports: ['websocket'],
      });

      this.setupEventListeners();
    } catch (error) {
      console.error('Error connecting to chat service:', error);
    }
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to chat service');
      this.isConnected = true;
      this.notifyConnectionListeners(true);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from chat service');
      this.isConnected = false;
      this.notifyConnectionListeners(false);
    });

    this.socket.on('message', (message: ChatMessage) => {
      this.handleIncomingMessage(message);
    });

    this.socket.on('typing', (typing: TypingIndicator) => {
      this.notifyTypingListeners(typing);
    });

    this.socket.on('user_online', (userId: string) => {
      console.log(`User ${userId} came online`);
    });

    this.socket.on('user_offline', (userId: string) => {
      console.log(`User ${userId} went offline`);
    });

    this.socket.on('error', (error: any) => {
      console.error('Chat service error:', error);
    });
  }

  async sendMessage(
    roomId: string,
    content: string,
    type: 'text' | 'image' | 'appointment' = 'text'
  ): Promise<ChatMessage> {
    const message: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      senderId: this.currentUserId!,
      content,
      type,
      timestamp: new Date(),
      isRead: false,
    };

    // Store message locally first
    await this.storeMessageLocally(roomId, message);

    // Send via socket if connected
    if (this.socket && this.isConnected) {
      this.socket.emit('send_message', {
        roomId,
        message,
      });
    } else {
      // Queue message for later sending
      await this.queueMessage(roomId, message);
    }

    return message;
  }

  async joinRoom(roomId: string): Promise<void> {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_room', roomId);
    }
  }

  async leaveRoom(roomId: string): Promise<void> {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_room', roomId);
    }
  }

  async markMessagesAsRead(roomId: string, messageIds: string[]): Promise<void> {
    if (this.socket && this.isConnected) {
      this.socket.emit('mark_read', {
        roomId,
        messageIds,
        userId: this.currentUserId,
      });
    }

    // Update local storage
    await this.updateLocalMessagesReadStatus(roomId, messageIds);
  }

  async sendTypingIndicator(roomId: string, isTyping: boolean): Promise<void> {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing', {
        roomId,
        userId: this.currentUserId,
        isTyping,
      });
    }
  }

  async getChatHistory(roomId: string, limit = 50, offset = 0): Promise<ChatMessage[]> {
    try {
      // First try to get from local storage
      const localMessages = await this.getLocalMessages(roomId, limit, offset);
      
      // If connected, also fetch from server for latest messages
      if (this.socket && this.isConnected) {
        return new Promise((resolve) => {
          this.socket!.emit('get_history', { roomId, limit, offset }, (messages: ChatMessage[]) => {
            // Merge and deduplicate messages
            const mergedMessages = this.mergeMessages(localMessages, messages);
            resolve(mergedMessages);
          });
        });
      }

      return localMessages;
    } catch (error) {
      console.error('Error getting chat history:', error);
      return [];
    }
  }

  async getChatRooms(): Promise<ChatRoom[]> {
    try {
      const stored = await AsyncStorage.getItem('chatRooms');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting chat rooms:', error);
      return [];
    }
  }

  private async handleIncomingMessage(message: ChatMessage): Promise<void> {
    // Store message locally
    await this.storeMessageLocally('default', message); // You'd determine the correct room ID
    
    // Notify listeners
    this.notifyMessageListeners(message);
  }

  private async storeMessageLocally(roomId: string, message: ChatMessage): Promise<void> {
    try {
      const key = `chat_${roomId}`;
      const stored = await AsyncStorage.getItem(key);
      const messages = stored ? JSON.parse(stored) : [];
      
      messages.push(message);
      
      // Keep only last 1000 messages per room
      if (messages.length > 1000) {
        messages.splice(0, messages.length - 1000);
      }
      
      await AsyncStorage.setItem(key, JSON.stringify(messages));
    } catch (error) {
      console.error('Error storing message locally:', error);
    }
  }

  private async getLocalMessages(roomId: string, limit: number, offset: number): Promise<ChatMessage[]> {
    try {
      const key = `chat_${roomId}`;
      const stored = await AsyncStorage.getItem(key);
      const messages = stored ? JSON.parse(stored) : [];
      
      return messages
        .slice(-limit - offset, -offset || undefined)
        .reverse();
    } catch (error) {
      console.error('Error getting local messages:', error);
      return [];
    }
  }

  private async queueMessage(roomId: string, message: ChatMessage): Promise<void> {
    try {
      const key = 'queued_messages';
      const stored = await AsyncStorage.getItem(key);
      const queued = stored ? JSON.parse(stored) : [];
      
      queued.push({ roomId, message });
      await AsyncStorage.setItem(key, JSON.stringify(queued));
    } catch (error) {
      console.error('Error queuing message:', error);
    }
  }

  private async sendQueuedMessages(): Promise<void> {
    try {
      const key = 'queued_messages';
      const stored = await AsyncStorage.getItem(key);
      const queued = stored ? JSON.parse(stored) : [];
      
      for (const { roomId, message } of queued) {
        if (this.socket && this.isConnected) {
          this.socket.emit('send_message', { roomId, message });
        }
      }
      
      // Clear queued messages
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error sending queued messages:', error);
    }
  }

  private async updateLocalMessagesReadStatus(roomId: string, messageIds: string[]): Promise<void> {
    try {
      const key = `chat_${roomId}`;
      const stored = await AsyncStorage.getItem(key);
      const messages = stored ? JSON.parse(stored) : [];
      
      messages.forEach((msg: ChatMessage) => {
        if (messageIds.includes(msg.id)) {
          msg.isRead = true;
        }
      });
      
      await AsyncStorage.setItem(key, JSON.stringify(messages));
    } catch (error) {
      console.error('Error updating message read status:', error);
    }
  }

  private mergeMessages(local: ChatMessage[], remote: ChatMessage[]): ChatMessage[] {
    const messageMap = new Map<string, ChatMessage>();
    
    // Add local messages
    local.forEach(msg => messageMap.set(msg.id, msg));
    
    // Add/update with remote messages
    remote.forEach(msg => messageMap.set(msg.id, msg));
    
    return Array.from(messageMap.values())
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  // Event listeners
  addMessageListener(callback: (message: ChatMessage) => void): () => void {
    this.messageListeners.push(callback);
    return () => {
      const index = this.messageListeners.indexOf(callback);
      if (index > -1) {
        this.messageListeners.splice(index, 1);
      }
    };
  }

  addTypingListener(callback: (typing: TypingIndicator) => void): () => void {
    this.typingListeners.push(callback);
    return () => {
      const index = this.typingListeners.indexOf(callback);
      if (index > -1) {
        this.typingListeners.splice(index, 1);
      }
    };
  }

  addConnectionListener(callback: (connected: boolean) => void): () => void {
    this.connectionListeners.push(callback);
    return () => {
      const index = this.connectionListeners.indexOf(callback);
      if (index > -1) {
        this.connectionListeners.splice(index, 1);
      }
    };
  }

  private notifyMessageListeners(message: ChatMessage): void {
    this.messageListeners.forEach(callback => callback(message));
  }

  private notifyTypingListeners(typing: TypingIndicator): void {
    this.typingListeners.forEach(callback => callback(typing));
  }

  private notifyConnectionListeners(connected: boolean): void {
    this.connectionListeners.forEach(callback => callback(connected));
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
  }

  isConnectedToChat(): boolean {
    return this.isConnected;
  }
}

export default ChatService.getInstance();