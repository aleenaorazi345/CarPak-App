import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from '../styles/onboarding1Styles.config';
export default function onboard1() {
  const router = useRouter();

  return (
<View style={styles.container}>
  <Text style={styles.stepText}>Step 1</Text>

  <Text style={styles.title}>Find Your Perfect Ride</Text>

  <Text style={styles.subtitle}>
    Post Your Car in Minutes. Sell Smart, Sell with Speed
  </Text>

 <TouchableOpacity 
  style={styles.nextButton}
  onPress={() => router.push('/onboard2')}
>
  <Text style={styles.nextText}>→</Text>
</TouchableOpacity>
</View>
  );
}