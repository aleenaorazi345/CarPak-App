import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../../firebase/config';

import styles from '../../styles/homeStyles.config';
import NavigationDrawer from '../navigationdrawer';
import NotificationIcon from '../notificationicon';

export default function HomeScreen({ navigation }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cars, setCars] = useState([]);
  const router = useRouter();
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const goToNotifications = () => {
    navigation.navigate('Notifications');
  };

  // 🔥 FETCH CARS FROM FIRESTORE
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'Cars'));

        const carList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCars(carList);
      } catch (error) {
        console.log('Error fetching cars:', error);
      }
    };

    fetchCars();
  }, []);

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleDrawer}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>CarPak</Text>

        <NotificationIcon onPress={goToNotifications} />
      </View>

      {/* DRAWER */}
      {drawerOpen && (
        <NavigationDrawer
          onClose={() => setDrawerOpen(false)}
          navigation={navigation}
        />
      )}

      <ScrollView showsVerticalScrollIndicator={false}>

      {/* 🟡 BUDGET CATEGORY */}
<Text style={styles.sectionTitle}>Budget Category</Text>

<View style={styles.budgetContainer}>
  <TouchableOpacity style={styles.budgetPillInactive}>
    <Text>Under 30k</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.budgetPillActive}>
    <Text style={{ color: '#fff' }}>From $40k–90k</Text>
  </TouchableOpacity>
</View>

{/* 🚗 RECOMMENDATION */}
<View style={styles.rowBetween}>
  <Text style={styles.sectionTitle}>Recommendation For You</Text>
  <Text style={styles.viewAll}>View all</Text>
</View>

<FlatList
  data={cars}
  horizontal
  showsHorizontalScrollIndicator={false}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: '/cardetails',
          params: { car: JSON.stringify(item) },
        })
      }
    >

      {/* IMAGE */}
      <View style={styles.imageWrapper}>
        {item.image && (
          <Image
            source={{ uri: item.image }}
            style={styles.image}
          />
        )}

        {/* ❤️ Heart */}
        <Text style={styles.heart}>❤</Text>
      </View>

      {/* DETAILS */}
      <Text style={styles.carName}>{item.name}</Text>
      <Text style={styles.carSub}>
        Auto • {item.category}
      </Text>
      <Text style={styles.price}>{item.price}</Text>

    </TouchableOpacity>
  )}
/>
{/* 🚘 FOR YOU (VERTICAL LIST) */}
<Text style={styles.sectionTitle}>For You</Text>
<FlatList
  data={cars}
  keyExtractor={(item) => item.id}
  scrollEnabled={false} // important (inside ScrollView)
  renderItem={({ item }) => (
    
    <TouchableOpacity
      style={styles.verticalCard}
      onPress={() =>
        router.push({
          pathname: '/cardetails',
          params: { car: JSON.stringify(item) },
        })
      }
    >

      {/* IMAGE */}
      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={styles.verticalImage}
        />
      )}

      {/* DETAILS */}
      <View style={styles.verticalContent}>
        <Text style={styles.carName}>{item.name}</Text>
        <Text style={styles.carSub}>
          Auto • {item.category}
        </Text>
        <Text style={styles.price}>{item.price}</Text>
      </View>

      {/* ❤️ */}
      <Text style={styles.verticalHeart}>❤</Text>

    </TouchableOpacity>
  )}
/>

{/* 🎁 DISCOUNT BOX */}
<View style={styles.discountBox}>
  <Text style={styles.discountText}>Get discount in 50%</Text>
</View>
      </ScrollView>
    </View>
  );
}