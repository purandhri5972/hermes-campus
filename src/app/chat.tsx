import { useQuery } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { AlertCircle, Mic, Send } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
    fetchChatMessages,
    mockMemoryCount,
    mockWorkerStatus,
    type ChatMessage,
} from '@/mocks/chat';

const HERMES_SPRING = { stiffness: 150, damping: 18, mass: 0.8 };

function PressableScale({
  onPress,
  children,
  className,
}: {
  onPress: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={style}>
      <Pressable
        className={className}
        onPressIn={() => {
          scale.value = withSpring(0.96, HERMES_SPRING);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, HERMES_SPRING);
        }}
        onPress={onPress}>
        {children}
      </Pressable>
    </Animated.View>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isHermes = message.sender === 'hermes';
  return (
    <View
      className={`mb-3 max-w-[85%] rounded-2xl border border-border p-3 ${
        isHermes ? 'self-start bg-card' : 'self-end bg-primary/10'
      }`}>
      <Text className="text-slate-50">{message.text}</Text>
      <Text className="mt-1 text-xs text-slate-400">{message.timestamp}</Text>
    </View>
  );
}

function SkeletonBubble({ align }: { align: 'start' | 'end' }) {
  return (
    <View
      className={`mb-3 h-16 w-2/3 rounded-2xl bg-card opacity-50 ${
        align === 'start' ? 'self-start' : 'self-end'
      }`}
    />
  );
}

export default function ChatScreen() {
  const [inputText, setInputText] = useState('');

  const {
    data: messages,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['chatMessages'],
    queryFn: fetchChatMessages,
  });

  const handleSend = useCallback(() => {
    if (!inputText.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: dispatch to Hermes backend once available
    setInputText('');
  }, [inputText]);

  const handleMic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: wire speech-to-text
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text className="text-lg font-semibold text-slate-50">
          HERMES AGENT CORE
        </Text>
        <View className="h-7 rounded-lg border border-border bg-card px-2 justify-center">
          <Text className="text-xs text-slate-400">
            ⚙ Memory: {mockMemoryCount}
          </Text>
        </View>
      </View>

      {/* Status banner */}
      {mockWorkerStatus.active && (
        <View className="mx-4 mb-3 rounded-2xl border border-border bg-card p-3">
          <Text className="text-sm text-emerald">
            ● Autonomous Background Worker Active
          </Text>
          <Text className="mt-1 text-xs text-slate-400">
            Filtered {mockWorkerStatus.filteredCirculars} college circulars •
            Synced {mockWorkerStatus.syncedDeadlines} deadline
          </Text>
        </View>
      )}

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}>
        {/* LOADING */}
        {isLoading && (
          <View className="flex-1 px-4">
            <SkeletonBubble align="start" />
            <SkeletonBubble align="end" />
            <SkeletonBubble align="start" />
          </View>
        )}

        {/* ERROR */}
        {!isLoading && isError && (
          <View className="flex-1 items-center justify-center px-4">
            <AlertCircle color="#EF4444" size={32} />
            <Text className="mt-2 text-center text-slate-50">
              Couldn't reach Hermes. Check your connection.
            </Text>
            <PressableScale
              onPress={() => refetch()}
              className="mt-4 h-10 items-center justify-center rounded-lg border border-border bg-card px-4">
              <Text className="text-slate-50">Try Again</Text>
            </PressableScale>
          </View>
        )}

        {/* EMPTY */}
        {!isLoading && !isError && messages && messages.length === 0 && (
          <View className="flex-1 items-center justify-center px-4">
            <Text className="text-center text-slate-50">
              No messages yet
            </Text>
            <Text className="mt-1 text-center text-sm text-slate-400">
              Ask Hermes about deadlines, teams, or your sprint plan.
            </Text>
          </View>
        )}

        {/* POPULATED */}
        {!isLoading && !isError && messages && messages.length > 0 && (
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => <MessageBubble message={item} />}
          />
        )}

        {/* Input bar */}
        <View className="flex-row items-center gap-2 border-t border-border bg-background px-4 py-3">
          <PressableScale
            onPress={handleMic}
            className="h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
            <Mic color="#94A3B8" size={18} />
          </PressableScale>

          <TextInput
            className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-slate-50"
            placeholder="Type an instruction for Hermes…"
            placeholderTextColor="#94A3B8"
            value={inputText}
            onChangeText={setInputText}
          />

          <PressableScale
            onPress={handleSend}
            className="h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Send color="#F8FAFC" size={18} />
          </PressableScale>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}