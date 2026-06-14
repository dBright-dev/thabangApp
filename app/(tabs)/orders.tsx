import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  useColorScheme,
  ScrollView
} from 'react-native';
import { Colors } from '../../constants/theme';
import { useCart } from '././context/CartContext';
import { useUser } from '././context/UserContext';
import AuthOverlay from '../../components/AuthOverlay';
import { ChefHat, CheckCircle2, Clock, PackageCheck, Utensils } from 'lucide-react-native';

export default function OrdersScreen() {
  const colorScheme = useColorScheme();
  const activeColors = Colors[colorScheme || 'dark'];
  const { currentOrderStatus, activeOrderItems, clearActiveOrder } = useCart();

  // Helper utility to style status checkpoints based on current progress index
  const getStepStatus = (step: 'received' | 'preparing' | 'ready') => {
    const statusWeights = { none: 0, received: 1, preparing: 2, ready: 3, completed: 4 };
    const currentWeight = statusWeights[currentOrderStatus];
    const stepWeight = statusWeights[step];

    if (currentWeight > stepWeight) return 'completed';
    if (currentWeight === stepWeight) return 'active';
    return 'pending';
  };

  if (currentOrderStatus === 'none') {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: activeColors.background }]}>
        <Clock size={64} color="#52006A" strokeWidth={1.5} />
        <Text style={[styles.emptyTitle, { color: activeColors.text }]}>No active orders</Text>
        <Text style={styles.emptySubtitle}>You haven't placed any orders yet. Head over to the Menu to get started!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: activeColors.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: activeColors.text }]}>Track Order</Text>
        <Text style={styles.orderIdText}>Order Ref: #TSG-9842</Text>
      </View>

      {/* TRACKING TIMELINE PANEL CONTAINER */}
      <View style={[styles.cardPanel, { backgroundColor: '#161618', borderColor: '#262629' }]}>
        
        {/* Step 1: Received */}
        <View style={styles.timelineRow}>
          <View style={styles.iconColumn}>
            <View style={[styles.statusIndicatorCircle, 
              getStepStatus('received') === 'completed' && { backgroundColor: '#FF7600' },
              getStepStatus('received') === 'active' && { backgroundColor: activeColors.primary }
            ]}>
              {getStepStatus('received') === 'completed' ? <CheckCircle2 size={16} color="#FFF" /> : <Clock size={16} color="#FFF" />}
            </View>
            <View style={[styles.verticalConnectorLine, getStepStatus('preparing') !== 'pending' && { backgroundColor: '#FF7600' }]} />
          </View>
          <View style={styles.textColumn}>
            <Text style={[styles.stepTitle, { color: activeColors.text }, getStepStatus('received') === 'active' && { color: activeColors.primary }]}>
              Order Received
            </Text>
            <Text style={styles.stepSub}>We have securely processed your payment and confirmed your ticket.</Text>
          </View>
        </View>

        {/* Step 2: Preparing */}
        <View style={styles.timelineRow}>
          <View style={styles.iconColumn}>
            <View style={[styles.statusIndicatorCircle, 
              getStepStatus('preparing') === 'completed' && { backgroundColor: '#FF7600' },
              getStepStatus('preparing') === 'active' && { backgroundColor: activeColors.primary }
            ]}>
              <ChefHat size={16} color="#FFF" />
            </View>
            <View style={[styles.verticalConnectorLine, getStepStatus('ready') !== 'pending' && { backgroundColor: '#FF7600' }]} />
          </View>
          <View style={styles.textColumn}>
            <Text style={[styles.stepTitle, { color: activeColors.text }, getStepStatus('preparing') === 'active' && { color: activeColors.primary }]}>
              On the Grill
            </Text>
            <Text style={styles.stepSub}>Thabi's kitchen crew is currently preparing your flame-grilled order.</Text>
          </View>
        </View>

        {/* Step 3: Ready */}
        <View style={styles.timelineRow}>
          <View style={styles.iconColumn}>
            <View style={[styles.statusIndicatorCircle, 
              getStepStatus('ready') === 'completed' || currentOrderStatus === 'ready' ? { backgroundColor: '#FF7600' } : { backgroundColor: '#262629' }
            ]}>
              <PackageCheck size={16} color="#FFF" />
            </View>
          </View>
          <View style={styles.textColumn}>
            <Text style={[styles.stepTitle, { color: activeColors.text }, currentOrderStatus === 'ready' && { color: '#FF7600' }]}>
              Ready for Collection
            </Text>
            <Text style={styles.stepSub}>Your food is hot, packed, and waiting for you at the pick-up counter!</Text>
          </View>
        </View>
      </View>

      {/* SUMMARY SUMMARY LIST RECAP */}
      <Text style={[styles.sectionHeading, { color: activeColors.text }]}>Items in this Order</Text>
      <View style={[styles.cardPanel, { backgroundColor: '#161618', borderColor: '#262629', marginBottom: 30 }]}>
        {activeOrderItems.map((item, index) => (
          <View key={`${item.id}-${index}`} style={[styles.itemSummaryRow, index !== activeOrderItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: '#262629' }]}>
            <Text style={[styles.itemQuantity, { color: activeColors.primary }]}>{item.quantity}x</Text>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.itemName, { color: activeColors.text }]}>{item.name}</Text>
              {item.note ? <Text style={styles.itemNote}>"{item.note}"</Text> : null}
            </View>
            <Text style={[styles.itemPrice, { color: activeColors.text }]}>R{item.price * item.quantity}</Text>
          </View>
        ))}
      </View>

      {/* ORDER COMPLETE RESET BUTTON */}
      {currentOrderStatus === 'ready' && (
        <TouchableOpacity 
          style={[styles.dismissBtn, { backgroundColor: activeColors.primary }]}
          onPress={clearActiveOrder}
        >
          <Text style={styles.dismissBtnText}>I Have Collected My Food</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, paddingTop: 20 },
  headerTitle: { fontSize: 24, fontWeight: '900' },
  orderIdText: { fontSize: 13, color: '#FF7600', fontWeight: '700', marginTop: 2 },
  cardPanel: { marginHorizontal: 16, marginTop: 12, borderRadius: 24, borderWidth: 1, padding: 20 },
  sectionHeading: { fontSize: 16, fontWeight: '800', marginHorizontal: 16, marginTop: 24, marginBottom: 4 },
  
  // Timeline Formatting Rules
  timelineRow: { flexDirection: 'row', minHeight: 80 },
  iconColumn: { alignItems: 'center', width: 30 },
  statusIndicatorCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#262629', justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  verticalConnectorLine: { width: 3, flex: 1, backgroundColor: '#262629', marginTop: -2, marginBottom: -2, zIndex: 1 },
  textColumn: { flex: 1, marginLeft: 16, paddingTop: 4 },
  stepTitle: { fontSize: 15, fontWeight: '800' },
  stepSub: { fontSize: 12, color: '#8E8E93', marginTop: 4, lineHeight: 16 },

  // Summary Item Specifications
  itemSummaryRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  itemQuantity: { fontSize: 14, fontWeight: '900' },
  itemName: { fontSize: 14, fontWeight: '700' },
  itemNote: { fontSize: 11, color: '#FF7600', fontStyle: 'italic', marginTop: 2 },
  itemPrice: { fontSize: 14, fontWeight: '800' },

  // Empty State Fallbacks
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyTitle: { fontSize: 20, fontWeight: '800', marginTop: 16, marginBottom: 4 },
  emptySubtitle: { color: '#8E8E93', fontSize: 14, textAlign: 'center', lineHeight: 20 },

  // Action Dismiss Elements
  dismissBtn: { marginHorizontal: 16, paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginBottom: 40 },
  dismissBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800' }
});