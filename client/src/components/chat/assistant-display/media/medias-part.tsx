import { useState } from "react";
import { StyleSheet } from "react-native";
import { radius } from "../../../../theme";
import { FocusItem, FocusRow } from "../focus-row";
import { MediaDetails } from "./media-details";
import { Poster } from "./poster";
import type { MediaList } from "./types";

export function MediasPart({ list }: { list: MediaList }) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const focusedMedia = list.items[focusedIndex];

  return (
    <FocusRow heading={list.heading} footer={focusedMedia && <MediaDetails media={focusedMedia} />}>
      {list.items.map((media, index) => (
        <FocusItem
          key={`${media.title}-${index}`}
          label={media.title}
          onFocus={() => setFocusedIndex(index)}
          ringStyle={styles.ring}
          ring={<Poster media={media} width={220} />}
        />
      ))}
    </FocusRow>
  );
}

const styles = StyleSheet.create({
  ring: {
    borderRadius: radius.md,
  },
});
