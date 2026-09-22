import { ReactNode, useEffect } from 'react';
import { BackHandler, Modal, Pressable, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

const HERMES_SLIDE = { stiffness: 180, damping: 22, mass: 1.0 };

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function BottomSheet({ visible, onClose, children }: BottomSheetProps) {
  const translateY = useSharedValue(400);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, HERMES_SLIDE);
      backdropOpacity.value = withTiming(1, { duration: 200 });
    }
  }, [visible]);

  // Required: Android hardware back button closes the sheet, not the whole screen
  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => sub.remove();
  }, [visible, onClose]);

  const handleClose = () => {
    translateY.value = withSpring(400, HERMES_SLIDE);
    backdropOpacity.value = withTiming(0, { duration: 150 });
    setTimeout(onClose, 150);
  };

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <Pressable className="flex-1" onPress={handleClose}>
        <Animated.View style={backdropStyle} className="flex-1 bg-black/60" />
      </Pressable>

      <Animated.View
        style={sheetStyle}
        className="absolute bottom-0 left-0 right-0 bg-card rounded-sheet px-4 pt-3 pb-8 border-t border-border"
      >
        <View className="w-10 h-1 rounded-full bg-border self-center mb-4" />
        {children}
      </Animated.View>
    </Modal>
  );
}
