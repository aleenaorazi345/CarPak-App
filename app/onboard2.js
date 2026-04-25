import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from '../styles/onboarding2Styles.config';

export default function Onboard2() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Sell It. Fast & Easy.
      </Text>

      <Text style={styles.subtitle}>
        Secure Transactions And Real Buyers
      </Text>

      <TouchableOpacity
        onPress={() => router.replace('/login')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          Let’s Start
        </Text>
      </TouchableOpacity>

    </View>
  );
}