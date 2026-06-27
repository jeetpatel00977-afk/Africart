import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

const PaymentSuccessScreen = ({ route, navigation }) => {
  const { orderId, amount, paymentMethod } = route.params;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(100)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const confettiAnims = useRef(
    Array(20)
      .fill(null)
      .map(() => ({
        xAnim: new Animated.Value(0),
        yAnim: new Animated.Value(0),
        opacityAnim: new Animated.Value(1),
      }))
  ).current;

  useEffect(() => {
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Success checkmark scale and rotate
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 0.95,
          friction: 5,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(rotateAnim, {
        toValue: 360,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Confetti animation
    setTimeout(() => {
      startConfettiAnimation();
    }, 300);
  };

  const startConfettiAnimation = () => {
    confettiAnims.forEach((conf, index) => {
      const randomX = Math.random() * 200 - 100;
      const randomDuration = Math.random() * 1500 + 1500;
      const delay = Math.random() * 200;

      setTimeout(() => {
        Animated.parallel([
          Animated.timing(conf.yAnim, {
            toValue: height,
            duration: randomDuration,
            useNativeDriver: true,
          }),
          Animated.timing(conf.xAnim, {
            toValue: randomX,
            duration: randomDuration,
            useNativeDriver: true,
          }),
          Animated.timing(conf.opacityAnim, {
            toValue: 0,
            duration: randomDuration,
            useNativeDriver: true,
          }),
        ]).start();
      }, delay);
    });
  };

  const handleContinue = () => {
    navigation.replace('OrderTracking', { orderId });
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
        {/* Confetti */}
        {confettiAnims.map((conf, index) => (
          <Animated.View
            key={index}
            style={[
              styles.confetti,
              {
                transform: [
                  { translateX: conf.xAnim },
                  { translateY: conf.yAnim },
                ],
                opacity: conf.opacityAnim,
              },
            ]}
          >
            <Icon
              name={index % 2 === 0 ? 'gift' : 'star'}
              size={20}
              color={index % 3 === 0 ? '#FFD700' : index % 3 === 1 ? '#FF6B35' : '#FF8C42'}
            />
          </Animated.View>
        ))}

        <View style={styles.content}>
          {/* Success Checkmark with Circle Background */}
          <Animated.View
            style={[
              styles.successContainer,
              {
                transform: [{ scale: scaleAnim }, { rotate: rotateInterpolate }],
                opacity: opacityAnim,
              },
            ]}
          >
            <View style={styles.circleBackground}>
              <LottieView
                source={require('../animations/lottie/success-checkmark.json')}
                autoPlay
                loop={false}
                style={styles.lottieCheckmark}
              />
            </View>
          </Animated.View>

          {/* Success Message */}
          <Animated.View
            style={[
              styles.messageContainer,
              {
                opacity: opacityAnim,
                transform: [{ translateY: slideUpAnim }],
              },
            ]}
          >
            <Text style={styles.successTitle}>Payment Successful!</Text>
            <Text style={styles.successSubtitle}>Your order has been confirmed</Text>
          </Animated.View>

          {/* Order Details */}
          <Animated.View
            style={[
              styles.detailsCard,
              {
                opacity: opacityAnim,
                transform: [{ translateY: slideUpAnim }],
              },
            ]}
          >
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Order ID</Text>
              <Text style={styles.detailValue}>#{orderId}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount Paid</Text>
              <Text style={styles.detailValue}>KES {amount.toLocaleString()}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Method</Text>
              <View style={styles.methodBadge}>
                <Icon
                  name={
                    paymentMethod === 'mpesa'
                      ? 'mobile-payment'
                      : paymentMethod === 'stripe'
                      ? 'credit-card'
                      : 'wallet-travel'
                  }
                  size={16}
                  color="#FF6B35"
                />
                <Text style={styles.methodText}>
                  {paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Delivery Info */}
          <Animated.View
            style={[
              styles.deliveryInfo,
              {
                opacity: opacityAnim,
                transform: [{ translateY: slideUpAnim }],
              },
            ]}
          >
            <Icon name="truck-fast" size={32} color="white" />
            <Text style={styles.deliveryTitle}>30-Minute Delivery</Text>
            <Text style={styles.deliveryText}>Your order will arrive in 30 minutes</Text>
          </Animated.View>
        </View>

        {/* Continue Button */}
        <Animated.View
          style={[
            styles.footer,
            {
              opacity: opacityAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Track Your Order</Text>
            <Icon name="arrow-right" size={20} color="#FF6B35" />
          </TouchableOpacity>
        </Animated.View>
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
  confetti: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  successContainer: {
    marginBottom: 30,
  },
  circleBackground: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  lottieCheckmark: {
    width: 120,
    height: 120,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  detailsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  methodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  methodText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '600',
  },
  deliveryInfo: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  deliveryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
    marginBottom: 4,
  },
  deliveryText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    width: '100%',
  },
  continueButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  continueButtonText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default PaymentSuccessScreen;
