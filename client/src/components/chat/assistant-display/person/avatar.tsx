import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { colors, typography } from "../../../../theme";
import type { Person } from "./types";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

export function Avatar({ person, size }: { person: Person; size: number }) {
  const [failed, setFailed] = useState(false);
  const circle = { width: size, height: size, borderRadius: size / 2 };

  if (person.avatar && !failed) {
    return (
      <Image
        source={{ uri: person.avatar }}
        onError={() => setFailed(true)}
        accessibilityIgnoresInvertColors
        style={[styles.avatar, circle]}
      />
    );
  }
  return (
    <View style={[styles.avatar, styles.initials, circle]}>
      <Text style={[typography.title3, { fontSize: size / 3, lineHeight: size / 2.4 }]}>{initials(person.name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: colors.surfaceRaised,
  },
  initials: {
    alignItems: "center",
    justifyContent: "center",
  },
});
