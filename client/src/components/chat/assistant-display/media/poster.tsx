import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { colors, radius, space, typography } from "../../../../theme";
import type { Media } from "./types";

const POSTER_ASPECT = 1.5;

export function Poster({ media, width }: { media: Media; width: number }) {
  const [failed, setFailed] = useState(false);
  const size = { width, height: width * POSTER_ASPECT };

  if (media.image && !failed) {
    return (
      <Image
        source={{ uri: media.image }}
        onError={() => setFailed(true)}
        accessibilityIgnoresInvertColors
        style={[styles.poster, size]}
      />
    );
  }
  return (
    <View style={[styles.poster, styles.fallback, size]}>
      <Text style={[typography.headline, styles.title]} numberOfLines={4}>
        {media.title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  poster: {
    borderRadius: radius.md,
    backgroundColor: colors.surfaceRaised,
  },
  fallback: {
    alignItems: "center",
    justifyContent: "center",
    padding: space[3],
  },
  title: {
    textAlign: "center",
  },
});
