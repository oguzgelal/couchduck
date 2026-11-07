import { StyleSheet, Text, View } from "react-native";
import { colors, space, typography } from "../../../../theme";
import { CastRow } from "../person/cast-row";
import { RatingsRow } from "./ratings-row";
import type { Media } from "./types";

const TYPE_LABELS = { movie: "Movie", tv: "TV series" } as const;

export function MediaDetails({ media }: { media: Media }) {
  const facts = [media.type && TYPE_LABELS[media.type], media.year, media.length, media.genres?.join(", ")]
    .filter(Boolean)
    .join(" · ");

  return (
    <View style={styles.container}>
      <Text style={typography.title2}>{media.title}</Text>
      {facts && <Text style={typography.callout}>{facts}</Text>}
      {media.ratings && <RatingsRow ratings={media.ratings} />}
      {media.reason && <Text style={[typography.headline, styles.reason]}>{media.reason}</Text>}
      {media.overview && (
        <Text style={typography.body} numberOfLines={3}>
          {media.overview}
        </Text>
      )}
      {media.watchOn && media.watchOn.length > 0 && (
        <Text style={typography.callout}>Watch on {media.watchOn.join(", ")}</Text>
      )}
      {media.cast && media.cast.length > 0 && <CastRow cast={media.cast} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: space[3],
    maxWidth: 1300,
  },
  reason: {
    color: colors.duck,
  },
});
