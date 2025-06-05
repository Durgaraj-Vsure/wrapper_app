import { useEffect } from "react";
import * as Application from "expo-application";
import { Platform } from "react-native";

export default function useAndroidId() {
  useEffect(() => {
    const getAndroidId = async () => {
      try {
        if (Platform.OS === "android") {
          const id = Application.getAndroidId();
          console.log("Android ID:", id);
        }
      } catch (error) {
        console.warn("Failed to get Android ID:", error);
      }
    };

    getAndroidId();
  }, []);
}
