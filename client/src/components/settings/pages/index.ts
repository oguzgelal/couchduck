import type { ComponentType } from "react";
import { CircleUser, Clapperboard, Globe, KeyRound, User, type LucideIcon } from "lucide-react-native";
import { AboutPage } from "./about-page";
import { AccountPage } from "./account-page";
import { AvailabilityPage } from "./availability-page";
import { ContentPage } from "./content-page";
import { PlanPage } from "./plan-page";

export type SettingsPageProps = {
  subpage: string | null;
  returnFocusTo?: string;
  onOpenSubpage: (id: string) => void;
  onCloseSubpage: () => void;
  onSignOut: () => void;
};

type SettingsPage = {
  id: string;
  label: string;
  icon: LucideIcon;
  Page: ComponentType<SettingsPageProps>;
};

export const SETTINGS_PAGES: SettingsPage[] = [
  { id: "about", label: "About you", icon: User, Page: AboutPage },
  { id: "availability", label: "Availability", icon: Globe, Page: AvailabilityPage },
  { id: "content", label: "Content", icon: Clapperboard, Page: ContentPage },
  { id: "plan", label: "Plan and key", icon: KeyRound, Page: PlanPage },
  { id: "account", label: "Account", icon: CircleUser, Page: AccountPage },
];
