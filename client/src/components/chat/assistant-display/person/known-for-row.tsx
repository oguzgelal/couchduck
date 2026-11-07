import { StyleSheet, Text } from "react-native";
import { radius, space, typography } from "../../../../theme";
import { FocusItem, FocusRow } from "../focus-row";
import { Poster } from "../media/poster";
import type { Credit } from "./types";

export function KnownForRow({ credits }: { credits: Credit[] }) {
  return (
    <FocusRow heading="Known for">
      {credits.map((credit, index) => (
        <FocusItem
          key={`${credit.title}-${index}`}
          label={[credit.title, credit.year, credit.role].filter(Boolean).join(", ")}
          style={styles.card}
          ringStyle={styles.ring}
          ring={<Poster media={credit} width={180} />}
        >
          <Text style={typography.callout} numberOfLines={2}>
            {credit.title}
          </Text>
          {(credit.year || credit.role) && (
            <Text style={typography.caption} numberOfLines={2}>
              {[credit.year, credit.role].filter(Boolean).join(" · ")}
            </Text>
          )}
        </FocusItem>
      ))}
    </FocusRow>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 180,
    gap: space[1],
  },
  ring: {
    borderRadius: radius.md,
  },
});
