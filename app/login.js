import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { app } from '../firebase/config';
import styles from '../styles/loginStyles.config';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const auth = getAuth(app);

  // Check for saved credentials on mount
  useEffect(() => {
    checkAutoLogin();
  }, []);

  const checkAutoLogin = async () => {
    try {
      setIsLoading(true);
      
      const rememberMeStatus = await AsyncStorage.getItem('rememberMe');
      const savedEmail = await AsyncStorage.getItem('userEmail');
      const savedPassword = await AsyncStorage.getItem('userPassword');

      if (rememberMeStatus === 'true' && savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRememberMe(true);
        
        // Attempt auto login
        try {
          await signInWithEmailAndPassword(auth, savedEmail, savedPassword);
          router.replace('/(tabs)');
        } catch (error) {
          console.log('Auto login failed:', error.message);
          await AsyncStorage.removeItem('rememberMe');
          await AsyncStorage.removeItem('userEmail');
          await AsyncStorage.removeItem('userPassword');
        }
      }
    } catch (error) {
      console.error('Auto login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Save credentials if "Remember Me" is checked
      if (rememberMe) {
        await AsyncStorage.setItem('rememberMe', 'true');
        await AsyncStorage.setItem('userEmail', email);
        await AsyncStorage.setItem('userPassword', password);
      } else {
        await AsyncStorage.removeItem('rememberMe');
        await AsyncStorage.removeItem('userEmail');
        await AsyncStorage.removeItem('userPassword');
      }

      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking auto login
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 20, color: '#666' }}>Checking login status...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CarPak</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

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
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

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

      {/* Login Button */}
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/signup')}>
        <Text style={styles.link}>
          Don't have an account? Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
}