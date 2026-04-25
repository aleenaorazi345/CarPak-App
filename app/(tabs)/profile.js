import { Text, View } from 'react-native';

export default function Profile() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
      <Text style={{ color: 'white', fontSize: 22 }}>Profile 👤</Text>
    </View>
  );
}