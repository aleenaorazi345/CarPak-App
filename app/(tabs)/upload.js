import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { db } from '../../firebase/config';
import { uploadToCloudinary } from '../../services/cloudinary';
import { pickImage } from '../../services/imagePicker';
import { uploadStyles as styles } from '../../styles/uploadStyles';

export default function Upload() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [engineCapacity, setEngineCapacity] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Radio states
  const [category, setCategory] = useState('Hatchback');
  const [condition, setCondition] = useState('Used');
  const [fuelType, setFuelType] = useState('Petrol');
  const [transmission, setTransmission] = useState('Automatic');

  // Radio component
  const Radio = ({ options, selected, setSelected }) => {
    return (
      <View style={styles.radioRow}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[
              styles.radioBtn,
              selected === opt && styles.radioSelected
            ]}
            onPress={() => setSelected(opt)}
          >
            <Text style={[
              styles.radioText,
              selected === opt && styles.radioTextSelected
            ]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const saveCarToFirebase = async (imageUrl) => {
    try {
      await addDoc(collection(db, "Cars"), {
        name,
        price: Number(price),
        category,
        condition,
        year: Number(year),
        fuelType,
        transmission,
        mileage,
        engineCapacity,
        description,
        image: imageUrl,
        recomended: true,
        userId: "hpktHEqmiYAcqPw91dwv",
        createdAt: serverTimestamp(),
      });
      Alert.alert("Success", "Car posted successfully 🚗");
      // Reset form after successful upload
      resetForm();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Upload failed");
    }
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setYear('');
    setMileage('');
    setEngineCapacity('');
    setDescription('');
    setImage(null);
    setCategory('Hatchback');
    setCondition('Used');
    setFuelType('Petrol');
    setTransmission('Automatic');
  };

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) setImage(uri);
  };

  const handlePostCar = async () => {
    if (!name || !price || !image) {
      Alert.alert("Error", "Please fill all required fields and add an image");
      return;
    }

    setLoading(true);

    try {
      const imageUrl = await uploadToCloudinary(image);
      if (imageUrl) {
        await saveCarToFirebase(imageUrl);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Post your Car at Carpak</Text>
            <Text style={styles.subtitle}>List your car for sale</Text>
          </View>

          {/* Basic Information Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <TextInput
              placeholder="Car Name (e.g., Honda Civic)"
              placeholderTextColor="#999"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />

            <TextInput
              placeholder="Price (e.g., 2800000)"
              placeholderTextColor="#999"
              keyboardType="numeric"
              style={styles.input}
              value={price}
              onChangeText={setPrice}
            />
          </View>

          {/* Car Specifications Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Car Specifications</Text>

            <Text style={styles.label}>Category</Text>
            <Radio
              options={['Hatchback', 'Sedan', 'SUV']}
              selected={category}
              setSelected={setCategory}
            />

            <Text style={styles.label}>Condition</Text>
            <Radio
              options={['New', 'Used']}
              selected={condition}
              setSelected={setCondition}
            />

            <Text style={styles.label}>Fuel Type</Text>
            <Radio
              options={['Petrol', 'Diesel', 'Hybrid']}
              selected={fuelType}
              setSelected={setFuelType}
            />

            <Text style={styles.label}>Transmission</Text>
            <Radio
              options={['Automatic', 'Manual']}
              selected={transmission}
              setSelected={setTransmission}
            />
          </View>

          {/* Additional Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Details</Text>

            <TextInput
              placeholder="Year (e.g., 2022)"
              placeholderTextColor="#999"
              style={styles.input}
              keyboardType="numeric"
              value={year}
              onChangeText={setYear}
            />

            <TextInput
              placeholder="Mileage (e.g., 50000 km)"
              placeholderTextColor="#999"
              style={styles.input}
              value={mileage}
              onChangeText={setMileage}
            />

            <TextInput
              placeholder="Engine Capacity (e.g., 1800cc)"
              placeholderTextColor="#999"
              style={styles.input}
              value={engineCapacity}
              onChangeText={setEngineCapacity}
            />

            <TextInput
              placeholder="Description"
              placeholderTextColor="#999"
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Image Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Car Image</Text>
            
            <TouchableOpacity 
              style={styles.imagePickerButton} 
              onPress={handlePickImage}
            >
              <Text style={styles.imagePickerText}>
                {image ? '📸 Change Image' : '📸 Pick an Image'}
              </Text>
            </TouchableOpacity>

            {image && (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: image }} style={styles.imagePreview} />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => setImage(null)}
                >
                  <Text style={styles.removeImageText}>✕ Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Post Button */}
          <TouchableOpacity 
            style={[styles.postButton, loading && styles.postButtonDisabled]} 
            onPress={handlePostCar}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.postButtonText}>POST CAR</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}