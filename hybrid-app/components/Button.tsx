import { Text, Pressable, PressableProps } from "react-native";

interface Props extends PressableProps {
  title: string;
}

export default function Button({ title, ...rest }: Props) {
  return (
    <Pressable
      className="bg-blue-600 px-4 py-3 rounded-lg active:bg-blue-700"
      {...rest}
    >
      <Text className="text-white text-center font-medium">{title}</Text>
    </Pressable>
  );
}
