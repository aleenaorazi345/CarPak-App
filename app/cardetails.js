import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import styles from '../styles/carDetails.config';

export default function CarDetails() {
  const router = useRouter();
  const { car } = useLocalSearchParams();

  const carData = car ? JSON.parse(car) : null;

  if (!carData) {
    return (
      <View style={styles.container}>
        <Text>No car data found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      {/* 🔙 HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Car Details</Text>

        <View style={{ width: 24 }} />
      </View>

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

        <Text style={styles.specText}>
           Condition: {carData.condition}
        </Text>

        <Text style={styles.specText}>
           Fuel Type: {carData.fuelType}
        </Text>

        <Text style={styles.specText}>
           Transmission: {carData.transmission}
        </Text>

        <Text style={styles.specText}>
           Mileage: {carData.mileage}
        </Text>

        <Text style={styles.specText}>
           Engine: {carData.engineCapacity}
        </Text>

        <Text style={styles.specText}>
           Year: {carData.year}
        </Text>

      </View>

      {/* 📝 DESCRIPTION */}
      <View style={styles.descriptionBox}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          {carData.description}
        </Text>
      </View>

      {/* 📞 CONTACT BUTTON */}
      <TouchableOpacity style={styles.contactButton}>
        <Text style={styles.contactText}>Contact Seller</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}