import { useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { SettingsRow } from "./settings-row";

type SettingsTextRowProps = {
  title: string;
  description: string;
  value?: string;
  hasTVPreferredFocus?: boolean;
  onSubmit: (value: string) => void;
};

export function SettingsTextRow({ title, description, value, hasTVPreferredFocus, onSubmit }: SettingsTextRowProps) {
  const inputRef = useRef<TextInput>(null);
  const [draft, setDraft] = useState<string | null>(null);

  const handleEndEditing = () => {
    const submitted = draft?.trim();
    if (submitted && submitted !== value) onSubmit(submitted);
    setDraft(null);
  };

  return (
    <View>
      <SettingsRow
        title={title}
        description={description}
        value={draft ?? value}
        hasTVPreferredFocus={hasTVPreferredFocus}
        onPress={() => inputRef.current?.focus()}
      />
      {/* tvOS draws its own system chrome around a visible TextInput, so it stays hidden and only hosts the keyboard. */}
      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={draft ?? value ?? ""}
        onChangeText={setDraft}
        onEndEditing={handleEndEditing}
        placeholder={title}
        focusable={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
});
