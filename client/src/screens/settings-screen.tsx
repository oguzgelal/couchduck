import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import type { ChoiceKey } from "../components/settings/choice-fields";
import { SETTINGS_PAGES } from "../components/settings/pages";
import { SettingsChoicePicker } from "../components/settings/settings-choice-picker";
import { SettingsNavItem } from "../components/settings/settings-nav-item";
import { useTVBack } from "../hooks/use-tv-back";
import { colors, space, typography } from "../theme";

type SettingsScreenProps = {
  onClose: () => void;
  onSignOut: () => void;
};

export function SettingsScreen({ onClose, onSignOut }: SettingsScreenProps) {
  const [pageId, setPageId] = useState(SETTINGS_PAGES[0].id);
  const [openChoice, setOpenChoice] = useState<ChoiceKey | null>(null);
  const [returnFocusTo, setReturnFocusTo] = useState<ChoiceKey>();
  const { Page } = SETTINGS_PAGES.find((page) => page.id === pageId) ?? SETTINGS_PAGES[0];

  const closeChoice = () => {
    setReturnFocusTo(openChoice ?? undefined);
    setOpenChoice(null);
  };

  const selectPage = (id: string) => {
    if (id === pageId && !openChoice) return;
    setPageId(id);
    setOpenChoice(null);
    setReturnFocusTo(undefined);
  };

  useTVBack(openChoice ? closeChoice : onClose);

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <Text style={typography.title1}>Settings</Text>
        <View style={styles.navItems}>
          {SETTINGS_PAGES.map((page, index) => (
            <SettingsNavItem
              key={page.id}
              label={page.label}
              icon={page.icon}
              selected={page.id === pageId}
              hasTVPreferredFocus={index === 0}
              onSelect={() => selectPage(page.id)}
            />
          ))}
        </View>
        <View style={styles.backHint}>
          <ChevronLeft size={22} color={colors.inkSubtle} strokeWidth={2.5} />
          <Text style={typography.caption}>Press Back to return to the chat</Text>
        </View>
      </View>
      <View style={styles.content}>
        {openChoice ? (
          <SettingsChoicePicker field={openChoice} onDone={closeChoice} />
        ) : (
          <Page onOpenChoice={setOpenChoice} returnFocusTo={returnFocusTo} onSignOut={onSignOut} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "stretch",
    flexDirection: "row",
  },
  nav: {
    width: 600,
    paddingVertical: space.safeY,
    paddingHorizontal: space.safeX,
    gap: space[7],
    backgroundColor: colors.surface,
  },
  navItems: {
    gap: space[3],
  },
  backHint: {
    marginTop: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: space[2],
  },
  content: {
    flex: 1,
    paddingTop: 68,
    paddingBottom: space.safeY,
    paddingHorizontal: space.safeX,
  },
});
