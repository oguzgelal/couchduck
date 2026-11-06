import { StyleSheet, TextInput, type TextInputProps } from "react-native";

export function KeyboardInput(props: TextInputProps & { ref?: React.Ref<TextInput> }) {
  // tvOS draws its own system chrome around a visible TextInput, so it stays hidden and only hosts the keyboard.
  return <TextInput {...props} style={styles.hidden} focusable={false} />;
}

const styles = StyleSheet.create({
  hidden: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
});
