import { useEffect, useState } from "react";
import {
  View,
  Text,
  Platform,
  Pressable,
  BackHandler,
  Alert,
  StyleSheet,
} from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TVInput from "../components/TVInput";
import useAndroidId from "../hooks/useAndroidId";

const STORAGE_KEY = "cached_url";

export default function TVBrowser() {
  /* Only run this screen on Android-TV */
  if (!(Platform.OS === "android" && Platform.isTV)) {
    return (
      <View style={styles.center}>
        <Text style={styles.warn}>
          This screen is intended for Android TV devices.
        </Text>
      </View>
    );
  }

  useAndroidId();

  const [urlText, setUrlText] = useState("");
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /* Load last URL */
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) setCurrentUrl(saved);
    })();
  }, []);

  /* Handle back button */
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (currentUrl) {
        clearUrl();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [currentUrl]);

  /** Helpers */
  const validUrl = (text: string) =>
    /^https?:\/\//i.test(text.trim()) ? text.trim() : null;

  const saveUrl = async () => {
    const formatted = validUrl(urlText);
    if (!formatted) {
      Alert.alert("Invalid URL", "URL must start with http:// or https://");
      return;
    }
    await AsyncStorage.setItem(STORAGE_KEY, formatted);
    setCurrentUrl(formatted);
    setUrlText("");
    setErrorMsg(null);
  };

  const clearUrl = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setCurrentUrl(null);
    setUrlText("");
    setErrorMsg(null);
  };

  /* ---------- UI ---------- */

  if (currentUrl) {
    return (
      <View style={styles.flex}>
        <WebView
          source={{ uri: currentUrl }}
          style={styles.flex}
          onError={(e) => setErrorMsg(e.nativeEvent.description)}
        />

        {errorMsg && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        <View style={styles.fabWrap}>
          <Pressable
            onPress={clearUrl}
            focusable
            style={({ focused }) => [
              styles.fab,
              { backgroundColor: focused ? "#c53030" : "#dc2626" },
            ]}
          >
            <Text style={styles.fabLabel}>Change URL</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  /* URL entry form */
  return (
    <View style={styles.form}>
      <Text style={styles.title}>Enter Website URL</Text>
      <TVInput
        placeholder="https://example.com"
        value={urlText}
        onChangeText={setUrlText}
      />
      <Pressable
        onPress={saveUrl}
        focusable
        style={({ focused }) => [
          styles.btn,
          { backgroundColor: focused ? "#1d4ed8" : "#2563eb" },
        ]}
      >
        <Text style={styles.btnLabel}>Open Website</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  warn: { fontSize: 18 },
  form: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 20,
  },
  btn: {
    marginTop: 20,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  btnLabel: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  fabWrap: { position: "absolute", bottom: 28, right: 28 },
  fab: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  fabLabel: { color: "#fff", fontSize: 14, fontWeight: "600" },
  errorBanner: {
    position: "absolute",
    top: 0,
    width: "100%",
    backgroundColor: "#b91c1c",
    paddingVertical: 8,
  },
  errorText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
  },
});
