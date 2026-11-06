import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FeatureItem } from "../components/feature-item";
import { SplitLayout } from "../components/split-layout";
import { Button } from "../components/ui/button";
import { Duck } from "../components/ui/duck";
import { space, typography } from "../theme";
import { ConnectKeyScreen } from "./connect-key-screen";

const FEATURES = [
  "Keep asking tonight",
  "More questions every month",
  "Smarteser models for picks and plans",
];

function nextMonthlyReset() {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
  ).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function PaywallScreen() {
  const [connectingKey, setConnectingKey] = useState(false);

  if (connectingKey)
    return <ConnectKeyScreen onBack={() => setConnectingKey(false)} />;

  return (
    <SplitLayout
      asideTone="raised"
      aside={
        <View style={styles.aside}>
          <Text style={typography.title2}>CouchDuck Plus</Text>
          <View style={styles.features}>
            {FEATURES.map((feature) => (
              <FeatureItem key={feature} label={feature} />
            ))}
          </View>
          <View style={styles.actions}>
            <Button
              label="Get CouchDuck Plus"
              variant="primary"
              hasTVPreferredFocus
            />
            <Button
              label="Use your own OpenRouter key"
              onPress={() => setConnectingKey(true)}
            />
            <Text style={[typography.caption, styles.billing]}>
              Plus is billed to your Apple Account. Cancel anytime.
            </Text>
          </View>
        </View>
      }
    >
      <Duck height={160} />
      <Text style={[typography.title1, styles.title]}>
        You’ve used this month’s free questions
      </Text>
      <Text style={[typography.body, styles.description]}>
        They come back on {nextMonthlyReset()}. Or keep going right now with
        CouchDuck Plus.
      </Text>
    </SplitLayout>
  );
}

const styles = StyleSheet.create({
  aside: {
    gap: space[7],
  },
  features: {
    gap: 20,
  },
  actions: {
    gap: space[4],
  },
  billing: {
    textAlign: "center",
  },
  title: {
    maxWidth: 820,
  },
  description: {
    maxWidth: 780,
  },
});
