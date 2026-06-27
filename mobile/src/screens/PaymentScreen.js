import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';

const PaymentScreen = ({ route, navigation }) => {
  const { orderId, totalAmount } = route.params;
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const paymentMethods = [
    {
      id: 'mpesa',
      name: 'M-Pesa',
      icon: 'mobile-payment',
      description: 'Instant mobile money',
      countries: ['Kenya', 'Tanzania', 'Uganda'],
      color: '#FF6B35',
    },
    {
      id: 'stripe',
      name: 'Debit/Credit Card',
      icon: 'credit-card',
      description: 'Visa, Mastercard, etc.',
      countries: ['All'],
      color: '#FF8C42',
    },
    {
      id: 'flutterwave',
      name: 'Flutterwave',
      icon: 'wallet-travel',
      description: 'Multiple payment methods',
      countries: ['All African countries'],
      color: '#FFA500',
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: 'paypal',
      description: 'Secure online payment',
      countries: ['All'],
      color: '#FFB84D',
    },
  ];

  const handlePayment = async () => {
    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    if (selectedMethod === 'mpesa' && !phoneNumber) {
      Alert.alert('Error', 'Please enter M-Pesa phone number');
      return;
    }

    setLoading(true);

    try {
      if (selectedMethod === 'mpesa') {
        await handleMPesaPayment();
      } else if (selectedMethod === 'stripe') {
        await handleStripePayment();
      } else if (selectedMethod === 'flutterwave') {
        await handleFlutterwavePayment();
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMPesaPayment = async () => {
    try {
      // Call M-Pesa API
      const response = await fetch('http://your-api.com/api/payments/mpesa/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          order_id: orderId,
          amount: totalAmount,
          phone: phoneNumber,
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', 'STK Push sent. Complete payment on your phone.');
        // Wait for user to complete payment
        setTimeout(() => {
          navigation.navigate('OrderConfirmation', { orderId });
        }, 5000);
      }
    } catch (error) {
      throw new Error('M-Pesa payment failed');
    }
  };

  const handleStripePayment = async () => {
    try {
      // Stripe payment logic
      const response = await fetch('http://your-api.com/api/payments/stripe/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          order_id: orderId,
          amount: totalAmount,
        }),
      });

      const data = await response.json();
      // Redirect to Stripe checkout
      navigation.navigate('StripeCheckout', { sessionId: data.sessionId });
    } catch (error) {
      throw new Error('Stripe payment failed');
    }
  };

  const handleFlutterwavePayment = async () => {
    try {
      // Flutterwave payment logic
      const response = await fetch(
        'http://your-api.com/api/payments/flutterwave/initiate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            order_id: orderId,
            amount: totalAmount,
            phone: phoneNumber,
          }),
        }
      );

      const data = await response.json();
      // Redirect to Flutterwave payment page
      navigation.navigate('FlutterwavePayment', { paymentLink: data.paymentLink });
    } catch (error) {
      throw new Error('Flutterwave payment failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#FF6B35', '#FF8C42']}
          style={styles.header}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment Method</Text>
          <View style={{ width: 28 }} />
        </LinearGradient>

        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Order Total</Text>
          <Text style={styles.summaryAmount}>KES {totalAmount.toLocaleString()}</Text>
        </View>

        {/* Payment Methods */}
        <View style={styles.methodsContainer}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>

          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                selectedMethod === method.id && styles.methodCardSelected,
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View style={styles.methodContent}>
                <View
                  style={[
                    styles.methodIcon,
                    { backgroundColor: method.color },
                  ]}
                >
                  <Icon name={method.icon} size={32} color="white" />
                </View>

                <View style={styles.methodInfo}>
                  <Text style={styles.methodName}>{method.name}</Text>
                  <Text style={styles.methodDesc}>{method.description}</Text>
                  <Text style={styles.methodCountries}>
                    {method.countries.join(', ')}
                  </Text>
                </View>
              </View>

              {selectedMethod === method.id && (
                <Icon name="check-circle" size={28} color={method.color} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* M-Pesa Phone Input */}
        {selectedMethod === 'mpesa' && (
          <View style={styles.phoneInputContainer}>
            <Text style={styles.inputLabel}>Enter M-Pesa Phone Number</Text>
            <View style={styles.inputBox}>
              <Text style={styles.countryCode}>+254</Text>
              <TextInput
                style={styles.phoneInput}
                placeholder="712345678"
                keyboardType="numeric"
                value={phoneNumber.replace('+254', '')}
                onChangeText={(text) => setPhoneNumber(`+254${text}`)}
              />
            </View>
          </View>
        )}

        {/* Payment Info */}
        <View style={styles.infoCard}>
          <Icon name="information" size={24} color="#FF6B35" />
          <Text style={styles.infoText}>
            Your payment is secure and encrypted. You will receive a confirmation
            email shortly.
          </Text>
        </View>
      </ScrollView>

      {/* Pay Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.payButton,
            !selectedMethod && styles.payButtonDisabled,
          ]}
          onPress={handlePayment}
          disabled={!selectedMethod || loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.payButtonText}>
              Pay KES {totalAmount.toLocaleString()}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  summaryCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  methodsContainer: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  methodCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#EEE',
  },
  methodCardSelected: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF5F0',
  },
  methodContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  methodDesc: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  methodCountries: {
    fontSize: 11,
    color: '#999',
  },
  phoneInputContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  countryCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
  },
  infoCard: {
    marginHorizontal: 16,
    backgroundColor: '#FFF5F0',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 13,
    color: '#FF6B35',
    marginLeft: 12,
    flex: 1,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  payButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#DDD',
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
