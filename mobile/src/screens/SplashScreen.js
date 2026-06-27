import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Text,
  SafeAreaView,
} from 'react-native';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    // Logo scale and fade in
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to home after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 3500);

    return () => clearTimeout(timer);
  }, [scaleAnim, opacityAnim, slideAnim, navigation]);

  return (
    <LinearGradient
      colors={['#FF6B35', '#FF8C42', '#FF8C42']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Logo with animation */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              },
            ]}
          >
            {/* Lottie animation - delivery truck */}
            <LottieView
              source={require('../animations/lottie/delivery-truck.json')}
              autoPlay
              loop={false}
              style={styles.lottie}
            />
          </Animated.View>

          {/* App name with slide animation */}
          <Animated.View
            style={[
              styles.textContainer,
              {
                transform: [{ translateY: slideAnim }],
                opacity: opacityAnim,
              },
            ]}
          >
            <Text style={styles.appName}>Africart</Text>
            <Text style={styles.tagline}>30-Minute Delivery</Text>
          </Animated.View>

          {/* Pulsing dots */}
          <View style={styles.dotsContainer}>
            <Animated.View
              style={[
                styles.dot,
                {
                  opacity: Animated.loop(
                    Animated.sequence([
                      Animated.timing(
                        new Animated.Value(0.3),
                        {
                          toValue: 1,
                          duration: 500,
                          useNativeDriver: true,
                        }
                      ),
                      Animated.timing(
                        new Animated.Value(1),
                        {
                          toValue: 0.3,
                          duration: 500,
                          useNativeDriver: true,
                        }
                      ),
                    ])
                  ),
                },
              ]}
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  lottie: {
    width: 200,
    height: 200,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    letterSpacing: 1,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 6,
  },
});

export default SplashScreen;
