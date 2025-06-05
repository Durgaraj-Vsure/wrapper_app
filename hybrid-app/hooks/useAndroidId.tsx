import { useEffect } from "react";
import { Platform } from "react-native";
import * as Application from "expo-application";

export default function useAndroidId() {
  useEffect(() => {
    const getAndroidId = async () => {
      if (Platform.OS === "android") {
        const id = await Application.getAndroidId();
        console.log("📱 Android ID:", id);
        // In future: send `id` to your API
      } else {
        console.log("Not an Android device.");
      }
    };

    getAndroidId();
  }, []);
}
