import { useEffect, useEffectEvent, useRef, useState, type ComponentRef } from "react";
import { StyleSheet, Text, TVEventHandler, TVFocusGuideView, View } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import type { ChoiceKey } from "../components/settings/choice-fields";
import { SETTINGS_PAGES } from "../components/settings/pages";
import { SettingsChoicePicker } from "../components/settings/settings-choice-picker";
import { SettingsNavItem } from "../components/settings/settings-nav-item";
import { useTVBack } from "../hooks/use-tv-back";
import { colors, space, typography } from "../theme";

const KEY_ACTION_DOWN = 0;

type SettingsScreenProps = {
  onClose: () => void;
  onSignOut: () => void;
};

export function SettingsScreen({ onClose, onSignOut }: SettingsScreenProps) {
  const [pageId, setPageId] = useState(SETTINGS_PAGES[0].id);
  const [activePane, setActivePane] = useState<"nav" | "content">("nav");
  const [contentEntry, setContentEntry] = useState(0);
  const [openChoice, setOpenChoice] = useState<ChoiceKey | null>(null);
  const [returnFocusTo, setReturnFocusTo] = useState<ChoiceKey>();
  const navRef = useRef<ComponentRef<typeof TVFocusGuideView>>(null);
  const contentRef = useRef<ComponentRef<typeof TVFocusGuideView>>(null);
  const { Page } = SETTINGS_PAGES.find((page) => page.id === pageId) ?? SETTINGS_PAGES[0];

  const selectPage = (id: string) => {
    if (id === pageId) return;
    setPageId(id);
    setOpenChoice(null);
    setReturnFocusTo(undefined);
  };

  const enterContent = () => {
    setActivePane("content");
    setReturnFocusTo(undefined);
    setContentEntry((entry) => entry + 1);
  };

  const returnToNav = () => {
    setActivePane("nav");
    navRef.current?.requestTVFocus();
  };

  const closeChoice = () => {
    setReturnFocusTo(openChoice ?? undefined);
    setOpenChoice(null);
  };

  useEffect(() => {
    if (contentEntry > 0) contentRef.current?.requestTVFocus();
  }, [contentEntry]);

  const handleRemoteEvent = useEffectEvent((eventType: string, keyAction: unknown) => {
    if (activePane === "nav" && eventType === "right" && Number(keyAction) !== KEY_ACTION_DOWN) enterContent();
  });

  useEffect(() => {
    const subscription = TVEventHandler.addListener((event) => {
      if (event) handleRemoteEvent(event.eventType, event.eventKeyAction);
    });
    return () => subscription?.remove();
  }, []);

  useTVBack(() => {
    if (openChoice) closeChoice();
    else if (activePane === "content") returnToNav();
    else onClose();
  });

  return (
    <View style={styles.container}>
      <TVFocusGuideView
        ref={navRef}
        autoFocus
        trapFocusUp
        trapFocusDown
        trapFocusLeft
        onFocusEnter={() => setActivePane("nav")}
        style={styles.nav}
      >
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
              onEnter={enterContent}
            />
          ))}
        </View>
        <View style={styles.backHint}>
          <ChevronLeft size={22} color={colors.inkSubtle} strokeWidth={2.5} />
          <Text style={typography.caption}>Press Back to return to the chat</Text>
        </View>
      </TVFocusGuideView>
      <TVFocusGuideView
        key={`${pageId}-${contentEntry}`}
        ref={contentRef}
        autoFocus
        focusable={activePane === "content"}
        trapFocusUp
        trapFocusDown
        trapFocusRight
        style={styles.content}
      >
        {openChoice ? (
          <SettingsChoicePicker field={openChoice} onDone={closeChoice} />
        ) : (
          <Page onOpenChoice={setOpenChoice} returnFocusTo={returnFocusTo} onSignOut={onSignOut} />
        )}
      </TVFocusGuideView>
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
