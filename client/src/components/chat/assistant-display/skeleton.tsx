import { useEffect, useState } from "react";
import { Animated, StyleSheet, View, type ViewStyle } from "react-native";
import { useReduceMotion } from "../../../hooks/use-reduce-motion";
import { colors, radius, space } from "../../../theme";

const PULSE_DURATION = 700;

function Block({ style }: { style: ViewStyle }) {
  const [opacity] = useState(() => new Animated.Value(1));
  const reduceMotion = useReduceMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.4, duration: PULSE_DURATION, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: PULSE_DURATION, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity, reduceMotion]);

  return <Animated.View style={[styles.block, style, { opacity }]} />;
}

export function PosterRowSkeleton() {
  return (
    <View style={styles.row}>
      {[0, 1, 2, 3].map((index) => (
        <Block key={index} style={styles.poster} />
      ))}
    </View>
  );
}

export function MediaSkeleton() {
  return (
    <View style={styles.row}>
      <Block style={styles.largePoster} />
      <View style={styles.lines}>
        <Block style={styles.title} />
        <Block style={styles.line} />
        <Block style={styles.shortLine} />
      </View>
    </View>
  );
}

export function PersonRowSkeleton() {
  return (
    <View style={styles.row}>
      {[0, 1, 2, 3].map((index) => (
        <Block key={index} style={styles.avatar} />
      ))}
    </View>
  );
}

export function PersonSkeleton() {
  return (
    <View style={[styles.row, styles.centered]}>
      <Block style={styles.largeAvatar} />
      <View style={styles.lines}>
        <Block style={styles.title} />
        <Block style={styles.line} />
        <Block style={styles.shortLine} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.md,
  },
  row: {
    flexDirection: "row",
    gap: space[4],
  },
  centered: {
    alignItems: "center",
  },
  lines: {
    flex: 1,
    gap: space[3],
    paddingTop: space[2],
  },
  poster: {
    width: 220,
    height: 330,
  },
  largePoster: {
    width: 320,
    height: 480,
  },
  avatar: {
    width: 180,
    height: 180,
    borderRadius: radius.pill,
  },
  largeAvatar: {
    width: 220,
    height: 220,
    borderRadius: radius.pill,
  },
  title: {
    width: 520,
    height: 52,
  },
  line: {
    width: 760,
    height: 32,
  },
  shortLine: {
    width: 400,
    height: 32,
  },
});
