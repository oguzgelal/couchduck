import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Check } from "lucide-react-native";
import { useSettings } from "../../hooks/use-settings";
import { space, typography } from "../../theme";
import { Button } from "../ui/button";
import { Chip } from "../ui/chip";
import { CHOICE_FIELDS, selectedChoices, type ChoiceKey } from "./choice-fields";

type SettingsChoicePickerProps = {
  field: ChoiceKey;
  onDone: () => void;
};

export function SettingsChoicePicker({ field, onDone }: SettingsChoicePickerProps) {
  const { settings, update } = useSettings();
  const { title, description, multiple, options } = CHOICE_FIELDS[field];
  const selected = selectedChoices(settings, field);
  const preferredOption = selected[0] ?? options[0];

  const handleSelect = (option: string) => {
    if (!multiple) {
      update({ [field]: option });
      onDone();
      return;
    }
    const next = selected.includes(option)
      ? selected.filter((choice) => choice !== option)
      : [...selected, option];
    update({ [field]: next });
  };

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={typography.title2}>{title}</Text>
        <Text style={typography.body}>
          {multiple ? `${description}. Pick as many as you like.` : description}
        </Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.options}>
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <Chip
              key={option}
              label={option}
              icon={isSelected ? Check : undefined}
              selected={isSelected}
              hasTVPreferredFocus={option === preferredOption}
              onPress={() => handleSelect(option)}
            />
          );
        })}
      </ScrollView>
      {multiple && <Button label="Done" variant="primary" onPress={onDone} style={styles.done} />}
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
