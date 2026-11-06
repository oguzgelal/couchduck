import { useRef, useState } from "react";
import { TextInput, View } from "react-native";
import { KeyboardInput } from "../ui/keyboard-input";
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
      <KeyboardInput
        ref={inputRef}
        value={draft ?? value ?? ""}
        onChangeText={setDraft}
        onEndEditing={handleEndEditing}
        placeholder={title}
      />
    </View>
  );
}
