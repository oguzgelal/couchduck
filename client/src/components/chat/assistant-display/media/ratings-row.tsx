import { StyleSheet, Text, View } from "react-native";
import { radius, space, typography } from "../../../../theme";

export type Ratings = {
  tmdb?: number;
  imdb?: number;
  rottenTomatoes?: number;
  metacritic?: number;
};

type Badge = { source: string; value: string; background: string; color: string };

const DARK_INK = "#111111";
const LIGHT_INK = "#ffffff";
const FRESH_MIN_PERCENT = 60;
const METACRITIC_FAVORABLE_MIN = 61;
const METACRITIC_MIXED_MIN = 40;

const metacriticColor = (score: number) =>
  score >= METACRITIC_FAVORABLE_MIN ? "#66cc33" : score >= METACRITIC_MIXED_MIN ? "#ffcc33" : "#ff0000";

function toBadges({ tmdb, imdb, rottenTomatoes, metacritic }: Ratings): Badge[] {
  return [
    imdb !== undefined && { source: "IMDb", value: imdb.toFixed(1), background: "#f5c518", color: DARK_INK },
    rottenTomatoes !== undefined && {
      source: "Rotten Tomatoes",
      value: `${Math.round(rottenTomatoes)}%`,
      background: rottenTomatoes >= FRESH_MIN_PERCENT ? "#fa320a" : "#0ac855",
      color: LIGHT_INK,
    },
    metacritic !== undefined && {
      source: "Metacritic",
      value: String(Math.round(metacritic)),
      background: metacriticColor(metacritic),
      color: DARK_INK,
    },
    tmdb !== undefined && { source: "TMDB", value: tmdb.toFixed(1), background: "#01b4e4", color: DARK_INK },
  ].filter((badge): badge is Badge => Boolean(badge));
}

export function RatingsRow({ ratings }: { ratings: Ratings }) {
  const badges = toBadges(ratings);
  if (badges.length === 0) return null;

  return (
    <View style={styles.row}>
      {badges.map(({ source, value, background, color }) => (
        <View key={source} style={styles.badge} accessibilityLabel={`${source} ${value}`}>
          <View style={[styles.source, { backgroundColor: background }]}>
            <Text style={[typography.caption, { color }]}>{source}</Text>
          </View>
          <Text style={typography.label}>{value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space[4],
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: space[2],
  },
  source: {
    paddingHorizontal: space[2],
    paddingVertical: space[1],
    borderRadius: radius.sm / 2,
  },
});
