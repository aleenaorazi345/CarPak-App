import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useState } from 'react';
import { Alert, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { app } from '../firebase/config';
import styles from '../styles/signupStyles.config';

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const auth = getAuth(app);

  const handleSignup = async () => {
    // Validation
    if (!email || !password || !name) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // You can save the user's name to Firestore or Realtime Database here
      // For now, we'll save it to AsyncStorage
      await AsyncStorage.setItem('userName', name);

      // Save credentials if "Remember Me" is checked
      if (rememberMe) {
        await AsyncStorage.setItem('rememberMe', 'true');
        await AsyncStorage.setItem('userEmail', email);
        await AsyncStorage.setItem('userPassword', password);
        await AsyncStorage.setItem('userName', name);
      }

      Alert.alert(
        'Success', 
        'Account created successfully!', 
        [
          { 
            text: 'OK', 
            onPress: () => router.replace('/(tabs)') 
          }
        ]
      );
    } catch (error) {
      Alert.alert('Signup Error', error.message);
    } finally {
      setIsLoading(false);
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
        autoCapitalize="words"
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry={!showPassword}
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        placeholder="Confirm Password"
        placeholderTextColor="#999"
        secureTextEntry={!showPassword}
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Show/Hide Password Toggle */}
      <TouchableOpacity 
        style={styles.showPasswordToggle}
        onPress={() => setShowPassword(!showPassword)}
      >
        <Text style={styles.showPasswordText}>
          {showPassword ? 'Hide' : 'Show'} Password
        </Text>
      </TouchableOpacity>

      {/* Remember Me Switch */}
      <View style={styles.rememberMeContainer}>
        <Switch
          value={rememberMe}
          onValueChange={setRememberMe}
          trackColor={{ false: '#767577', true: '#007AFF' }}
          thumbColor={rememberMe ? '#fff' : '#f4f3f4'}
        />
        <Text style={styles.rememberMeText}>Remember Me</Text>
      </View>

      {/* Signup Button */}
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSignup}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.link}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}