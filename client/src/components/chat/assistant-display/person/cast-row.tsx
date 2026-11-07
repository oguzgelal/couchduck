import { StyleSheet, Text, View } from "react-native";
import { colors, space, typography } from "../../../../theme";
import { Avatar } from "./avatar";
import type { Person } from "./types";

export function CastRow({ cast }: { cast: Person[] }) {
  return (
    <View style={styles.row}>
      {cast.map((person, index) => (
        <View key={`${person.name}-${index}`} style={styles.member}>
          <Avatar person={person} size={104} />
          <Text style={[typography.caption, styles.name]} numberOfLines={2}>
            {person.name}
          </Text>
          {person.role && (
            <Text style={[typography.caption, styles.centered]} numberOfLines={1}>
              {person.role}
            </Text>
          )}
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
  member: {
    width: 140,
    alignItems: "center",
    gap: space[1],
  },
  name: {
    textAlign: "center",
    color: colors.ink,
  },
  centered: {
    textAlign: "center",
  },
});
