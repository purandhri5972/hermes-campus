import { PressableScale } from '@/components/briefing/PressableScale';
import { useQuery } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchBriefing } from '../../mocks/fetchBriefing';

const HERMES_BOUNCE = { stiffness: 200, damping: 12, mass: 0.6 };

export default function HomeScreen() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['briefing'],
    queryFn: fetchBriefing,
  });

  const translateX = useSharedValue(0);

  const handleAccept = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    translateX.value = withSpring(0, HERMES_BOUNCE);
  };

  const handleDismiss = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    translateX.value = withSpring(0, HERMES_BOUNCE);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX > 120) {
        translateX.value = withSpring(500, HERMES_BOUNCE);
        runOnJS(handleAccept)();
      } else if (event.translationX < -120) {
        translateX.value = withSpring(-500, HERMES_BOUNCE);
        runOnJS(handleDismiss)();
      } else {
        translateX.value = withSpring(0, HERMES_BOUNCE);
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${translateX.value / 20}deg` },
    ],
  }));

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background px-4 pt-2">
        <View className="h-6 w-40 bg-card rounded-lg mb-4 opacity-50" />
        <View className="h-9 w-56 bg-card rounded-lg mb-4 opacity-50" />
        <View className="h-9 bg-card rounded-btn mb-4 opacity-50" />
        <View className="h-48 bg-card rounded-card opacity-50" />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-4">
        <Text className="text-red text-base font-bold mb-2">
          Couldn't load your briefing
        </Text>
        <Text className="text-slate-400 text-sm mb-4 text-center">
          Check your connection and try again.
        </Text>
        <PressableScale
          onPress={() => refetch()}
          haptic="medium"
          className="h-10 px-6 bg-primary rounded-btn items-center justify-center"
        >
          <Text className="text-slate-50 font-semibold">Try Again</Text>
        </PressableScale>
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-4">
        <Text className="text-slate-50 text-base font-bold mb-2">
          Nothing here yet
        </Text>
        <Text className="text-slate-400 text-sm text-center">
          Check back after your next class for new matches.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-4 pt-2">
        <Text className="text-slate-50 text-lg font-bold">HERMES CAMPUS</Text>
        <View className="flex-row items-center gap-3">
          <PressableScale className="w-9 h-9 rounded-full bg-card items-center justify-center border border-border">
            <Text className="text-slate-50">🔔</Text>
            <View className="absolute -top-1 -right-1 bg-amber rounded-full w-4 h-4 items-center justify-center">
              <Text className="text-[10px] text-slate-950 font-bold">
                {data.actionsRequired}
              </Text>
            </View>
          </PressableScale>

          <PressableScale className="w-9 h-9 rounded-full bg-card border border-primary items-center justify-center">
            <Text className="text-slate-50 text-xs">
              {data.userName.charAt(0)}
            </Text>
          </PressableScale>
        </View>
      </View>

      <View className="px-4 pt-4">
        <Text className="text-slate-50 text-2xl font-bold">
          Good Morning, {data.userName}
        </Text>
      </View>

      <View className="px-4 pt-4">
        <View className="flex-row items-center bg-card border border-border rounded-btn h-9 px-3">
          <View className="w-2 h-2 rounded-full bg-emerald mr-2" />
          <Text className="text-slate-400 text-xs">
            ⚡ HERMES RADAR: {data.emailsScanned} emails scanned · {data.actionsRequired} actions required
          </Text>
        </View>
      </View>

      <View className="px-4 pt-4">
        <GestureDetector gesture={panGesture}>
          <Animated.View style={cardStyle} className="bg-card border border-border rounded-card p-4">
            <View className="flex-row items-center justify-between mb-2">
              <View className="bg-primary/20 rounded-btn px-2 py-1">
                <Text className="text-primary text-xs font-bold">HACKATHON DROP</Text>
              </View>
              <View className="bg-emerald/10 rounded-btn px-2 py-1">
                <Text className="text-emerald text-xs font-bold">
                  {data.hackathonMatch.matchPercent}% MATCH
                </Text>
              </View>
            </View>

            <Text className="text-slate-50 text-lg font-bold mb-1">
              {data.hackathonMatch.title}
            </Text>
            <Text className="text-amber text-xs mb-3">
              Deadline: {data.hackathonMatch.deadline} · {data.hackathonMatch.prizePool} Prize Pool
            </Text>
            <Text className="text-slate-400 text-sm mb-4">
              "{data.hackathonMatch.reason}"
            </Text>

            <View className="flex-row gap-3">
              <PressableScale
                onPress={handleDismiss}
                className="flex-1 h-10 rounded-btn border border-border items-center justify-center"
              >
                <Text className="text-slate-400 font-semibold">✕ Dismiss</Text>
              </PressableScale>

              <PressableScale
                onPress={handleAccept}
                haptic="none"
                className="flex-1 h-10 rounded-btn bg-primary items-center justify-center"
              >
                <Text className="text-slate-50 font-semibold">✓ Accept</Text>
              </PressableScale>
            </View>
          </Animated.View>
        </GestureDetector>
      </View>

      <View className="px-4 pt-6">
        <Text className="text-slate-50 text-base font-bold mb-3">
          TODAY'S SCHEDULE OVERVIEW
        </Text>
        <View className="gap-2">
          {data.schedule.map((item) => (
            <PressableScale key={item.id} className="bg-card rounded-lg px-3 py-3">
              <Text className="text-slate-50 text-sm font-semibold">
                {item.time} · {item.title}
              </Text>
              {item.venue && (
                <Text className="text-slate-400 text-xs mt-1">{item.venue}</Text>
              )}
            </PressableScale>
          ))}
        </View>
      </View>

      <View className="px-4 pt-4">
        <PressableScale className="h-12 bg-card border border-border rounded-lg items-center justify-center">
          <Text className="text-slate-50 font-semibold">+ Quick Add Event</Text>
        </PressableScale>
      </View>
    </SafeAreaView>
  );
}