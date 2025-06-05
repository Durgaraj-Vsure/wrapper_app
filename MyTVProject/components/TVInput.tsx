import React from "react";
import { TextInput, View, StyleSheet, Platform, Text } from "react-native";

interface Props {
  placeholder?: string;
  value: string;
  onChangeText: (v: string) => void;
}

export default function TVInput({ placeholder, value, onChangeText }: Props) {
  const isTV = Platform.OS === "android" && Platform.isTV;

  return (
    <View>
      <TextInput
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        style={styles.input}
        keyboardType="url"
        autoCapitalize="none"
        /* TV-specific props */
        focusable={isTV}
        showSoftInputOnFocus={isTV} // pops Google-TV keyboard
        returnKeyType="done"
        blurOnSubmit
      />
      {isTV && value.length === 0 && (
        <Text style={styles.hint}>Select twice to start typing</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#f0f0f0",
    padding: 18,
    fontSize: 20,
    borderRadius: 10,
    color: "#000",
  },
  hint: { marginTop: 6, color: "#666", fontSize: 14 },
});
