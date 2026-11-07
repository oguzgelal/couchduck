import { useEffect, useRef, useState, type ComponentRef } from "react";
import { StyleSheet, Text, TVFocusGuideView, View } from "react-native";
import { CircleChevronLeft } from "lucide-react-native";
import { SETTINGS_PAGES } from "../components/settings/pages";
import { SettingsNavItem } from "../components/settings/settings-nav-item";
import { useTVBack } from "../hooks/use-tv-back";
import { KeyAction, useTVRemote } from "../hooks/use-tv-remote";
import { colors, space, typography } from "../theme";

type SettingsScreenProps = {
  onClose: () => void;
  onSignOut: () => void;
};

export function SettingsScreen({ onClose, onSignOut }: SettingsScreenProps) {
  const [pageId, setPageId] = useState(SETTINGS_PAGES[0].id);
  const [activePane, setActivePane] = useState<"nav" | "content">("nav");
  const [contentEntry, setContentEntry] = useState(0);
  const [subpage, setSubpage] = useState<string | null>(null);
  const [returnFocusTo, setReturnFocusTo] = useState<string>();
  const navRef = useRef<ComponentRef<typeof TVFocusGuideView>>(null);
  const contentRef = useRef<ComponentRef<typeof TVFocusGuideView>>(null);
  const { Page } = SETTINGS_PAGES.find((page) => page.id === pageId) ?? SETTINGS_PAGES[0];

  const selectPage = (id: string) => {
    if (id === pageId) return;
    setPageId(id);
    setSubpage(null);
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

  const closeSubpage = () => {
    setReturnFocusTo(subpage ?? undefined);
    setSubpage(null);
  };

  useEffect(() => {
    if (contentEntry > 0) contentRef.current?.requestTVFocus();
  }, [contentEntry]);

  useTVRemote((eventType, keyAction) => {
    if (activePane === "nav" && eventType === "right" && keyAction !== KeyAction.down) enterContent();
  });

  useTVBack(() => {
    if (subpage) closeSubpage();
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
          <Text style={typography.caption}>Press</Text>
          <CircleChevronLeft size={26} color={colors.inkSubtle} strokeWidth={2.5} />
          <Text style={typography.caption}>to return to the chat</Text>
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
        trapFocusLeft={subpage !== null}
        style={styles.content}
      >
        <Page
          subpage={subpage}
          returnFocusTo={returnFocusTo}
          onOpenSubpage={setSubpage}
          onCloseSubpage={closeSubpage}
          onSignOut={onSignOut}
        />
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
