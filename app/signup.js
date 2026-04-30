import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { registerUser } from '../services';
import styles from '../styles/signupStyles.config';

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ✅ Move function INSIDE component
 const handleSignup = async () => {
  if (!email || !password || !name) {
    Alert.alert('Error', 'Please fill all fields');
    return;
  }

  try {
    await registerUser(email, password, name);

    router.replace('/(tabs)');
  } catch (error) {
    Alert.alert('Signup Error', error.message);
  }
};

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join CarPak today</Text>

      <TextInput
        placeholder="Full Name"
        placeholderTextColor="#999"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      {/* ✅ FIXED BUTTON */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleSignup}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.link}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>

    </View>
  );
}