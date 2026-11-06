import { useRef, useState } from "react";
import { findNodeHandle, ScrollView, StyleSheet, TextInput, View, type LayoutChangeEvent } from "react-native";
import { Check, Plus } from "lucide-react-native";
import { space } from "../../theme";
import { Chip } from "../ui/chip";
import { KeyboardInput } from "../ui/keyboard-input";
import { pillNeighbors, type PillLayout } from "./pill-grid";

const ADD_KEY = "\0add";

type PillPickerProps = {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  addLabel?: string;
};

export function PillPicker({ options, selected, onChange, addLabel }: PillPickerProps) {
  const pillRefs = useRef(new Map<string, View | null>());
  const inputRef = useRef<TextInput>(null);
  const [layouts, setLayouts] = useState<Record<string, PillLayout>>({});
  const [draft, setDraft] = useState("");
  const pills = [...options, ...selected.filter((choice) => !options.includes(choice))];
  const keys = addLabel ? [...pills, ADD_KEY] : pills;
  const neighbors = pillNeighbors(keys.flatMap((key) => layouts[key] ?? []));

  const toggle = (option: string) =>
    onChange(selected.includes(option) ? selected.filter((choice) => choice !== option) : [...selected, option]);

  const addTyped = () => {
    const typed = draft.trim();
    setDraft("");
    if (!typed) return;
    const option = pills.find((pill) => pill.toLowerCase() === typed.toLowerCase()) ?? typed;
    if (!selected.includes(option)) onChange([...selected, option]);
  };

  const pillProps = (key: string) => {
    const tag = layouts[key]?.tag;
    return {
      ref: (pill: View | null) => {
        pillRefs.current.set(key, pill);
      },
      onLayout: ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
        const pillTag = findNodeHandle(pillRefs.current.get(key) ?? null);
        if (pillTag === null) return;
        setLayouts((current) => ({ ...current, [key]: { x: layout.x, y: layout.y, width: layout.width, tag: pillTag } }));
      },
      ...(tag === undefined ? undefined : neighbors.get(tag)),
    };
  };

  return (
    <>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.pills}>
        {pills.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <Chip
              key={option}
              label={option}
              icon={isSelected ? Check : undefined}
              selected={isSelected}
              hasTVPreferredFocus={option === (selected[0] ?? pills[0])}
              onPress={() => toggle(option)}
              {...pillProps(option)}
            />
          );
        })}
        {addLabel && (
          <Chip label={addLabel} icon={Plus} onPress={() => inputRef.current?.focus()} {...pillProps(ADD_KEY)} />
        )}
      </ScrollView>
      {addLabel && (
        <KeyboardInput
          ref={inputRef}
          value={draft}
          onChangeText={setDraft}
          onEndEditing={addTyped}
          placeholder={addLabel}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
    margin: -space[4],
  },
  pills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space[4],
    padding: space[4],
  },
});
