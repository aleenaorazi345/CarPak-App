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
  const [allCars, setAllCars] = useState([]); // Store all cars
  const [filteredCars, setFilteredCars] = useState([]); // Store filtered cars
  const [selectedBudget, setSelectedBudget] = useState('all'); // Track selected budget
  const router = useRouter();

  // 🔥 FETCH CARS FROM FIRESTORE
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'Cars'));
        const carList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllCars(carList);
        setFilteredCars(carList); // Initially show all cars
      } catch (error) {
        console.log('Error fetching cars:', error);
      }
    };
    
    fetchCars();
  }, []);

  // Function to filter cars by budget
  const filterCarsByBudget = (budget) => {
    setSelectedBudget(budget);
    
    if (budget === 'all') {
      setFilteredCars(allCars);
      return;
    }
    
    const filtered = allCars.filter(car => {
      // Extract numeric value from price string (remove $ and commas)
      const priceString = car.price?.toString().replace(/[$,]/g, '') || '0';
      const priceNum = parseInt(priceString);
      
      switch(budget) {
        case 'under20k':
          return priceNum < 20000;
        case '20kTo30k':
          return priceNum >= 20000 && priceNum < 30000;
        case '30kTo40k':
          return priceNum >= 30000 && priceNum < 40000;
        case '40kTo60k':
          return priceNum >= 40000 && priceNum < 60000;
        case '60kTo90k':
          return priceNum >= 60000 && priceNum <= 90000;
        case 'over90k':
          return priceNum > 90000;
        default:
          return true;
      }
    });
    
    setFilteredCars(filtered);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const goToNotifications = () => {
    navigation.navigate('Notifications');
  };

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
        {/* BUDGET CATEGORY - WITH MORE RANGES */}
        <Text style={styles.sectionTitle}>Budget Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.budgetScrollView}>
          <View style={styles.budgetContainer}>
            <TouchableOpacity 
              style={selectedBudget === 'all' ? styles.budgetPillActive : styles.budgetPillInactive}
              onPress={() => filterCarsByBudget('all')}
            >
              <Text style={selectedBudget === 'all' ? styles.activeText : styles.inactiveText}>All</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={selectedBudget === 'under20k' ? styles.budgetPillActive : styles.budgetPillInactive}
              onPress={() => filterCarsByBudget('under20k')}
            >
              <Text style={selectedBudget === 'under20k' ? styles.activeText : styles.inactiveText}>$0 - $20k</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={selectedBudget === '20kTo30k' ? styles.budgetPillActive : styles.budgetPillInactive}
              onPress={() => filterCarsByBudget('20kTo30k')}
            >
              <Text style={selectedBudget === '20kTo30k' ? styles.activeText : styles.inactiveText}>$20k - $30k</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={selectedBudget === '30kTo40k' ? styles.budgetPillActive : styles.budgetPillInactive}
              onPress={() => filterCarsByBudget('30kTo40k')}
            >
              <Text style={selectedBudget === '30kTo40k' ? styles.activeText : styles.inactiveText}>$30k - $40k</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={selectedBudget === '40kTo60k' ? styles.budgetPillActive : styles.budgetPillInactive}
              onPress={() => filterCarsByBudget('40kTo60k')}
            >
              <Text style={selectedBudget === '40kTo60k' ? styles.activeText : styles.inactiveText}>$40k - $60k</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={selectedBudget === '60kTo90k' ? styles.budgetPillActive : styles.budgetPillInactive}
              onPress={() => filterCarsByBudget('60kTo90k')}
            >
              <Text style={selectedBudget === '60kTo90k' ? styles.activeText : styles.inactiveText}>$60k - $90k</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={selectedBudget === 'over90k' ? styles.budgetPillActive : styles.budgetPillInactive}
              onPress={() => filterCarsByBudget('over90k')}
            >
              <Text style={selectedBudget === 'over90k' ? styles.activeText : styles.inactiveText}>$90k+</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Show result count */}
        <Text style={styles.resultCount}>{filteredCars.length} cars found</Text>

        {/* RECOMMENDATION - USING FILTERED CARS */}
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Recommendation For You</Text>
          <Text style={styles.viewAll}>View all</Text>
        </View>

        {filteredCars.length > 0 ? (
          <FlatList
            data={filteredCars}
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
                <View style={styles.imageWrapper}>
                  {item.image && (
                    <Image source={{ uri: item.image }} style={styles.image} />
                  )}
                  <Text style={styles.heart}>❤</Text>
                </View>
                <Text style={styles.carName}>{item.name}</Text>
                <Text style={styles.carSub}>Auto • {item.category}</Text>
                <Text style={styles.price}>{item.price}</Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No cars found in this budget range</Text>
          </View>
        )}

        {/* FOR YOU - VERTICAL LIST USING FILTERED CARS */}
        <Text style={styles.sectionTitle}>For You</Text>
        {filteredCars.length > 0 ? (
          <FlatList
            data={filteredCars}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
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
                {item.image && (
                  <Image source={{ uri: item.image }} style={styles.verticalImage} />
                )}
                <View style={styles.verticalContent}>
                  <Text style={styles.carName}>{item.name}</Text>
                  <Text style={styles.carSub}>Auto • {item.category}</Text>
                  <Text style={styles.price}>{item.price}</Text>
                </View>
                <Text style={styles.verticalHeart}>❤</Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No cars found</Text>
          </View>
        )}

        {/* DISCOUNT BOX */}
        <View style={styles.discountBox}>
          <Text style={styles.discountText}>Get discount in 50%</Text>
        </View>
      </ScrollView>
    </View>
  );
}