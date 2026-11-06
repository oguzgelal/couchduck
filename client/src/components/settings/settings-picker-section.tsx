import { useCallback, useState, type ReactNode } from "react";
import { findNodeHandle, StyleSheet, View } from "react-native";
import { Button } from "../ui/button";
import { SettingsRow } from "./settings-row";
import { SettingsSection } from "./settings-section";

export type SettingsPickerFocus = {
  nextFocusDown?: number;
};

export type SettingsPickerRow = {
  id: string;
  title: string;
  description: string;
  value?: string;
  picker: (focus: SettingsPickerFocus) => ReactNode;
  multiple?: boolean;
};

type SettingsPickerSectionProps = {
  title: string;
  description: string;
  rows: SettingsPickerRow[];
  subpage: string | null;
  returnFocusTo?: string;
  onOpenSubpage: (id: string) => void;
  onCloseSubpage: () => void;
};

export function SettingsPickerSection({
  title,
  description,
  rows,
  subpage,
  returnFocusTo,
  onOpenSubpage,
  onCloseSubpage,
}: SettingsPickerSectionProps) {
  const [doneTag, setDoneTag] = useState<number>();
  const doneRef = useCallback((done: View | null) => {
    if (done) setDoneTag(findNodeHandle(done) ?? undefined);
  }, []);
  const openRow = rows.find((row) => row.id === subpage);

  if (openRow) {
    return (
      <SettingsSection
        title={openRow.title}
        description={openRow.multiple ? `${openRow.description}. Pick as many as you like.` : openRow.description}
      >
        {openRow.picker({ nextFocusDown: openRow.multiple ? doneTag : undefined })}
        {openRow.multiple && (
          <Button ref={doneRef} label="Done" variant="primary" onPress={onCloseSubpage} style={styles.done} />
        )}
      </SettingsSection>
    );
  }

  return (
    <SettingsSection title={title} description={description}>
      {rows.map((row) => (
        <SettingsRow
          key={row.id}
          title={row.title}
          description={row.description}
          value={row.value}
          hasTVPreferredFocus={row.id === returnFocusTo}
          onPress={() => onOpenSubpage(row.id)}
        />
      ))}
    </SettingsSection>
  );
}

const styles = StyleSheet.create({
  done: {
    alignSelf: "flex-start",
  },
});
