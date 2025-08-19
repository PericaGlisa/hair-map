import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { Search, MessageCircle, Phone, Video } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Fonts } from '@/constants/Fonts';
import { mockMessages, mockHairdressers } from '@/data/mockData';

interface ChatPreview {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

export default function MessagesScreen() {
  const { colors } = useColorScheme();
  const [searchQuery, setSearchQuery] = useState('');

  const mockChatPreviews: ChatPreview[] = [
    {
      id: 'chat-1',
      participantId: 'hairdresser-1',
      participantName: 'Sarah Johnson',
      participantAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
      lastMessage: 'Hi Jane! Just come with clean, dry hair. Looking forward to seeing you!',
      lastMessageTime: '2 min ago',
      unreadCount: 1,
      isOnline: true,
    },
    {
      id: 'chat-2',
      participantId: 'hairdresser-2',
      participantName: 'Mike Rodriguez',
      participantAvatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=300',
      lastMessage: 'Thanks for the great review! See you next month.',
      lastMessageTime: '1 day ago',
      unreadCount: 0,
      isOnline: false,
    },
  ];

  const filteredChats = mockChatPreviews.filter(chat =>
    chat.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    header: {
      backgroundColor: colors.background,
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: Fonts.sizes['3xl'],
      fontWeight: Fonts.weights.bold,
      color: colors.text,
      marginBottom: 16,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    searchInput: {
      flex: 1,
      fontSize: Fonts.sizes.base,
      color: colors.text,
      marginLeft: 12,
    },
    content: {
      flex: 1,
    },
    chatItem: {
      backgroundColor: colors.background,
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatarContainer: {
      position: 'relative',
      marginRight: 12,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    onlineIndicator: {
      position: 'absolute',
      bottom: 2,
      right: 2,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.success500,
      borderWidth: 2,
      borderColor: colors.background,
    },
    chatInfo: {
      flex: 1,
    },
    participantName: {
      fontSize: Fonts.sizes.base,
      fontWeight: Fonts.weights.semibold,
      color: colors.text,
      marginBottom: 4,
    },
    lastMessage: {
      fontSize: Fonts.sizes.sm,
      color: colors.textSecondary,
      lineHeight: Fonts.lineHeights.normal * Fonts.sizes.sm,
    },
    lastMessageUnread: {
      color: colors.text,
      fontWeight: Fonts.weights.medium,
    },
    rightSection: {
      alignItems: 'flex-end',
    },
    timeText: {
      fontSize: Fonts.sizes.xs,
      color: colors.textLight,
      marginBottom: 4,
    },
    unreadBadge: {
      backgroundColor: colors.primary600,
      borderRadius: 12,
      minWidth: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 6,
    },
    unreadText: {
      fontSize: Fonts.sizes.xs,
      color: '#FFFFFF',
      fontWeight: Fonts.weights.bold,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: Fonts.sizes.xl,
      fontWeight: Fonts.weights.semibold,
      color: colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    emptyDescription: {
      fontSize: Fonts.sizes.base,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: Fonts.lineHeights.normal * Fonts.sizes.base,
    },
  });

  const handleChatPress = (chatId: string) => {
    console.log('Chat selected:', chatId);
    // Navigate to chat screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.content}>
        {filteredChats.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MessageCircle size={64} color={colors.textLight} style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptyDescription}>
              Start a conversation with your stylist after booking an appointment
            </Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {filteredChats.map((chat) => (
              <TouchableOpacity
                key={chat.id}
                style={styles.chatItem}
                onPress={() => handleChatPress(chat.id)}
                activeOpacity={0.7}
              >
                <View style={styles.avatarContainer}>
                  <Image source={{ uri: chat.participantAvatar }} style={styles.avatar} />
                  {chat.isOnline && <View style={styles.onlineIndicator} />}
                </View>

                <View style={styles.chatInfo}>
                  <Text style={styles.participantName}>{chat.participantName}</Text>
                  <Text 
                    style={[
                      styles.lastMessage, 
                      chat.unreadCount > 0 && styles.lastMessageUnread
                    ]}
                    numberOfLines={1}
                  >
                    {chat.lastMessage}
                  </Text>
                </View>

                <View style={styles.rightSection}>
                  <Text style={styles.timeText}>{chat.lastMessageTime}</Text>
                  {chat.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{chat.unreadCount}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}