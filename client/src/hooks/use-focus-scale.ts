import { useState } from "react";
import { Animated } from "react-native";
import { motion } from "../theme";
import { useReduceMotion } from "./use-reduce-motion";

export function useFocusScale(focusScale = motion.focusScale) {
  const [focused, setFocused] = useState(false);
  const [scale] = useState(() => new Animated.Value(1));
  const reduceMotion = useReduceMotion();

  const animateTo = (toValue: number) => {
    if (reduceMotion) return;
    Animated.timing(scale, {
      toValue,
      duration: motion.focusDuration,
      easing: motion.focusEasing,
      useNativeDriver: true,
    }).start();
  };

  return {
    focused,
    scaleStyle: { transform: [{ scale }] },
    focusHandlers: {
      onFocus: () => {
        setFocused(true);
        animateTo(focusScale);
      },
      onBlur: () => {
        setFocused(false);
        animateTo(1);
      },
      onPressIn: () => animateTo(motion.pressScale),
      onPressOut: () => animateTo(focused ? focusScale : 1),
    },
  };
}
