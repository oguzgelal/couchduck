import { Image, StyleSheet, View } from "react-native";
import { colors, radius, space } from "../../../../theme";
import { FocusItem } from "../focus-row";
import { MediaDetails } from "./media-details";
import { Poster } from "./poster";
import type { Media } from "./types";

export function MediaPart({ media }: { media: Media }) {
  return (
    <View style={styles.container}>
      {media.backdrop && (
        <Image
          source={{ uri: media.backdrop }}
          accessibilityIgnoresInvertColors
          style={[StyleSheet.absoluteFill, styles.backdrop]}
        />
      )}
      <FocusItem label={media.title} ringStyle={styles.ring} ring={<Poster media={media} width={320} />} />
      <MediaDetails media={media} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: space[6],
    padding: space[6],
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  backdrop: {
    opacity: 0.18,
  },
  ring: {
    borderRadius: radius.md,
  },
});
