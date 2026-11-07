import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { colors, radius, space, typography } from "../../../../theme";
import { FocusItem, FocusRow } from "../focus-row";
import { Avatar } from "./avatar";
import type { PersonList } from "./types";

export function PersonsPart({ list }: { list: PersonList }) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const reason = list.people[focusedIndex]?.reason;

  return (
    <FocusRow
      heading={list.heading}
      footer={reason && <Text style={[typography.body, styles.reason]}>{reason}</Text>}
    >
      {list.people.map((person, index) => (
        <FocusItem
          key={`${person.name}-${index}`}
          label={[person.name, person.role].filter(Boolean).join(", ")}
          onFocus={() => setFocusedIndex(index)}
          style={styles.card}
          ringStyle={styles.ring}
          ring={<Avatar person={person} size={180} />}
        >
          <Text style={[typography.label, styles.centered]} numberOfLines={2}>
            {person.name}
          </Text>
          {person.role && (
            <Text style={[typography.caption, styles.centered]} numberOfLines={2}>
              {person.role}
            </Text>
          )}
        </FocusItem>
      ))}
    </FocusRow>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 220,
    alignItems: "center",
    gap: space[2],
  },
  ring: {
    borderRadius: radius.pill,
  },
  centered: {
    textAlign: "center",
  },
  reason: {
    color: colors.duck,
  },
});
