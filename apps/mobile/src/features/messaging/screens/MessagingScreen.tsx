import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Screen } from '../../../components/layouts/Screen';
import { Header } from '../../../components/layouts/Header';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  id: string;
  text: string;
  timestamp: number;
  isFromDriver: boolean;
  senderName: string;
}

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    text: 'Good morning! Your route for today has been updated.',
    timestamp: Date.now() - 3600000,
    isFromDriver: false,
    senderName: 'Dispatcher',
  },
  {
    id: '2',
    text: 'Thanks, I see it. ETA to first stop is 30 minutes.',
    timestamp: Date.now() - 3000000,
    isFromDriver: true,
    senderName: 'You',
  },
  {
    id: '3',
    text: 'Great! Let me know if you encounter any issues.',
    timestamp: Date.now() - 2400000,
    isFromDriver: false,
    senderName: 'Dispatcher',
  },
];

export default function MessagingScreen() {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      timestamp: Date.now(),
      isFromDriver: true,
      senderName: 'You',
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Simulate dispatcher response after 2 seconds
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Message received. Thank you!',
        timestamp: Date.now(),
        isFromDriver: false,
        senderName: 'Dispatcher',
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.isFromDriver ? styles.driverMessage : styles.dispatcherMessage,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.isFromDriver
            ? styles.driverMessageBubble
            : styles.dispatcherMessageBubble,
        ]}
      >
        {!item.isFromDriver && (
          <Text style={styles.senderName}>{item.senderName}</Text>
        )}
        <Text
          style={[
            styles.messageText,
            item.isFromDriver
              ? styles.driverMessageText
              : styles.dispatcherMessageText,
          ]}
        >
          {item.text}
        </Text>
        <Text
          style={[
            styles.timestamp,
            item.isFromDriver
              ? styles.driverTimestamp
              : styles.dispatcherTimestamp,
          ]}
        >
          {formatTime(item.timestamp)}
        </Text>
      </View>
    </View>
  );

  return (
    <Screen safeArea={false}>
      <Header title="Messages" subtitle="Dispatcher Communication" />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  messagesList: {
    padding: 16,
    gap: 12,
  },
  messageContainer: {
    width: '100%',
  },
  driverMessage: {
    alignItems: 'flex-end',
  },
  dispatcherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  driverMessageBubble: {
    backgroundColor: '#14b8a6',
    borderBottomRightRadius: 4,
  },
  dispatcherMessageBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  driverMessageText: {
    color: '#ffffff',
  },
  dispatcherMessageText: {
    color: '#1f2937',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  driverTimestamp: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  dispatcherTimestamp: {
    color: '#9ca3af',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 8,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    minHeight: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1f2937',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#14b8a6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
