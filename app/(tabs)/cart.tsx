import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  useColorScheme,
  Modal,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Colors } from '../../constants/theme';
import { useCart } from '././context/CartContext';
import { useUser } from '././context/UserContext';
import AuthOverlay from '../../components/AuthOverlay';
import { Plus, Minus, ShoppingBag, CreditCard, Smartphone, CheckCircle, X } from 'lucide-react-native';

export default function CartScreen() {
  const colorScheme = useColorScheme();
  const activeColors = Colors[colorScheme || 'dark'];
  const { cartItems, addToCart, removeFromCart, getCartTotal, checkoutOrder } = useCart();

  // CONSUME AUTHENTICATION STATE
  const { isAuthenticated } = useUser();

  // Navigation & Payment Modal States
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [authModalVisible, setAuthModalVisible] = useState(false); // Auth gate interceptor state
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'Card' | 'ApplePay' | 'TapToPay' | null>(null);

  const totalAmount = getCartTotal();

  // INTERCEPT CHECKOUT IF NOT LOGGED IN
  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      setAuthModalVisible(true); // Stop execution and force login/register entry
    } else {
      setPaymentModalVisible(true); // Allow authenticated users to open payment options
    }
  };

  const handlePaymentInitiation = async (method: 'Card' | 'ApplePay' | 'TapToPay') => {
    setSelectedMethod(method);
    setIsProcessing(true);
    
    const success = await checkoutOrder(method);
    
    setIsProcessing(false);
    if (success) {
      setPaymentSuccess(true);
    } else {
      Alert.alert("Transaction Failed", "Could not complete the portal authorization. Please try again.");
    }
  };

  const closeReceiptFlow = () => {
    setPaymentSuccess(false);
    setPaymentModalVisible(false);
    setSelectedMethod(null);
  };

  // Automatically transition forward if they log in while the auth gate is open
  React.useEffect(() => {
    if (isAuthenticated && authModalVisible) {
      setAuthModalVisible(false);
      setPaymentModalVisible(true); // Direct pass-through to payment gateway once authed
    }
  }, [isAuthenticated]);

  if (cartItems.length === 0 && !paymentSuccess) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: activeColors.background }]}>
        <ShoppingBag size={64} color="#52006A" strokeWidth={1.5} />
        <Text style={[styles.emptyTitle, { color: activeColors.text }]}>Your basket is empty</Text>
        <Text style={styles.emptySubtitle}>Go back to the menu to add Thabi's premium flame grills!</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: activeColors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: activeColors.text }]}>My Basket</Text>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.cartList}
        renderItem={({ item }) => (
          <View style={[styles.cartCard, { backgroundColor: '#161618', borderColor: '#262629' }]}>
            <Image source={item.image} style={styles.itemImage} />
            
            <View style={styles.cardDetails}>
              <View style={styles.rowBetween}>
                <Text style={[styles.itemName, { color: activeColors.text }]} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={[styles.itemPrice, { color: activeColors.accent }]}>
                  R{item.price * item.quantity}
                </Text>
              </View>

              {/* Show Custom Customer Note if present */}
              {item.note ? (
                <Text style={styles.itemNote} numberOfLines={2}>
                  Note: "{item.note}"
                </Text>
              ) : null}

              <View style={styles.rowBetweenDetail}>
                <Text style={styles.categoryTag}>{item.category}</Text>
                
                {/* Counter actions within the basket */}
                <View style={styles.inlineCounter}>
                  <TouchableOpacity 
                    style={styles.counterActionBtn}
                    onPress={() => removeFromCart(item.id, item.note || '')}
                  >
                    <Minus size={14} color="#FFF" />
                  </TouchableOpacity>
                  <Text style={[styles.counterValue, { color: activeColors.text }]}>
                    {item.quantity}
                  </Text>
                  <TouchableOpacity 
                    style={styles.counterActionBtn}
                    onPress={() => addToCart(item, 1, item.note || '')}
                  >
                    <Plus size={14} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
      />

      {/* FOOTER TOTAL CALCULATION CARD RECEIPT */}
      <View style={[styles.footer, { backgroundColor: '#161618', borderTopColor: '#262629' }]}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={[styles.totalValue, { color: activeColors.text }]}>R{totalAmount}</Text>
        </View>
        
        <TouchableOpacity style={[styles.checkoutBtn, { backgroundColor: activeColors.primary }]}
            activeOpacity={0.8}
            onPress={() => setPaymentModalVisible(true)}>
          <Text style={styles.checkoutText}>Proceed to Checkout • R{totalAmount}</Text>
        </TouchableOpacity>
      </View>

      {/* REQUIREMENT GATE: AUTHENTICATION MODAL */}
      <Modal visible={authModalVisible} animationType="slide" transparent={false}>
        <View style={{ flex: 1, backgroundColor: activeColors.background }}>
          <View style={{ paddingHorizontal: 24, paddingTop: 50, flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity onPress={() => setAuthModalVisible(false)} style={styles.closeGateBtn}>
              <X size={24} color="#9BA1A6" />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', marginTop: -40 }}>
            <Text style={styles.gateAlertText}>Authentication Required</Text>
            <AuthOverlay />
          </View>
        </View>
      </Modal>

    {/* SECURE INTEGRATED PAYMENT GATEWAY MODAL */}
      <Modal visible={paymentModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: '#161618', borderColor: '#262629' }]}>
            
            {!isProcessing && !paymentSuccess && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: activeColors.text }]}>Payment Gateway</Text>
                  <TouchableOpacity onPress={() => setPaymentModalVisible(false)}>
                    <X size={22} color="#9BA1A6" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.paymentSub}>Select an approved payment protocol:</Text>

                {/* Card Payment Selector */}
                <TouchableOpacity style={styles.payOption} onPress={() => handlePaymentInitiation('Card')}>
                  <CreditCard color={activeColors.tint} size={24} />
                  <View style={styles.payOptionTextContainer}>
                    <Text style={[styles.payOptionTitle, { color: activeColors.text }]}>Credit or Debit Card</Text>
                    <Text style={styles.payOptionSub}>Visa, Mastercard secure checkout</Text>
                  </View>
                </TouchableOpacity>

                {/* Apple Pay Selector */}
                <TouchableOpacity style={styles.payOption} onPress={() => handlePaymentInitiation('ApplePay')}>
                  <Smartphone color={activeColors.tint} size={24} />
                  <View style={styles.payOptionTextContainer}>
                    <Text style={[styles.payOptionTitle, { color: activeColors.text }]}>Apple Pay</Text>
                    <Text style={styles.payOptionSub}>Instant device authorization</Text>
                  </View>
                </TouchableOpacity>

                {/* Tap to Pay Selector */}
                <TouchableOpacity style={styles.payOption} onPress={() => handlePaymentInitiation('TapToPay')}>
                  <Smartphone color={activeColors.tint} size={24} />
                  <View style={styles.payOptionTextContainer}>
                    <Text style={[styles.payOptionTitle, { color: activeColors.text }]}>Tap to Pay</Text>
                    <Text style={styles.payOptionSub}>NFC contactless mobile processing</Text>
                  </View>
                </TouchableOpacity>
              </>
            )}

            {/* PROCESSING STATE LOADER */}
            {isProcessing && (
              <View style={styles.statusContainer}>
                <ActivityIndicator size="large" color={activeColors.primary} />
                <Text style={[styles.statusTitle, { color: activeColors.text }]}>Authorizing Transaction...</Text>
                <Text style={styles.statusSub}>Securely connecting to business checking core infrastructure.</Text>
              </View>
            )}

            {/* TRANSACTION SUCCESS SCREEN */}
            {paymentSuccess && (
              <View style={styles.statusContainer}>
                <CheckCircle size={64} color="#FF7600" />
                <Text style={[styles.statusTitle, { color: activeColors.text }]}>Order Placed Successfully!</Text>
                <Text style={styles.statusSub}>Your payment has been cleared and routed to the kitchen queue.</Text>
                
                <TouchableOpacity style={[styles.doneBtn, { backgroundColor: activeColors.primary }]} onPress={closeReceiptFlow}>
                  <Text style={styles.doneBtnText}>Back to Menu</Text>
                </TouchableOpacity>
              </View>
            )}

          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, paddingTop: 20 },
  headerTitle: { fontSize: 24, fontWeight: '900' },
  cartList: { paddingHorizontal: 16, paddingBottom: 20, gap: 12 },
  cartCard: { flexDirection: 'row', borderRadius: 20, borderWidth: 1, padding: 10, alignItems: 'center' },
  itemImage: { width: 75, height: 75, borderRadius: 14, backgroundColor: '#262626' },
  cardDetails: { flex: 1, marginLeft: 12, justifyContent: 'space-between', height: 75 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowBetweenDetail: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' },
  itemName: { fontSize: 15, fontWeight: '800', maxWidth: '75%' },
  itemPrice: { fontSize: 15, fontWeight: '900' },
  itemNote: { fontSize: 11, color: '#FF7600', fontStyle: 'italic', marginTop: 2 },
  categoryTag: { fontSize: 10, color: '#8E8E93', textTransform: 'uppercase', fontWeight: '700' },
  inlineCounter: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#262629', borderRadius: 8, padding: 3, gap: 10 },
  counterActionBtn: { width: 24, height: 24, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  counterValue: { fontSize: 13, fontWeight: '800' },
  
  // Footer Layout
  footer: { padding: 20, borderTopWidth: 1, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  totalLabel: { fontSize: 16, color: '#9BA1A6', fontWeight: '600' },
  totalValue: { fontSize: 20, fontWeight: '900' },
  checkoutBtn: { paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  checkoutText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  
  // Empty State Layout
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyTitle: { fontSize: 20, fontWeight: '800', marginTop: 16, marginBottom: 4 },
  emptySubtitle: { color: '#8E8E93', fontSize: 14, textAlign: 'center', lineHeight: 20 },

  // Auth Modal Additions
  closeGateBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#161618', justifyContent: 'center', alignItems: 'center' },
  gateAlertText: { textAlign: 'center', fontSize: 15, color: '#FF7600', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  
  // Payment Gateway Interface
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 32, borderTopRightRadius: 32, borderWidth: 1, padding: 24, minHeight: 380 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  modalTitle: { fontSize: 20, fontWeight: '900' },
  paymentSub: { color: '#8E8E93', fontSize: 13, marginBottom: 20 },
  payOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#262629', padding: 16, borderRadius: 16, marginBottom: 12 },
  payOptionTextContainer: { marginLeft: 16 },
  payOptionTitle: { fontSize: 15, fontWeight: '800' },
  payOptionSub: { fontSize: 12, color: '#8E8E93', marginTop: 2 },
  statusContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  statusTitle: { fontSize: 18, fontWeight: '900', marginTop: 16 },
  statusSub: { color: '#8E8E93', fontSize: 13, textAlign: 'center', marginTop: 6, paddingHorizontal: 20 },
  doneBtn: { marginTop: 24, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12 },
  doneBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800' }
});