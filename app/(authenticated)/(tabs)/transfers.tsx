import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Currency } from "../../../interfaces/crypto";

const { width } = Dimensions.get("window");

// Dummy data for transfers page
const portfolioBalance = {
  totalValue: "GHS 12,847.92",
  availableForTransfer: "GHS 10,200.00",
};

const favoriteContacts = [
  {
    id: "1",
    name: "John Doe",
    address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    avatar: "https://via.placeholder.com/40x40/FFD700/white?text=JD",
    isVerified: true,
  },
  {
    id: "2",
    name: "Sarah Wilson",
    address: "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy",
    avatar: "https://via.placeholder.com/40x40/FFA500/white?text=SW",
    isVerified: true,
  },
  {
    id: "3",
    name: "Mike Chen",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    avatar: "https://via.placeholder.com/40x40/DAA520/white?text=MC",
    isVerified: false,
  },
];

const recentTransfers = [
  {
    id: "1",
    type: "sent",
    crypto: "BTC",
    amount: "0.0234",
    fiatAmount: "GHS 892.45",
    recipient: "John Doe",
    status: "completed",
    date: "Today, 2:30 PM",
    txHash: "a1b2c3d4e5f6...",
  },
  {
    id: "2",
    type: "received",
    crypto: "ETH",
    amount: "1.2567",
    fiatAmount: "GHS 3,012.88",
    sender: "Sarah Wilson",
    status: "completed",
    date: "Yesterday, 4:15 PM",
    txHash: "f6e5d4c3b2a1...",
  },
  {
    id: "3",
    type: "sent",
    crypto: "ADA",
    amount: "1,250.00",
    fiatAmount: "GHS 1,837.50",
    recipient: "Mike Chen",
    status: "pending",
    date: "2 days ago, 11:20 AM",
    txHash: "1a2b3c4d5e6f...",
  },
];

const quickActions = [
  { id: "send", title: "Send", icon: "arrow-up", color: "#FFD700" },
  { id: "receive", title: "Receive", icon: "arrow-down", color: "#FFA500" },
  { id: "swap", title: "Swap", icon: "swap-horizontal", color: "#DAA520" },
  { id: "scan", title: "Scan QR", icon: "qr-code", color: "#B8860B" },
];

const Page = () => {
  const [cryptoData, setCryptoData] = useState<Currency[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<Currency | null>(null);
  const [transferAmount, setTransferAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [transferMode, setTransferMode] = useState<"quick" | "detailed">(
    "quick"
  );

  useEffect(() => {
    fetchCryptoData();
  }, []);

  const fetchCryptoData = async () => {
    try {
      const response = await fetch("/api/listings?limit=10");
      const data = await response.json();
      setCryptoData(data);
      if (data.length > 0) {
        setSelectedCrypto(data[0]); // Default to first crypto (likely BTC)
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching crypto data:", error);
      setLoading(false);
    }
  };

  const calculateTransferValue = () => {
    if (!selectedCrypto || !transferAmount) return "GHS 0.00";
    const amount = parseFloat(transferAmount);
    const price = selectedCrypto.quote.GHS.price;
    return `GHS ${(amount * price).toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#4CAF50";
      case "pending":
        return "#FFA500";
      case "failed":
        return "#F44336";
      default:
        return "#666";
    }
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case "send":
        setTransferMode("detailed");
        break;
      case "receive":
        Alert.alert("Receive Crypto", "QR code and address will be generated");
        break;
      case "swap":
        Alert.alert("Swap Crypto", "Swap feature coming soon");
        break;
      case "scan":
        Alert.alert("Scan QR", "Camera will open to scan QR code");
        break;
    }
  };

  const handleTransfer = () => {
    if (!selectedCrypto || !transferAmount || !recipientAddress) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    Alert.alert(
      "Confirm Transfer",
      `Send ${transferAmount} ${
        selectedCrypto.symbol
      } (${calculateTransferValue()}) to ${recipientAddress.substring(
        0,
        10
      )}...?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            Alert.alert("Success", "Transfer initiated successfully!");
            setTransferAmount("");
            setRecipientAddress("");
            setTransferMode("quick");
          },
        },
      ]
    );
  };

  const renderCryptoSelector = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.cryptoSelector}
    >
      {cryptoData.map((crypto) => (
        <TouchableOpacity
          key={crypto.id}
          style={[
            styles.cryptoOption,
            selectedCrypto?.id === crypto.id && styles.selectedCryptoOption,
          ]}
          onPress={() => setSelectedCrypto(crypto)}
        >
          <Text
            style={[
              styles.cryptoSymbol,
              selectedCrypto?.id === crypto.id && styles.selectedCryptoSymbol,
            ]}
          >
            {crypto.symbol}
          </Text>
          <Text
            style={[
              styles.cryptoPrice,
              selectedCrypto?.id === crypto.id && styles.selectedCryptoPrice,
            ]}
          >
            GHS {crypto.quote.GHS.price.toFixed(2)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading crypto data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Image
              source={{
                uri: "https://via.placeholder.com/40x40/FFD700/white?text=U",
              }}
              style={styles.avatarImage}
            />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.welcomeText}>Portfolio Balance</Text>
            <Text style={styles.balanceAmount}>
              {portfolioBalance.totalValue}
            </Text>
          </View>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="notifications" size={24} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="settings" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Available Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available for Transfer</Text>
        <Text style={styles.availableAmount}>
          {portfolioBalance.availableForTransfer}
        </Text>
        <View style={styles.balanceActions}>
          <TouchableOpacity style={styles.balanceAction}>
            <Ionicons name="eye" size={16} color="#FFD700" />
            <Text style={styles.balanceActionText}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.balanceAction}>
            <Ionicons name="refresh" size={16} color="#FFD700" />
            <Text style={styles.balanceActionText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionItem}
              onPress={() => handleQuickAction(action.id)}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: action.color },
                ]}
              >
                <Ionicons name={action.icon as any} size={20} color="#ffffff" />
              </View>
              <Text style={styles.quickActionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Live Market Rates */}
      <View style={styles.marketRatesContainer}>
        <Text style={styles.sectionTitle}>Live Market Rates</Text>
        {renderCryptoSelector()}
      </View>

      {/* Transfer Form */}
      {transferMode === "detailed" && (
        <View style={styles.transferFormContainer}>
          <Text style={styles.sectionTitle}>Send Crypto</Text>
          <View style={styles.transferForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Amount ({selectedCrypto?.symbol})
              </Text>
              <TextInput
                style={styles.textInput}
                value={transferAmount}
                onChangeText={setTransferAmount}
                placeholder="0.00"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
              <Text style={styles.fiatValue}>{calculateTransferValue()}</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Recipient Address</Text>
              <TextInput
                style={styles.textInput}
                value={recipientAddress}
                onChangeText={setRecipientAddress}
                placeholder="Enter wallet address or scan QR"
                placeholderTextColor="#999"
                multiline
              />
            </View>

            <TouchableOpacity
              style={styles.transferButton}
              onPress={handleTransfer}
            >
              <Text style={styles.transferButtonText}>
                Send {selectedCrypto?.symbol}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setTransferMode("quick")}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Favorite Contacts */}
      <View style={styles.contactsContainer}>
        <Text style={styles.sectionTitle}>Favorite Contacts</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.contactsScroll}>
            {favoriteContacts.map((contact) => (
              <TouchableOpacity key={contact.id} style={styles.contactCard}>
                <View style={styles.contactAvatarContainer}>
                  <Image
                    source={{ uri: contact.avatar }}
                    style={styles.contactAvatar}
                  />
                  {contact.isVerified && (
                    <View style={styles.verifiedBadge}>
                      <Ionicons name="checkmark" size={10} color="#ffffff" />
                    </View>
                  )}
                </View>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactAddress}>
                  {contact.address.substring(0, 8)}...
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Recent Transfers */}
      <View style={styles.transfersContainer}>
        <Text style={styles.sectionTitle}>Recent Transfers</Text>
        <View style={styles.transfersList}>
          {recentTransfers.map((transfer) => (
            <View key={transfer.id} style={styles.transferItem}>
              <View style={styles.transferLeft}>
                <View
                  style={[
                    styles.transferIcon,
                    {
                      backgroundColor:
                        transfer.type === "sent" ? "#FF6B6B" : "#4CAF50",
                    },
                  ]}
                >
                  <Ionicons
                    name={transfer.type === "sent" ? "arrow-up" : "arrow-down"}
                    size={18}
                    color="#ffffff"
                  />
                </View>
                <View style={styles.transferInfo}>
                  <Text style={styles.transferType}>
                    {transfer.type === "sent" ? "Sent to" : "Received from"}{" "}
                    {transfer.type === "sent"
                      ? transfer.recipient
                      : transfer.sender}
                  </Text>
                  <Text style={styles.transferDate}>{transfer.date}</Text>
                </View>
              </View>
              <View style={styles.transferRight}>
                <Text style={styles.transferAmount}>
                  {transfer.type === "sent" ? "-" : "+"}
                  {transfer.amount} {transfer.crypto}
                </Text>
                <Text style={styles.transferFiat}>{transfer.fiatAmount}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(transfer.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{transfer.status}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Security Notice */}
      <View style={styles.securityNotice}>
        <View style={styles.securityIcon}>
          <Ionicons name="shield-checkmark" size={20} color="#FFD700" />
        </View>
        <Text style={styles.securityText}>
          All transfers are secured with end-to-end encryption and require
          verification
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8DC",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#2C1810",
    fontSize: 16,
    fontWeight: "500",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#FFD700",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  headerText: {
    flex: 1,
  },
  welcomeText: {
    color: "#ffffff",
    fontSize: 14,
    opacity: 0.9,
    fontWeight: "500",
  },
  balanceAmount: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 15,
  },
  headerIcon: {
    padding: 5,
  },
  balanceCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginTop: -10,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceLabel: {
    color: "#666",
    fontSize: 14,
    marginBottom: 8,
  },
  availableAmount: {
    color: "#1A1A1A",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
  },
  balanceActions: {
    flexDirection: "row",
    gap: 20,
  },
  balanceAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  balanceActionText: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "500",
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    color: "#2C1810",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
    textShadowColor: "rgba(255,255,255,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickActionItem: {
    alignItems: "center",
    flex: 1,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionText: {
    color: "#2C1810",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "600",
  },
  marketRatesContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  cryptoSelector: {
    flexDirection: "row",
  },
  cryptoOption: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    marginRight: 10,
    minWidth: 100,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedCryptoOption: {
    borderColor: "#FFD700",
    backgroundColor: "#FFF8DC",
  },
  cryptoSymbol: {
    color: "#2C1810",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  selectedCryptoSymbol: {
    color: "#FFD700",
  },
  cryptoPrice: {
    color: "#666",
    fontSize: 12,
  },
  selectedCryptoPrice: {
    color: "#2C1810",
    fontWeight: "600",
  },
  transferFormContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  transferForm: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: "#2C1810",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: "#1A1A1A",
    backgroundColor: "#FAFAFA",
  },
  fiatValue: {
    color: "#666",
    fontSize: 14,
    marginTop: 5,
    textAlign: "right",
  },
  transferButton: {
    backgroundColor: "#FFD700",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 10,
  },
  transferButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
  contactsContainer: {
    marginBottom: 25,
    paddingLeft: 20,
  },
  contactsScroll: {
    flexDirection: "row",
    paddingRight: 20,
    gap: 15,
  },
  contactCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    width: 120,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactAvatarContainer: {
    position: "relative",
    marginBottom: 8,
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  contactName: {
    color: "#1A1A1A",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 2,
    textAlign: "center",
  },
  contactAddress: {
    color: "#666",
    fontSize: 10,
    textAlign: "center",
  },
  transfersContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  transfersList: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transferItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  transferLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  transferIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transferInfo: {
    flex: 1,
  },
  transferType: {
    color: "#1A1A1A",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  transferDate: {
    color: "#666",
    fontSize: 12,
  },
  transferRight: {
    alignItems: "flex-end",
  },
  transferAmount: {
    color: "#1A1A1A",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  transferFiat: {
    color: "#666",
    fontSize: 12,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "500",
  },
  securityNotice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginBottom: 25,
    borderRadius: 12,
    padding: 15,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  securityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF8DC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  securityText: {
    flex: 1,
    color: "#666",
    fontSize: 12,
    lineHeight: 16,
  },
});

export default Page;
