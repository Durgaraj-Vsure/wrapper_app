// components/Input.tsx
import React from "react";
import { TextInput, View, Text, Platform, StyleSheet } from "react-native";

interface Props {
  placeholder?: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: "default" | "url";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

export default function Input({
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  autoCapitalize = "none",
}: Props) {
  const isTV = Platform.isTV;

  if (isTV) {
    /** ------- TV-optimised field ------- **/
    return (
      <View style={styles.tvWrapper}>
        <TextInput
          style={styles.tvInput}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#888"
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          /* KEY LINES ↓↓↓ */
          focusable={true}              // allows D-pad focus
          showSoftInputOnFocus={true}   // Android-TV soft keyboard
          enablesReturnKeyAutomatically // tvOS “Done” button
          returnKeyType="done"
        />
        {value.length === 0 && (
          <Text style={styles.hint}>
            Press the centre/OK button twice to edit
          </Text>
        )}
      </View>
    );
  }

  /** ------- Mobile / web ------- **/
  return (
    <TextInput
      style={styles.mobileInput}
      value={value}
      placeholder={placeholder}
      placeholderTextColor="#888"
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
    />
  );
}

const styles = StyleSheet.create({
  mobileInput: {
    backgroundColor: "#f0f0f0",
    padding: 14,
    fontSize: 16,
    borderRadius: 8,
    color: "#000",
  },
  tvWrapper: { marginBottom: 20 },
  tvInput: {
    backgroundColor: "#f0f0f0",
    padding: 18,
    fontSize: 20,
    borderRadius: 10,
    color: "#000",
    // highlight when focused
    borderWidth: 2,
    borderColor: "transparent",
  },
  hint: {
    marginTop: 6,
    fontSize: 14,
    color: "#666",
  },
});
