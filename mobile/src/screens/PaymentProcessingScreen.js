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

const PaymentProcessingScreen = ({ route, navigation }) => {
  const { orderId, amount } = route.params;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startLoadingAnimation();
    // Simulate processing time
    const timer = setTimeout(() => {
      // After 3-5 seconds, navigate to success or failed screen
      navigation.replace('PaymentSuccess', { orderId, amount });
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const startLoadingAnimation = () => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 360,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={['#FF6B35', '#FF8C42']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Loading Animation */}
          <Animated.View
            style={[
              styles.processingContainer,
              {
                transform: [
                  { scale: scaleAnim },
                  { rotate: rotateInterpolate },
                ],
              },
            ]}
          >
            <LottieView
              source={require('../animations/lottie/processing.json')}
              autoPlay
              loop
              style={styles.lottieProcessing}
            />
          </Animated.View>

          {/* Processing Text */}
          <Text style={styles.processingTitle}>Processing Payment</Text>
          <Text style={styles.processingSubtitle}>
            Please don't close this screen
          </Text>

          {/* Order Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Order Total</Text>
            <Text style={styles.summaryAmount}>KES {amount.toLocaleString()}</Text>
            <Text style={styles.orderId}>Order #{orderId}</Text>
          </View>

          {/* Loading Dots */}
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
                          duration: 600,
                          useNativeDriver: true,
                        }
                      ),
                      Animated.timing(
                        new Animated.Value(1),
                        {
                          toValue: 0.3,
                          duration: 600,
                          useNativeDriver: true,
                        }
                      ),
                    ])
                  ),
                },
              ]}
            />
            <Animated.View
              style={[
                styles.dot,
                styles.dot2,
                {
                  opacity: Animated.loop(
                    Animated.sequence([
                      Animated.delay(
                        Animated.sequence([
                          Animated.timing(
                            new Animated.Value(0.3),
                            {
                              toValue: 1,
                              duration: 600,
                              useNativeDriver: true,
                            }
                          ),
                          Animated.timing(
                            new Animated.Value(1),
                            {
                              toValue: 0.3,
                              duration: 600,
                              useNativeDriver: true,
                            }
                          ),
                        ]),
                        200
                      ),
                    ])
                  ),
                },
              ]}
            />
            <Animated.View
              style={[
                styles.dot,
                styles.dot3,
                {
                  opacity: Animated.loop(
                    Animated.sequence([
                      Animated.delay(
                        Animated.sequence([
                          Animated.timing(
                            new Animated.Value(0.3),
                            {
                              toValue: 1,
                              duration: 600,
                              useNativeDriver: true,
                            }
                          ),
                          Animated.timing(
                            new Animated.Value(1),
                            {
                              toValue: 0.3,
                              duration: 600,
                              useNativeDriver: true,
                            }
                          ),
                        ]),
                        400
                      ),
                    ])
                  ),
                },
              ]}
            />
          </View>

          {/* Info */}
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              🔒 Your payment is secure and encrypted
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  processingContainer: {
    marginBottom: 30,
  },
  lottieProcessing: {
    width: 200,
    height: 200,
  },
  processingTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  processingSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 30,
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  summaryLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
    marginHorizontal: 6,
  },
  dot2: {
    marginLeft: 6,
  },
  dot3: {
    marginLeft: 6,
  },
  infoCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  infoText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default PaymentProcessingScreen;
