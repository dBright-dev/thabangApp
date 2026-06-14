import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  useColorScheme,
  ScrollView
} from 'react-native';
import { Colors } from '../../constants/theme';
import { useUser } from '././context/UserContext';
import AuthOverlay from '../../components/AuthOverlay';
import { User, MapPin, Receipt, Shield, LogOut, ChevronRight, Award } from 'lucide-react-native';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const activeColors = Colors[colorScheme || 'dark'];
  const { user, isAuthenticated, logout } = useUser();

  // Route back to Auth layer if unauthenticated
  if (!isAuthenticated) {
    return <AuthOverlay />;
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: activeColors.background }]} showsVerticalScrollIndicator={false}>

      {/* USER HERO IDENTITY CARD DISPLAY CARD */}
      <View style={[styles.profileCard, { backgroundColor: '#161618', borderColor: '#262629' }]}>
        <View style={[styles.avatarPlaceholder, { backgroundColor: activeColors.primary }]}>
          <Text style={styles.avatarText}>
            {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
          </Text>
        </View>
        <Text style={[styles.userName, { color: activeColors.text }]}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        <Text style={styles.userPhone}>{user?.phone}</Text>

        {/* LOYALTY POINTS WIDGET ELEMENT */}
        <View style={[styles.loyaltyBadge, { backgroundColor: activeColors.secondary + '15' }]}>
          <Award size={16} color={activeColors.secondary} />
          <Text style={[styles.loyaltyText, { color: activeColors.secondary }]}>240 Grill Loyalty Points</Text>
        </View>
      </View>

      {/* WORKSPACE PREFERENCE ACTION PANEL LISTS */}
      <Text style={[styles.sectionHeading, { color: activeColors.text }]}>Account Preferences</Text>
      <View style={[styles.menuList, { backgroundColor: '#161618', borderColor: '#262629' }]}>
        
        <TouchableOpacity style={styles.menuItem}>
          <Receipt size={20} color="#9BA1A6" />
          <Text style={[styles.menuItemText, { color: activeColors.text }]}>Order History</Text>
          <ChevronRight size={16} color="#48484A" style={styles.chevron} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <MapPin size={20} color="#9BA1A6" />
          <Text style={[styles.menuItemText, { color: activeColors.text }]}>Delivery Addresses</Text>
          <ChevronRight size={16} color="#48484A" style={styles.chevron} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Shield size={20} color="#9BA1A6" />
          <Text style={[styles.menuItemText, { color: activeColors.text }]}>Security & Biometrics</Text>
          <ChevronRight size={16} color="#48484A" style={styles.chevron} />
        </TouchableOpacity>
      </View>

      {/* LOGOUT SESSION TERMINATION MODULE */}
      <TouchableOpacity 
        style={[styles.logoutBtn, { borderColor: '#262629', backgroundColor: '#161618' }]}
        onPress={logout}
      >
        <LogOut size={20} color="#FF3B30" />
        <Text style={styles.logoutBtnText}>Sign Out Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, paddingTop: 20 },
  headerTitle: { fontSize: 24, fontWeight: '900' },
  profileCard: { marginHorizontal: 16, marginTop: 12, borderRadius: 24, borderWidth: 1, padding: 24, alignItems: 'center' },
  avatarPlaceholder: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { color: '#FFF', fontSize: 24, fontWeight: '800' },
  userName: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
  userEmail: { fontSize: 14, color: '#8E8E93', marginBottom: 2 },
  userPhone: { fontSize: 13, color: '#8E8E93' },
  loyaltyBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginTop: 16 },
  loyaltyText: { fontSize: 12, fontWeight: '800' },
  sectionHeading: { fontSize: 15, fontWeight: '800', marginHorizontal: 16, marginTop: 28, marginBottom: 10 },
  menuList: { marginHorizontal: 16, borderRadius: 24, borderWidth: 1, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, height: 56, borderBottomWidth: 1, borderBottomColor: '#262629' },
  menuItemText: { flex: 1, marginLeft: 14, fontSize: 15, fontWeight: '600' },
  chevron: { marginLeft: 'auto' },
  logoutBtn: { marginHorizontal: 16, marginTop: 20, borderRadius: 24, borderWidth: 1, height: 56, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 40 },
  logoutBtnText: { color: '#FF3B30', fontSize: 15, fontWeight: '800' }
});