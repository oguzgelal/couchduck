import { useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Check, Plus } from "lucide-react-native";
import { useSettings } from "../../hooks/use-settings";
import { space, typography } from "../../theme";
import { Button } from "../ui/button";
import { Chip } from "../ui/chip";
import { KeyboardInput } from "../ui/keyboard-input";
import { CHOICE_FIELDS, selectedChoices, type ChoiceKey } from "./choice-fields";

type SettingsChoicePickerProps = {
  field: ChoiceKey;
  onDone: () => void;
};

export function SettingsChoicePicker({ field, onDone }: SettingsChoicePickerProps) {
  const { settings, update } = useSettings();
  const customInputRef = useRef<TextInput>(null);
  const [customDraft, setCustomDraft] = useState("");
  const config = CHOICE_FIELDS[field];
  const selected = selectedChoices(settings, field);

  const toggle = (option: string) => {
    const next = selected.includes(option)
      ? selected.filter((choice) => choice !== option)
      : [...selected, option];
    update({ [field]: next });
  };

  const addCustom = () => {
    const typed = customDraft.trim();
    setCustomDraft("");
    if (!typed || !config.multiple) return;
    const existing = [...config.options, ...selected].find(
      (option) => option.toLowerCase() === typed.toLowerCase(),
    );
    const option = existing ?? typed;
    if (!selected.includes(option)) update({ [field]: [...selected, option] });
  };

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={typography.title2}>{config.title}</Text>
        <Text style={typography.body}>
          {config.multiple ? `${config.description}. Pick as many as you like.` : config.description}
        </Text>
      </View>
      {config.multiple ? (
        <>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.options}>
            {[...config.options, ...selected.filter((choice) => !config.options.includes(choice))].map((option) => {
              const isSelected = selected.includes(option);
              return (
                <Chip
                  key={option}
                  label={option}
                  icon={isSelected ? Check : undefined}
                  selected={isSelected}
                  hasTVPreferredFocus={option === (selected[0] ?? config.options[0])}
                  onPress={() => toggle(option)}
                />
              );
            })}
            {config.allowCustom && (
              <Chip label="Add" icon={Plus} onPress={() => customInputRef.current?.focus()} />
            )}
          </ScrollView>
          {config.allowCustom && (
            <KeyboardInput
              ref={customInputRef}
              value={customDraft}
              onChangeText={setCustomDraft}
              onEndEditing={addCustom}
              placeholder={`Add to ${config.title.toLowerCase()}`}
            />
          )}
          <Button label="Done" variant="primary" onPress={onDone} style={styles.done} />
        </>
      ) : (
        <config.Picker
          selected={selected[0]}
          onSelect={(value) => {
            update({ [field]: value });
            onDone();
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: space[7],
  },
  heading: {
    gap: space[3],
  },
  scroll: {
    flexGrow: 0,
    margin: -space[4],
  },
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space[4],
    padding: space[4],
  },
  done: {
    alignSelf: "flex-start",
  },
});
