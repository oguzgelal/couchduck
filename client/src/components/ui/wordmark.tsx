import { Image, StyleSheet } from "react-native";

const HEIGHT = 40;

export function Wordmark() {
  return (
    <Image
      source={require("../../../assets/images/couchduck-wordmark-cream.png")}
      accessibilityLabel="CouchDuck"
      style={styles.wordmark}
    />
  );
}

const styles = StyleSheet.create({
  wordmark: {
    width: (HEIGHT * 1477) / 202,
    height: HEIGHT,
    alignSelf: "flex-start",
  },
});
