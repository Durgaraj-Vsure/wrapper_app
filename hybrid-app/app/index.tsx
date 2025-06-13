import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Input from "../components/Input";
import useAndroidId from "../hooks/useAndroidId";
import { SafeAreaView } from "react-native-safe-area-context";
import type { WebViewNavigation } from "react-native-webview";

export default function Index() {
  useAndroidId();
  const [urlInput, setUrlInput] = useState("");
  const [webUrl, setWebUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("cached_url");
        if (saved) {
          setWebUrl(saved);
          setError(null);
        }
      } catch (err) {
        console.error("Failed to load saved URL:", err);
      }
    })();
  }, []);

  useEffect(() => {
    const onBackPress = () => {
      if (webUrl && canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => backHandler.remove();
  }, [canGoBack, webUrl]);

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);
    const formatted = formatUrl(urlInput);
    if (!formatted) {
      Alert.alert("Invalid URL", "URL must start with http:// or https://");
      return;
    }

    await AsyncStorage.setItem("cached_url", formatted);
    setWebUrl(formatted);
    setUrlInput("");
  };

  const formatUrl = (url: string): string | null => {
    const trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) return null;
    return trimmed;
  };

  const handleChangeUrl = async () => {
    setWebUrl(null);
    setUrlInput("");
    await AsyncStorage.removeItem("cached_url");
  };

  if (webUrl) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <WebView
          ref={webViewRef}
          source={{ uri: webUrl }}
          style={styles.webview}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState={true}
          onNavigationStateChange={(navState: WebViewNavigation) =>
            setCanGoBack(navState.canGoBack)
          }
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          onError={(e) => {
            setError(e.nativeEvent.description || "Failed to load webpage");
            setIsLoading(false);
          }}
          androidLayerType="hardware"
          overScrollMode="never"
          cacheEnabled={true}
          allowsInlineMediaPlayback
          allowsFullscreenVideo
          scalesPageToFit
          automaticallyAdjustContentInsets={false}
        />

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.bannerText}>{error}</Text>
          </View>
        )}

        {isLoading && (
          <View style={styles.loadingBanner}>
            <ActivityIndicator color="#fff" size="small" />
            <Text style={styles.bannerText}>Loading...</Text>
          </View>
        )}

        <View style={styles.floatingButton}>
          <Pressable style={styles.buttonRed} onPress={handleChangeUrl}>
            <Text style={styles.buttonText}>Change URL</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.inputContainer}
    >
      <View style={styles.inputBox}>
        <Text style={styles.title}>Enter Website URL</Text>

        <Input
          placeholder="https://example.com"
          value={urlInput}
          onChangeText={setUrlInput}
          keyboardType="url"
          autoCapitalize="none"
        />

        <Pressable style={styles.buttonBlue} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Open Website</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webview: {
    flex: 1,
  },
  errorBanner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#dc2626",
    padding: 16,
    zIndex: 1,
  },
  loadingBanner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#2563eb",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    zIndex: 1,
  },
  bannerText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
    flex: 1,
  },
  floatingButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
  },
  buttonRed: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonBlue: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 14,
  },
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#fff",
  },
  inputBox: {
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
  },
});
