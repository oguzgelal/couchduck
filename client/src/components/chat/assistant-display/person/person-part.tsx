import { StyleSheet, Text, View } from "react-native";
import { colors, space, typography } from "../../../../theme";
import { Avatar } from "./avatar";
import { KnownForRow } from "./known-for-row";
import type { PersonProfile } from "./types";

export function PersonPart({ person }: { person: PersonProfile }) {
  const facts = [person.role, person.born && `Born ${person.born}`, person.died && `Died ${person.died}`]
    .filter(Boolean)
    .join(" · ");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar person={person} size={240} />
        <View style={styles.text}>
          <Text style={typography.title2}>{person.name}</Text>
          {facts && <Text style={typography.callout}>{facts}</Text>}
          {person.reason && <Text style={[typography.headline, styles.reason]}>{person.reason}</Text>}
          {person.biography && (
            <Text style={typography.body} numberOfLines={4}>
              {person.biography}
            </Text>
          )}
        </View>
      </View>
      {person.knownFor && person.knownFor.length > 0 && <KnownForRow credits={person.knownFor} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: space[5],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: space[6],
  },
  text: {
    flex: 1,
    gap: space[2],
    maxWidth: 1300,
  },
  reason: {
    color: colors.duck,
  },
});
