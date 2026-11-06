import type { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { Button } from "../ui/button";
import { SettingsRow } from "./settings-row";
import { SettingsSection } from "./settings-section";

export type SettingsPickerRow = {
  id: string;
  title: string;
  description: string;
  value?: string;
  picker: ReactNode;
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
  const openRow = rows.find((row) => row.id === subpage);

  if (openRow) {
    return (
      <SettingsSection
        title={openRow.title}
        description={openRow.multiple ? `${openRow.description}. Pick as many as you like.` : openRow.description}
      >
        {openRow.picker}
        {openRow.multiple && <Button label="Done" variant="primary" onPress={onCloseSubpage} style={styles.done} />}
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
