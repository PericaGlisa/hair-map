import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ChatService, { ChatMessage, ChatRoom, TypingIndicator } from '@/services/ChatService';
import { User } from '@/types';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';

interface LiveChatProps {
  currentUser: User;
  otherParticipant: User;
  roomId?: string;
  onClose: () => void;
}

interface MessageBubbleProps {
  message: ChatMessage;
  isCurrentUser: boolean;
  showAvatar: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isCurrentUser, showAvatar }) => {
  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'text':
        return (
          <Text style={[styles.messageText, isCurrentUser && styles.currentUserText]}>
            {message.content}
          </Text>
        );
      
      case 'image':
        return (
          <View>
            <Image source={{ uri: message.content }} style={styles.messageImage} />
            {message.metadata?.caption && (
              <Text style={[styles.messageText, isCurrentUser && styles.currentUserText]}>
                {message.metadata.caption}
              </Text>
            )}
          </View>
        );
      
      case 'audio':
        return (
          <View style={styles.audioMessage}>
            <Ionicons 
              name="play-circle" 
              size={24} 
              color={isCurrentUser ? '#fff' : '#007AFF'} 
            />
            <Text style={[styles.messageText, isCurrentUser && styles.currentUserText]}>
              Voice message ({message.metadata?.duration || '0:00'})
            </Text>
          </View>
        );
      
      case 'system':
        return (
          <Text style={styles.systemMessageText}>
            {message.content}
          </Text>
        );
      
      default:
        return (
          <Text style={[styles.messageText, isCurrentUser && styles.currentUserText]}>
            {message.content}
          </Text>
        );
    }
  };

  if (message.type === 'system') {
    return (
      <View style={styles.systemMessageContainer}>
        {renderMessageContent()}
        <Text style={styles.systemMessageTime}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.messageContainer, isCurrentUser && styles.currentUserContainer]}>
      {!isCurrentUser && showAvatar && (
        <Image 
          source={{ uri: message.senderAvatar || 'https://via.placeholder.com/32' }} 
          style={styles.avatar} 
        />
      )}
      
      <View style={[styles.messageBubble, isCurrentUser && styles.currentUserBubble]}>
        {renderMessageContent()}
        
        <View style={styles.messageFooter}>
          <Text style={[styles.messageTime, isCurrentUser && styles.currentUserTime]}>
            {formatTime(message.timestamp)}
          </Text>
          
          {isCurrentUser && (
            <View style={styles.messageStatus}>
              {message.status === 'sending' && (
                <ActivityIndicator size="small" color="#fff" />
              )}
              {message.status === 'sent' && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
              {message.status === 'delivered' && (
                <View style={styles.doubleCheck}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                  <Ionicons name="checkmark" size={16} color="#fff" style={styles.secondCheck} />
                </View>
              )}
              {message.status === 'read' && (
                <View style={styles.doubleCheck}>
                  <Ionicons name="checkmark" size={16} color="#4CAF50" />
                  <Ionicons name="checkmark" size={16} color="#4CAF50" style={styles.secondCheck} />
                </View>
              )}
            </View>
          )}
        </View>
      </View>
      
      {isCurrentUser && showAvatar && (
        <Image 
          source={{ uri: message.senderAvatar || 'https://via.placeholder.com/32' }} 
          style={styles.avatar} 
        />
      )}
    </View>
  );
};

const TypingIndicatorComponent: React.FC<{ typingUsers: TypingIndicator[] }> = ({ typingUsers }) => {
  if (typingUsers.length === 0) return null;

  const typingText = typingUsers.length === 1 
    ? `${typingUsers[0].userName} is typing...`
    : `${typingUsers.length} people are typing...`;

  return (
    <View style={styles.typingContainer}>
      <View style={styles.typingBubble}>
        <View style={styles.typingDots}>
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>
        <Text style={styles.typingText}>{typingText}</Text>
      </View>
    </View>
  );
};

const LiveChat: React.FC<LiveChatProps> = ({ 
  currentUser, 
  otherParticipant, 
  roomId: initialRoomId,
  onClose 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [roomId, setRoomId] = useState<string | null>(initialRoomId || null);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTypingRef = useRef<number>(0);

  // Initialize chat
  useEffect(() => {
    initializeChat();
    return () => {
      if (roomId) {
        ChatService.leaveRoom(roomId);
      }
      ChatService.disconnect();
    };
  }, []);

  // Listen for real-time updates
  useEffect(() => {
    if (!roomId) return;

    const unsubscribeMessage = ChatService.onMessageReceived((message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    });

    const unsubscribeTyping = ChatService.onTypingUpdate((indicators) => {
      setTypingUsers(indicators.filter(indicator => indicator.userId !== currentUser.id));
    });

    const unsubscribeStatus = ChatService.onMessageStatusUpdate((update) => {
      setMessages(prev => prev.map(msg => 
        msg.id === update.messageId 
          ? { ...msg, status: update.status }
          : msg
      ));
    });

    const unsubscribeConnection = ChatService.onConnectionStatusChange((connected) => {
      setIsConnected(connected);
    });

    return () => {
      unsubscribeMessage();
      unsubscribeTyping();
      unsubscribeStatus();
      unsubscribeConnection();
    };
  }, [roomId, currentUser.id]);

  const initializeChat = async () => {
    try {
      setIsLoading(true);
      
      // Connect to chat service
      await ChatService.connect(currentUser.id);
      setIsConnected(true);
      
      // Create or join room
      let chatRoomId = initialRoomId;
      if (!chatRoomId) {
        const room = await ChatService.createRoom({
          participants: [currentUser.id, otherParticipant.id],
          type: 'direct',
          name: `${currentUser.name} & ${otherParticipant.name}`,
        });
        chatRoomId = room.id;
      }
      
      setRoomId(chatRoomId);
      await ChatService.joinRoom(chatRoomId);
      
      // Load message history
      const history = await ChatService.getMessageHistory(chatRoomId);
      setMessages(history);
      
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error initializing chat:', error);
      Alert.alert('Error', 'Failed to initialize chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const sendMessage = async (content: string, type: 'text' | 'image' | 'audio' = 'text', metadata?: any) => {
    if (!roomId || !content.trim()) return;

    try {
      const message: Omit<ChatMessage, 'id' | 'timestamp'> = {
        roomId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        content: content.trim(),
        type,
        status: 'sending',
        metadata,
      };

      const sentMessage = await ChatService.sendMessage(message);
      setInputText('');
      
      // Stop typing indicator
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      await ChatService.stopTyping(roomId);
      
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const handleInputChange = (text: string) => {
    setInputText(text);
    
    if (!roomId) return;
    
    const now = Date.now();
    const timeSinceLastTyping = now - lastTypingRef.current;
    
    // Send typing indicator if enough time has passed
    if (timeSinceLastTyping > 1000) {
      ChatService.startTyping(roomId);
      lastTypingRef.current = now;
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (roomId) {
        ChatService.stopTyping(roomId);
      }
    }, 3000);
  };

  const handleSendPress = () => {
    sendMessage(inputText);
  };

  const handleImagePicker = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to send images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        await sendMessage(asset.uri, 'image', {
          width: asset.width,
          height: asset.height,
          fileSize: asset.fileSize,
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image.');
    }
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant microphone permissions to send voice messages.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Error', 'Failed to start recording.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      
      const uri = recording.getURI();
      if (uri) {
        const status = await recording.getStatusAsync();
        const duration = status.isLoaded ? Math.floor(status.durationMillis! / 1000) : 0;
        
        await sendMessage(uri, 'audio', {
          duration: `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`,
          fileSize: status.isLoaded ? status.size : 0,
        });
      }
      
      setRecording(null);
    } catch (error) {
      console.error('Failed to stop recording:', error);
      Alert.alert('Error', 'Failed to stop recording.');
      setRecording(null);
    }
  };

  const renderMessage = ({ item, index }: { item: ChatMessage; index: number }) => {
    const isCurrentUser = item.senderId === currentUser.id;
    const previousMessage = index > 0 ? messages[index - 1] : null;
    const showAvatar = !previousMessage || previousMessage.senderId !== item.senderId;

    return (
      <MessageBubble 
        message={item} 
        isCurrentUser={isCurrentUser} 
        showAvatar={showAvatar}
      />
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading chat...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Image 
            source={{ uri: otherParticipant.avatar || 'https://via.placeholder.com/40' }} 
            style={styles.headerAvatar} 
          />
          <View>
            <Text style={styles.headerName}>{otherParticipant.name}</Text>
            <Text style={styles.headerStatus}>
              {isConnected ? 'Online' : 'Connecting...'}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="call" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={scrollToBottom}
        showsVerticalScrollIndicator={false}
      />

      {/* Typing Indicator */}
      <TypingIndicatorComponent typingUsers={typingUsers} />

      {/* Input */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputRow}>
          <TouchableOpacity onPress={handleImagePicker} style={styles.attachButton}>
            <Ionicons name="camera" size={24} color="#007AFF" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={handleInputChange}
            placeholder="Type a message..."
            multiline
            maxLength={1000}
          />
          
          {inputText.trim() ? (
            <TouchableOpacity onPress={handleSendPress} style={styles.sendButton}>
              <Ionicons name="send" size={24} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              onPressIn={startRecording}
              onPressOut={stopRecording}
              style={[styles.voiceButton, isRecording && styles.voiceButtonRecording]}
            >
              <Ionicons 
                name={isRecording ? "stop" : "mic"} 
                size={24} 
                color={isRecording ? "#fff" : "#007AFF"} 
              />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  headerStatus: {
    fontSize: 14,
    color: '#666',
  },
  headerAction: {
    marginLeft: 16,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-end',
  },
  currentUserContainer: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  messageBubble: {
    maxWidth: '70%',
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  currentUserBubble: {
    backgroundColor: '#007AFF',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
    lineHeight: 20,
  },
  currentUserText: {
    color: '#fff',
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginBottom: 8,
  },
  audioMessage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
  },
  currentUserTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  messageStatus: {
    marginLeft: 8,
  },
  doubleCheck: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  secondCheck: {
    marginLeft: -8,
  },
  systemMessageContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  systemMessageText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  systemMessageTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  typingContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  typingDots: {
    flexDirection: 'row',
    marginRight: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#666',
    marginHorizontal: 1,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
  typingText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
  },
  attachButton: {
    marginRight: 12,
    padding: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  voiceButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  voiceButtonRecording: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
});

export default LiveChat;}}}