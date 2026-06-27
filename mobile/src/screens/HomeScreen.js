import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const categories = [
    { id: 1, name: 'Medicines', icon: 'hospital-box', color: '#FF6B35' },
    { id: 2, name: 'Food', icon: 'food', color: '#FF8C42' },
    { id: 3, name: 'Cosmetics', icon: 'palette', color: '#FFA500' },
    { id: 4, name: 'Electronics', icon: 'laptop', color: '#FFB84D' },
    { id: 5, name: 'Groceries', icon: 'basket', color: '#FF6B35' },
    { id: 6, name: 'More', icon: 'plus', color: '#FF8C42' },
  ];

  const renderCategoryCard = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => navigation.navigate('Products', { category: item.name })}
    >
      <LinearGradient
        colors={[item.color, item.color + 'CC']}
        style={styles.categoryGradient}
      >
        <Icon name={item.icon} size={40} color="white" />
        <Text style={styles.categoryName}>{item.name}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['#FF6B35', '#FF8C42']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <Text style={styles.greeting}>Welcome Back! 👋</Text>
              <Text style={styles.subGreeting}>Get your essentials in 30 minutes</Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <Icon name="account-circle" size={40} color="white" />
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        {/* Promo Banner */}
        <Animated.View
          style={[
            styles.promoBanner,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['#FFB84D', '#FFA500']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bannerGradient}
          >
            <View>
              <Text style={styles.bannerTitle}>🎉 Special Offer</Text>
              <Text style={styles.bannerDesc}>Get 30% off on your first order</Text>
            </View>
            <TouchableOpacity style={styles.claimButton}>
              <Text style={styles.claimText}>Claim</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        {/* Quick Search */}
        <Animated.View
          style={[
            styles.searchSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity style={styles.searchBox}>
            <Icon name="magnify" size={24} color="#999" />
            <Text style={styles.searchPlaceholder}>Search products...</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Categories */}
        <Animated.View
          style={[
            styles.categoriesSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <FlatList
            data={categories}
            renderItem={renderCategoryCard}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            scrollEnabled={false}
            columnWrapperStyle={styles.categoryRow}
          />
        </Animated.View>

        {/* Recent Orders */}
        <Animated.View
          style={[
            styles.recentSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <TouchableOpacity style={styles.emptyState}>
            <Icon name="package-variant" size={48} color="#DDD" />
            <Text style={styles.emptyText}>No orders yet</Text>
            <Text style={styles.emptySubtext}>Start shopping to see your orders here</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    marginBottom: 16,
  },
  headerGradient: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  profileButton: {
    marginLeft: 16,
  },
  promoBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bannerGradient: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  bannerDesc: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  claimButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  claimText: {
    color: 'white',
    fontWeight: 'bold',
  },
  searchSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  searchBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchPlaceholder: {
    marginLeft: 12,
    fontSize: 16,
    color: '#999',
  },
  categoriesSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  categoryRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryCard: {
    width: (width - 48) / 3,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
  },
  categoryGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  recentSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default HomeScreen;
