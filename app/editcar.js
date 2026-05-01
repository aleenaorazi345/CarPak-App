import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { uploadToCloudinary } from '../services/cloudinary';

export default function EditCar() {
  const router = useRouter();
  const { car } = useLocalSearchParams();
  const carData = car ? JSON.parse(car) : null;
  const db = getFirestore();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(carData?.name || '');
  const [price, setPrice] = useState(carData?.price?.toString() || '');
  const [category, setCategory] = useState(carData?.category || 'Hatchback');
  const [condition, setCondition] = useState(carData?.condition || 'Used');
  const [fuelType, setFuelType] = useState(carData?.fuelType || 'Petrol');
  const [transmission, setTransmission] = useState(carData?.transmission || 'Automatic');
  const [year, setYear] = useState(carData?.year?.toString() || '');
  const [mileage, setMileage] = useState(carData?.mileage || '');
  const [engineCapacity, setEngineCapacity] = useState(carData?.engineCapacity || '');
  const [description, setDescription] = useState(carData?.description || '');
  const [image, setImage] = useState(carData?.image || null);
  const [uploadingImage, setUploadingImage] = useState(false);

  if (!carData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No car data found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: '#F4B400', marginTop: 20 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Radio Button Component
  const Radio = ({ options, selected, setSelected }) => {
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 25,
              backgroundColor: selected === opt ? '#F4B400' : '#f5f5f5',
              marginRight: 12,
              marginBottom: 8,
              borderWidth: 1,
              borderColor: selected === opt ? '#F4B400' : '#e0e0e0',
            }}
            onPress={() => setSelected(opt)}
          >
            <Text style={{
              fontSize: 14,
              color: selected === opt ? '#fff' : '#666',
              fontWeight: selected === opt ? '600' : '400',
            }}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Pick new image
  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need permission to access your photo library.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setUploadingImage(true);
        const imageUri = result.assets[0].uri;
        const imageUrl = await uploadToCloudinary(imageUri);
        setImage(imageUrl);
        setUploadingImage(false);
        Alert.alert('Success', 'Image uploaded successfully');
      }
    } catch (error) {
      console.error('Image pick error:', error);
      Alert.alert('Error', 'Failed to pick image');
      setUploadingImage(false);
    }
  };

  // Update car in Firestore
  const handleUpdateCar = async () => {
    if (!name || !price) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const carRef = doc(db, 'Cars', carData.id);
      
      await updateDoc(carRef, {
        name,
        price: Number(price),
        category,
        condition,
        fuelType,
        transmission,
        year: Number(year),
        mileage,
        engineCapacity,
        description,
        image,
        updatedAt: new Date().toISOString(),
      });

      Alert.alert(
        'Success', 
        'Car updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', 'Failed to update car');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
      }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#F4B400' }}>Edit Car</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Image Section */}
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#F4B400', marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#F4B400', paddingLeft: 10 }}>
          Car Image
        </Text>
        <TouchableOpacity 
          style={{
            width: '100%',
            height: 200,
            backgroundColor: '#f5f5f5',
            borderRadius: 12,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
          }} 
          onPress={handlePickImage}
        >
          {uploadingImage ? (
            <ActivityIndicator size="large" color="#F4B400" />
          ) : image ? (
            <Image source={{ uri: image }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
          ) : (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="camera" size={50} color="#999" />
              <Text style={{ marginTop: 10, color: '#999', fontSize: 14 }}>Tap to change image</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Basic Information */}
      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#F4B400', marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#F4B400', paddingLeft: 10 }}>
          Basic Information
        </Text>
        
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 10 }}>Car Name *</Text>
        <TextInput
          style={{
            backgroundColor: '#f5f5f5',
            borderRadius: 10,
            padding: 14,
            fontSize: 16,
            color: '#333',
            borderWidth: 1,
            borderColor: '#e0e0e0',
            marginBottom: 12,
          }}
          value={name}
          onChangeText={setName}
          placeholder="e.g., Honda Civic"
          placeholderTextColor="#999"
        />

        <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 10 }}>Price *</Text>
        <TextInput
          style={{
            backgroundColor: '#f5f5f5',
            borderRadius: 10,
            padding: 14,
            fontSize: 16,
            color: '#333',
            borderWidth: 1,
            borderColor: '#e0e0e0',
            marginBottom: 12,
          }}
          value={price}
          onChangeText={setPrice}
          placeholder="e.g., 2800000"
          keyboardType="numeric"
          placeholderTextColor="#999"
        />
      </View>

      {/* Category */}
      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#F4B400', marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#F4B400', paddingLeft: 10 }}>
          Category
        </Text>
        <Radio
          options={['Hatchback', 'Sedan', 'SUV']}
          selected={category}
          setSelected={setCategory}
        />
      </View>

      {/* Condition */}
      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#F4B400', marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#F4B400', paddingLeft: 10 }}>
          Condition
        </Text>
        <Radio
          options={['New', 'Used']}
          selected={condition}
          setSelected={setCondition}
        />
      </View>

      {/* Fuel Type */}
      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#F4B400', marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#F4B400', paddingLeft: 10 }}>
          Fuel Type
        </Text>
        <Radio
          options={['Petrol', 'Diesel', 'Hybrid', 'Electric']}
          selected={fuelType}
          setSelected={setFuelType}
        />
      </View>

      {/* Transmission */}
      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#F4B400', marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#F4B400', paddingLeft: 10 }}>
          Transmission
        </Text>
        <Radio
          options={['Automatic', 'Manual']}
          selected={transmission}
          setSelected={setTransmission}
        />
      </View>

      {/* Additional Details */}
      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#F4B400', marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#F4B400', paddingLeft: 10 }}>
          Additional Details
        </Text>

        <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 10 }}>Year</Text>
        <TextInput
          style={{
            backgroundColor: '#f5f5f5',
            borderRadius: 10,
            padding: 14,
            fontSize: 16,
            color: '#333',
            borderWidth: 1,
            borderColor: '#e0e0e0',
            marginBottom: 12,
          }}
          value={year}
          onChangeText={setYear}
          placeholder="e.g., 2022"
          keyboardType="numeric"
          placeholderTextColor="#999"
        />

        <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 10 }}>Mileage</Text>
        <TextInput
          style={{
            backgroundColor: '#f5f5f5',
            borderRadius: 10,
            padding: 14,
            fontSize: 16,
            color: '#333',
            borderWidth: 1,
            borderColor: '#e0e0e0',
            marginBottom: 12,
          }}
          value={mileage}
          onChangeText={setMileage}
          placeholder="e.g., 50000 km"
          placeholderTextColor="#999"
        />

        <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 10 }}>Engine Capacity</Text>
        <TextInput
          style={{
            backgroundColor: '#f5f5f5',
            borderRadius: 10,
            padding: 14,
            fontSize: 16,
            color: '#333',
            borderWidth: 1,
            borderColor: '#e0e0e0',
            marginBottom: 12,
          }}
          value={engineCapacity}
          onChangeText={setEngineCapacity}
          placeholder="e.g., 1800cc"
          placeholderTextColor="#999"
        />

        <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 10 }}>Description</Text>
        <TextInput
          style={{
            backgroundColor: '#f5f5f5',
            borderRadius: 10,
            padding: 14,
            fontSize: 16,
            color: '#333',
            borderWidth: 1,
            borderColor: '#e0e0e0',
            marginBottom: 12,
            height: 100,
            textAlignVertical: 'top',
          }}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the car..."
          multiline
          numberOfLines={4}
          placeholderTextColor="#999"
        />
      </View>

      {/* Update Button */}
      <TouchableOpacity
        style={{
          backgroundColor: '#F4B400',
          marginHorizontal: 20,
          marginVertical: 30,
          paddingVertical: 16,
          borderRadius: 12,
          alignItems: 'center',
          shadowColor: '#F4B400',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 4,
          opacity: loading ? 0.6 : 1,
        }}
        onPress={handleUpdateCar}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>Update Car 🚗</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}