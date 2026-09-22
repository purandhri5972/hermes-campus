import * as Haptics from 'expo-haptics';
import { ReactNode } from 'react';
import { Pressable } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

const HERMES_SPRING = { stiffness: 150, damping: 18, mass: 0.8 };

interface PressableScaleProps {
  children: ReactNode;
  onPress?: () => void;
  className?: string;
  haptic?: 'light' | 'medium' | 'none';
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PressableScale({
  children,
  onPress,
  className,
  haptic = 'light',
}: PressableScaleProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, HERMES_SPRING);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, HERMES_SPRING);
  };

  const handlePress = () => {
    if (haptic === 'light') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (haptic === 'medium') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress?.();
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={animatedStyle}
      className={className}
    >
      {children}
    </AnimatedPressable>
  );
}