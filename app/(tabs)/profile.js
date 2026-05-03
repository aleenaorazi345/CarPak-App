import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
// Make sure to import AsyncStorage at the top of Profile.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F4B400',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#F4B400',
    overflow: 'hidden',
    position: 'relative',
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileIcon: {
    fontSize: 60,
    color: '#fff',
  },
  uploadButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#F4B400',
    borderRadius: 50,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  profileSubtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F4B400',
    borderWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F4B400',
    textTransform: 'uppercase',
    flex: 1,
  },
  infoBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F4B400',
    borderWidth: 1,
    borderColor: '#eee',
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  contentBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  contentText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  contentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F4B400',
    marginBottom: 12,
  },
  faqItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F4B400',
    borderWidth: 1,
    borderColor: '#eee',
  },
  faqQuestion: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F4B400',
  },
  faqAnswer: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    marginTop: 12,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F4B400',
    borderWidth: 1,
    borderColor: '#eee',
  },
  settingsIcon: {
    marginRight: 12,
    color: '#F4B400',
  },
  settingsText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  settingsArrow: {
    color: '#999',
    fontSize: 18,
  },
  logoutButton: {
    backgroundColor: '#d32f2f',
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    color: '#333',
    marginTop: 12,
    fontSize: 14,
  },
});

export default function Profile({ navigation }) {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedPersonalInfo, setExpandedPersonalInfo] = useState(false);
  const [expandedPrivacy, setExpandedPrivacy] = useState(false);
  const [expandedFaqSection, setExpandedFaqSection] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  // 🔄 REFRESH DATA WHEN RETURNING FROM SETTINGS
  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  const fetchUserData = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const db = getFirestore();
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setUserData({
            uid: user.uid,
            name: data.name || 'User',
            email: user.email || 'Not provided',
            phone: data.phone || 'Not provided',
            profileImage: data.profileImage || null,
            ...data,
          });
          if (data.profileImage) {
            setProfileImage(data.profileImage);
          }
        } else {
          setUserData({
            uid: user.uid,
            name: 'User',
            email: user.email || 'Not provided',
            phone: 'Not provided',
            profileImage: null,
          });
        }
      }
    } catch (_error) {
      console.error('Error fetching user data:', _error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need permission to access your photo library.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setProfileImage(imageUri);

        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const db = getFirestore();
          const userDocRef = doc(db, 'users', user.uid);
          await setDoc(userDocRef, { profileImage: imageUri }, { merge: true });

          setUserData(prev => ({
            ...prev,
            profileImage: imageUri,
          }));

          Alert.alert('Success', 'Profile picture updated!');
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to update profile picture.');
    }
  };

  

// Then update your handleLogout function
const handleLogout = () => {
  Alert.alert(
    'Logout',
    'Are you sure you want to logout?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            const auth = getAuth();
            
            // Clear remember me data from AsyncStorage
            await AsyncStorage.multiRemove(['rememberMe', 'userEmail', 'userPassword']);
            
            // Sign out from Firebase
            await signOut(auth);
            
            // Clear local state
            setUserData(null);
            setProfileImage(null);
            
            // Navigate to login
            router.replace('/login');
            
          } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('Error', 'Failed to logout. Please try again.');
          }
        },
      },
    ]
  );
};
              
   
 
  const handleSettings = () => {
    router.push('/settings');
  };

  const handleAdminAccess = () => {
    Alert.prompt(
      'Admin Access',
      'Enter Admin PIN Code:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Submit',
          onPress: (pin) => {
            if (pin === 'admin123') {
              router.push('/adminDashboard');
            } else {
              Alert.alert('Error', 'Invalid PIN Code!');
            }
          },
        },
      ],
      'secure-text'
    );
  };

  const faqData = [
    {
      id: 1,
      question: 'How do I edit my profile information?',
      answer: 'You can edit your profile by going to Settings and tapping on "Edit Profile". Update your details and save the changes.',
    },
    {
      id: 2,
      question: 'How do I change my password?',
      answer: 'Navigate to Settings > Account Security > Change Password. Enter your current password and then set a new password.',
    },
    {
      id: 3,
      question: 'How can I delete my account?',
      answer: 'Go to Settings > Account Settings > Delete Account. Note that this action is permanent and cannot be undone.',
    },
    {
      id: 4,
      question: 'How do I update my phone number?',
      answer: 'Go to Settings > Personal Information and tap on the phone number field to edit it.',
    },
    {
      id: 5,
      question: 'Is my data secure?',
      answer: 'Yes, we use industry-standard encryption to protect your personal data. Your information is never shared with third parties without your consent.',
    },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top']}>
        <ActivityIndicator size="large" color="#F4B400" />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImage}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profilePicture} />
            ) : (
              <Ionicons name="person" style={styles.profileIcon} />
            )}
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Ionicons name="camera" size={18} color="#0f172a" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{userData?.name || 'User'}</Text>
          <Text style={styles.profileSubtext}>CarPak Member</Text>
        </View>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <TouchableOpacity
            onPress={() => setExpandedPersonalInfo(!expandedPersonalInfo)}
            activeOpacity={0.7}
            style={styles.sectionTitleContainer}
          >
            <Text style={styles.sectionTitle}>📋 Personal Information</Text>
            <Ionicons
              name={expandedPersonalInfo ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#F4B400"
            />
          </TouchableOpacity>

          {expandedPersonalInfo && (
            <>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Email Address</Text>
                <Text style={styles.infoValue}>{userData?.email || 'Not provided'}</Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Phone Number</Text>
                <Text style={styles.infoValue}>{userData?.phone || 'Not provided'}</Text>
              </View>
            </>
          )}
        </View>

        {/* Privacy Policy Section */}
        <View style={styles.section}>
          <TouchableOpacity
            onPress={() => setExpandedPrivacy(!expandedPrivacy)}
            activeOpacity={0.7}
            style={styles.sectionTitleContainer}
          >
            <Text style={styles.sectionTitle}>🔒 Privacy Policy</Text>
            <Ionicons
              name={expandedPrivacy ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#F4B400"
            />
          </TouchableOpacity>

          {expandedPrivacy && (
            <>
              <View style={styles.contentBox}>
                <Text style={styles.contentTitle}>Data Protection</Text>
                <Text style={styles.contentText}>
                  We respect your privacy and are committed to protecting your personal data. Our Privacy
                  Policy outlines how we collect, use, and safeguard your information.
                </Text>
              </View>

              <View style={styles.contentBox}>
                <Text style={styles.contentTitle}>Information We Collect</Text>
                <Text style={styles.contentText}>
                  We collect information you provide directly, such as your name, email, phone number,
                  and payment details to improve our services.
                </Text>
              </View>

              <View style={styles.contentBox}>
                <Text style={styles.contentTitle}>How We Use Your Data</Text>
                <Text style={styles.contentText}>
                  Your data is used to provide and improve our services, communicate with you, process
                  transactions, and comply with legal obligations.
                </Text>
              </View>

              <View style={styles.contentBox}>
                <Text style={styles.contentTitle}>Your Rights</Text>
                <Text style={styles.contentText}>
                  You have the right to access, modify, or delete your personal data. Contact our
                  support team if you wish to exercise any of these rights.
                </Text>
              </View>
            </>
          )}
        </View>

        {/* FAQs Section */}
        <View style={styles.section}>
          <TouchableOpacity
            onPress={() => setExpandedFaqSection(!expandedFaqSection)}
            activeOpacity={0.7}
            style={styles.sectionTitleContainer}
          >
            <Text style={styles.sectionTitle}>❓ Frequently Asked Questions</Text>
            <Ionicons
              name={expandedFaqSection ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#F4B400"
            />
          </TouchableOpacity>

          {expandedFaqSection && faqData.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.faqItem}
              onPress={() => setExpandedFaq(expandedFaq === item.id ? null : item.id)}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.faqQuestion, { flex: 1 }]}>{item.question}</Text>
                <Ionicons
                  name={expandedFaq === item.id ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="#F4B400"
                />
              </View>

              {expandedFaq === item.id && (
                <Text style={styles.faqAnswer}>{item.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionTitleContainer}
            onPress={handleSettings}
            activeOpacity={0.7}
          >
            <Ionicons name="settings" size={20} style={styles.settingsIcon} />
            <Text style={styles.sectionTitle}>⚙️ Account Settings</Text>
            <Ionicons name="chevron-forward" size={18} style={styles.settingsArrow} />
          </TouchableOpacity>
        </View>

        {/* Admin Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionTitleContainer}
            onPress={handleAdminAccess}
            activeOpacity={0.7}
          >
            <Ionicons name="shield-checkmark" size={20} style={styles.settingsIcon} />
            <Text style={styles.sectionTitle}>🛡️ Admin Access</Text>
            <Ionicons name="chevron-forward" size={18} style={styles.settingsArrow} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}