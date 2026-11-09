import { Alert, Linking, Platform } from "react-native";
import { Button } from "../../../ui/button";

const youtubeUrl = (videoId: string) =>
  Platform.OS === "ios"
    ? `youtube://watch/${encodeURIComponent(videoId)}`
    : `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;

export function TrailerButton({ videoId }: { videoId: string }) {
  const open = () => Linking.openURL(youtubeUrl(videoId)).catch(() => Alert.alert("Couldn't open YouTube"));

  return <Button label="Watch trailer" variant="primary" onPress={open} style={{ alignSelf: "flex-start" }} />;
}
