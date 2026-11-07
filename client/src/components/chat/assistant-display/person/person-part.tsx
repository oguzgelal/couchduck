import { StyleSheet, Text, View } from "react-native";
import { colors, space, typography } from "../../../../theme";
import { Avatar } from "./avatar";
import type { Person } from "./types";

export function PersonPart({ person }: { person: Person }) {
  return (
    <View style={styles.container}>
      <Avatar person={person} size={220} />
      <View style={styles.text}>
        <Text style={typography.title2}>{person.name}</Text>
        {person.role && <Text style={typography.headline}>{person.role}</Text>}
        {person.reason && <Text style={[typography.body, styles.reason]}>{person.reason}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: space[6],
    maxWidth: 1400,
  },
  text: {
    flex: 1,
    gap: space[2],
  },
  reason: {
    color: colors.duck,
  },
});
