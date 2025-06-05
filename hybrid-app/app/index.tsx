import { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Pressable,
} from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Input from "../components/Input";
import useAndroidId from "../hooks/useAndroidId"; // create this hook file

export default function Index() {
  useAndroidId();
  const [urlInput, setUrlInput] = useState("");
  const [webUrl, setWebUrl] = useState<string | null>(null);

  // Load saved URL on launch
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("cached_url");
      if (saved) setWebUrl(saved);
    })();
  }, []);

  const handleSubmit = async () => {
    const formatted = formatUrl(urlInput);
    if (!formatted) {
      Alert.alert("Invalid URL", "URL must start with http:// or https://");
      return;
    }

    await AsyncStorage.setItem("cached_url", formatted);
    setWebUrl(formatted);
    setUrlInput(""); // clear after saving
  };

  const formatUrl = (url: string): string | null => {
    const trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) return null;
    return trimmed;
  };

  const handleChangeUrl = async () => {
    setWebUrl(null); // clear current
    setUrlInput(""); // reset input
    await AsyncStorage.removeItem("cached_url");
  };

  if (webUrl) {
    return (
      <View className="flex-1 bg-white">
        {/* WebView Content */}
        <WebView
          source={{ uri: webUrl }}
          style={{ flex: 1 }}
          javaScriptEnabled
          domStorageEnabled
        />

        {/* Change URL Button */}
        <View className="absolute bottom-6 right-6">
          <Pressable
            onPress={handleChangeUrl}
            className="bg-red-600 px-4 py-2 rounded-lg active:bg-red-700"
          >
            <Text className="text-white font-medium text-sm">Change URL</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 justify-center bg-white px-6"
    >
      <View className="space-y-4">
        <Text className="text-xl font-semibold text-gray-800">
          Enter Website URL
        </Text>

        <Input
          placeholder="https://example.com"
          value={urlInput}
          onChangeText={setUrlInput}
          keyboardType="url"
          autoCapitalize="none"
        />

        <Pressable
          onPress={handleSubmit}
          className="bg-blue-600 rounded-lg py-3 px-4 active:bg-blue-700"
        >
          <Text className="text-white text-center text-base font-semibold">
            Open Website
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
