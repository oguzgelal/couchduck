import { useEffect, useEffectEvent } from "react";
import { TVEventHandler } from "react-native";

export const KeyAction = { down: 0, up: 1 } as const;

export function useTVRemote(onEvent: (eventType: string, keyAction: number) => void) {
  const handleEvent = useEffectEvent(onEvent);

  useEffect(() => {
    const subscription = TVEventHandler.addListener((event) => {
      if (event) handleEvent(event.eventType, Number(event.eventKeyAction));
    });
    return () => subscription?.remove();
  }, []);
}
