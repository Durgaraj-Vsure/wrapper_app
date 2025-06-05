import { TextInput, TextInputProps } from "react-native";

export default function Input(props: TextInputProps) {
  return (
    <TextInput
      className="border border-gray-400 dark:border-gray-600 rounded-md px-4 py-3 text-base text-black dark:text-white bg-white dark:bg-gray-800"
      placeholderTextColor="#999"
      {...props}
    />
  );
}
