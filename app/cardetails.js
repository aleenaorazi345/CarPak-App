import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { deleteDoc, doc, getFirestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { addToFavorites, isFavorited, removeFromFavorites } from '../services/favoritesService';
import styles from '../styles/carDetails.config';

export default function CarDetails() {
  const router = useRouter();
  const { car } = useLocalSearchParams();
  const [menuVisible, setMenuVisible] = useState(false);
  const [isFav, setIsFav] = useState(false);

  const carData = car ? JSON.parse(car) : null;
  const db = getFirestore();

  // 🔥 LOAD FAVORITE STATUS
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (carData?.id) {
        const favorited = await isFavorited(carData.id);
        setIsFav(favorited);
      }
    };
    checkFavoriteStatus();
  }, [carData?.id]);

  // 🔥 TOGGLE FAVORITE
  const toggleFavorite = async () => {
    try {
      if (isFav) {
        await removeFromFavorites(carData.id);
        setIsFav(false);
      } else {
        await addToFavorites(carData.id, carData);
        setIsFav(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (!carData) {
    return (
      <View style={styles.container}>
        <Text>No car data found</Text>
      </View>
    );
  }

  // Handle Delete Car
  const handleDeleteCar = async () => {
    Alert.alert(
      'Delete Car',
      `Are you sure you want to delete "${carData.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'Cars', carData.id));
              Alert.alert('Success', 'Car deleted successfully');
              router.back();
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'Failed to delete car');
            }
          },
        },
      ]
    );
    setMenuVisible(false);
  };

  // Handle Edit Car - Navigate to edit page
  const handleEditCar = () => {
    setMenuVisible(false);
    router.push({
      pathname: '/editcar',
      params: { car: JSON.stringify(carData) },
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header with Three Dots */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Car Details</Text>

        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <TouchableOpacity onPress={toggleFavorite}>
            <AntDesign
              name="heart"
              size={24}
              color={isFav ? '#FF4444' : '#ddd'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Ionicons name="ellipsis-vertical" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Three Dots Modal Menu */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.modalMenu}>
            {/* Edit Option */}
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleEditCar}
            >
              <Ionicons name="create-outline" size={22} color="#007AFF" />
              <Text style={styles.menuItemText}>Edit Car Details</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            {/* Delete Option */}
            <TouchableOpacity 
              style={[styles.menuItem, styles.deleteMenuItem]} 
              onPress={handleDeleteCar}
            >
              <Ionicons name="trash-outline" size={22} color="#FF3B30" />
              <Text style={[styles.menuItemText, styles.deleteText]}>Delete Car</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 🚗 IMAGE */}
      <Image
        source={{ uri: carData.image }}
        style={styles.carImage}
      />

      {/* ❤️ Recommended Badge */}
      {carData.recomended && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Recommended</Text>
        </View>
      )}

      {/* 📌 BASIC INFO */}
      <View style={styles.infoContainer}>
        <Text style={styles.carName}>{carData.name}</Text>
        <Text style={styles.price}>PKR {carData.price}</Text>
        <Text style={styles.category}>{carData.category}</Text>
      </View>

      {/* ⚙️ SPECIFICATIONS */}
      <View style={styles.specBox}>
        <Text style={styles.sectionTitle}>Specifications</Text>
        <Text style={styles.specText}>Condition: {carData.condition}</Text>
        <Text style={styles.specText}>Fuel Type: {carData.fuelType}</Text>
        <Text style={styles.specText}>Transmission: {carData.transmission}</Text>
        <Text style={styles.specText}>Mileage: {carData.mileage}</Text>
        <Text style={styles.specText}>Engine: {carData.engineCapacity}</Text>
        <Text style={styles.specText}>Year: {carData.year}</Text>
      </View>

      {/* 📝 DESCRIPTION */}
      <View style={styles.descriptionBox}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{carData.description}</Text>
      </View>

      {/* 📞 CONTACT BUTTON */}
      <TouchableOpacity
        style={styles.contactButton}
        onPress={() => {
          if (carData.userId) {
            router.push({
              pathname: '/chat',
              params: {
                carId: carData.id,
                carName: carData.name,
                sellerId: carData.userId,
              },
            });
          } else {
            Alert.alert('Error', 'Seller information not available');
          }
        }}
      >
        <Text style={styles.contactText}>Contact Seller</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}