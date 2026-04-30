import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { getUserFavorites, removeFromFavorites } from '../../services';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },

  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#F4B400',
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
  },

  contentContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 12,
    textAlign: 'center',
  },

  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },

  carCard: {
    backgroundColor: '#1a2540',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderLeftWidth: 4,
    borderLeftColor: '#F4B400',
  },

  carImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#0f172a',
  },

  carDetails: {
    padding: 16,
  },

  carName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },

  carInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  infoItem: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 13,
    color: '#F4B400',
    fontWeight: 'bold',
  },

  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F4B400',
  },

  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },

  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },

  contactButton: {
    backgroundColor: '#4CAF50',
  },

  removeButton: {
    backgroundColor: '#d32f2f',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 14,
  },
});

export default function Favorites({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const data = await getUserFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      Alert.alert('Error', 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (carId) => {
    try {
      Alert.alert('Remove Favorite', 'Are you sure you want to remove this car from favorites?', [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: async () => {
            try {
              await removeFromFavorites(carId);
              setFavorites(favorites.filter(car => car.id !== carId));
              Alert.alert('Success', 'Removed from favorites');
            } catch (error) {
              Alert.alert('Error', 'Failed to remove from favorites');
            }
          },
          style: 'destructive',
        },
      ]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleContact = (carSellerId, carName) => {
    // Navigate to messages with the seller
    navigation.navigate('Messages', {
      sellerId: carSellerId,
      sellerName: carName,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFavorites();
    setRefreshing(false);
  };

  const renderCarCard = ({ item }) => (
    <View style={styles.carCard}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.carImage} />
      ) : (
        <View style={[styles.carImage, { justifyContent: 'center', alignItems: 'center' }]}>
          <Ionicons name="car" size={60} color="#F4B400" />
        </View>
      )}
      <View style={styles.carDetails}>
        <Text style={styles.carName}>{item.name || 'Unknown Car'}</Text>

        <View style={styles.carInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Year</Text>
            <Text style={styles.infoValue}>{item.year || 'N/A'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Mileage</Text>
            <Text style={styles.infoValue}>{item.mileage || 'N/A'} km</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Transmission</Text>
            <Text style={styles.infoValue}>{item.transmission || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.priceSection}>
          <Text style={styles.price}>PKR {item.price || '0'}</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.contactButton]}
            onPress={() => handleContact(item.sellerId, item.name)}
          >
            <Ionicons name="chatbubble" size={14} color="#fff" />
            <Text style={styles.buttonText}>Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.removeButton]}
            onPress={() => handleRemoveFavorite(item.id)}
          >
            <Ionicons name="trash" size={14} color="#fff" />
            <Text style={styles.buttonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F4B400" />
        <Text style={styles.loadingText}>Loading Favorites...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>❤️ My Favorites</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={60} color="#F4B400" />
          <Text style={styles.emptyText}>No Favorites Yet</Text>
          <Text style={styles.emptySubtext}>
            Add cars to your favorites to see them here
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderCarCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.contentContainer}
          refreshing={refreshing}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}