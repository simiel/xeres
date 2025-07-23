import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import React, { useState, useRef } from "react";
import PagerView from "react-native-pager-view";
import { Ionicons } from "@expo/vector-icons";

// Dummy data
const portfolioData = {
  totalValue: "€999,139",
  allTimePerformance: {
    positive: { percentage: "+0.11%", value: "$1,068" },
    negative: { percentage: "-0.11%", value: "$1,068" },
  },
  cashBalance: "€700,000",
};

const cryptoHoldingsData = {
  allTime: [
    {
      id: "btc",
      name: "Bitcoin",
      symbol: "BTC",
      value: "36 873.02 $",
      change: "+0.64 %",
      isPositive: true,
      icon: "₿",
      color: "#F7931A",
    },
    {
      id: "doge",
      name: "Dogecoin",
      symbol: "DOGE",
      value: "0.314440 $",
      change: "-4.08 %",
      isPositive: false,
      icon: "Ð",
      color: "#C2A633",
    },
    {
      id: "ada",
      name: "Cardano",
      symbol: "ADA",
      value: "1.47 $",
      change: "-3.78 %",
      isPositive: false,
      icon: "₳",
      color: "#0033AD",
    },
    {
      id: "eth",
      name: "Ethereum",
      symbol: "ETH",
      value: "2 396.32 $",
      change: "-2.86 %",
      isPositive: false,
      icon: "Ξ",
      color: "#627EEA",
    },
  ],
  monthly: [
    {
      id: "btc",
      name: "Bitcoin",
      symbol: "BTC",
      value: "36 873.02 $",
      change: "+2.15 %",
      isPositive: true,
      icon: "₿",
      color: "#F7931A",
    },
    {
      id: "eth",
      name: "Ethereum",
      symbol: "ETH",
      value: "2 396.32 $",
      change: "+1.24 %",
      isPositive: true,
      icon: "Ξ",
      color: "#627EEA",
    },
    {
      id: "ada",
      name: "Cardano",
      symbol: "ADA",
      value: "1.47 $",
      change: "-0.95 %",
      isPositive: false,
      icon: "₳",
      color: "#0033AD",
    },
    {
      id: "doge",
      name: "Dogecoin",
      symbol: "DOGE",
      value: "0.314440 $",
      change: "-1.12 %",
      isPositive: false,
      icon: "Ð",
      color: "#C2A633",
    },
  ],
};

const { width } = Dimensions.get("window");

const Page = () => {
  const [selectedTab, setSelectedTab] = useState("All Time");
  const [portfolioPeriod, setPortfolioPeriod] = useState<"allTime" | "monthly">(
    "monthly"
  );
  const [currentPage, setCurrentPage] = useState(1); // 0 for All Time, 1 for Monthly
  const pagerRef = useRef<PagerView>(null);

  const getCurrentCryptoData = () => {
    return cryptoHoldingsData[portfolioPeriod];
  };

  const handleTabPress = (period: "allTime" | "monthly") => {
    setPortfolioPeriod(period);
    const pageIndex = period === "allTime" ? 0 : 1;
    setCurrentPage(pageIndex);
    pagerRef.current?.setPage(pageIndex);
  };

  const handlePageSelected = (event: any) => {
    const pageIndex = event.nativeEvent.position;
    setCurrentPage(pageIndex);
    setPortfolioPeriod(pageIndex === 0 ? "allTime" : "monthly");
  };

  const renderCryptoList = (data: typeof cryptoHoldingsData.allTime) => (
    <View style={styles.cryptoList}>
      {data.map((crypto) => (
        <View key={crypto.id} style={styles.cryptoItem}>
          <View style={styles.cryptoLeft}>
            <View
              style={[styles.cryptoIcon, { backgroundColor: crypto.color }]}
            >
              <Text style={styles.cryptoIconText}>{crypto.icon}</Text>
            </View>
            <View style={styles.cryptoInfo}>
              <Text style={styles.cryptoSymbol}>{crypto.symbol}</Text>
              <Text style={styles.cryptoName}>{crypto.name}</Text>
            </View>
          </View>

          <View style={styles.cryptoCenter}>{renderMiniChart()}</View>

          <View style={styles.cryptoRight}>
            <Text style={styles.cryptoValue}>{crypto.value}</Text>
            <Text
              style={[
                styles.cryptoChange,
                crypto.isPositive
                  ? styles.cryptoChangePositive
                  : styles.cryptoChangeNegative,
              ]}
            >
              {crypto.change}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderMiniChart = () => (
    <View style={styles.miniChart}>
      <View style={styles.chartLine} />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Image
              source={{
                uri: "https://via.placeholder.com/40x40/333/white?text=U",
              }}
              style={styles.avatarImage}
            />
          </View>
          <View style={styles.playLearnSection}>
            <Text style={styles.playLearnText}>Play & Learn</Text>
            <Ionicons name="chevron-down" size={16} color="#ffffff" />
          </View>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="search" size={24} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="menu" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Portfolio Value */}
      <View style={styles.portfolioValue}>
        <Text style={styles.portfolioAmount}>{portfolioData.totalValue}</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {["Stats", "Portfolio", "Risk"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, tab === "Portfolio" && styles.activeTab]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                tab === "Portfolio" && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Performance Cards */}
      <View style={styles.performanceContainer}>
        <View style={styles.performanceCard}>
          <Text style={styles.performanceTitle}>All time performance</Text>
          <View style={styles.performanceValue}>
            <Ionicons name="trending-up" size={16} color="#4CAF50" />
            <Text style={styles.performancePositive}>
              {portfolioData.allTimePerformance.positive.percentage}
            </Text>
          </View>
          <Text style={styles.performanceAmount}>
            {portfolioData.allTimePerformance.positive.value}
          </Text>
        </View>

        <View style={styles.performanceCard}>
          <Text style={styles.performanceTitle}>All time performance</Text>
          <View style={styles.performanceValue}>
            <Ionicons name="trending-down" size={16} color="#F44336" />
            <Text style={styles.performanceNegative}>
              {portfolioData.allTimePerformance.negative.percentage}
            </Text>
          </View>
          <Text style={styles.performanceAmount}>
            {portfolioData.allTimePerformance.negative.value}
          </Text>
        </View>
      </View>

      {/* Portfolio Builder */}
      <TouchableOpacity style={styles.portfolioBuilder}>
        <View style={styles.portfolioBuilderIcon}>
          <Ionicons name="pie-chart" size={24} color="#ffffff" />
        </View>
        <View style={styles.portfolioBuilderContent}>
          <Text style={styles.portfolioBuilderTitle}>Portfolio builder</Text>
          <Text style={styles.portfolioBuilderSubtitle}>
            Make smarter investments
          </Text>
        </View>
      </TouchableOpacity>

      {/* Cash Balance */}
      <TouchableOpacity style={styles.cashBalance}>
        <View style={styles.cashBalanceIcon}>
          <Ionicons name="card" size={24} color="#4A90E2" />
        </View>
        <View style={styles.cashBalanceContent}>
          <Text style={styles.cashBalanceTitle}>Cash Balance</Text>
        </View>
        <View style={styles.cashBalanceRight}>
          <Text style={styles.cashBalanceAmount}>
            {portfolioData.cashBalance}
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </View>
      </TouchableOpacity>

      {/* Portfolio Section */}
      <View style={styles.portfolioSection}>
        <View style={styles.portfolioHeader}>
          <Text style={styles.portfolioTitle}>Your Portfolio</Text>
          <View style={styles.portfolioTabs}>
            <TouchableOpacity
              style={[
                styles.portfolioTab,
                currentPage === 0 && styles.activePortfolioTab,
              ]}
              onPress={() => handleTabPress("allTime")}
            >
              <Text
                style={[
                  styles.portfolioTabText,
                  currentPage === 0 && styles.activePortfolioTabText,
                ]}
              >
                All Time
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.portfolioTab,
                currentPage === 1 && styles.activePortfolioTab,
              ]}
              onPress={() => handleTabPress("monthly")}
            >
              <Text
                style={[
                  styles.portfolioTabText,
                  currentPage === 1 && styles.activePortfolioTabText,
                ]}
              >
                Monthly
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Swipeable Crypto Holdings */}
        <PagerView
          ref={pagerRef}
          style={styles.pagerView}
          initialPage={1}
          onPageSelected={handlePageSelected}
        >
          {/* All Time View */}
          <View key="0" style={styles.pageContainer}>
            {renderCryptoList(cryptoHoldingsData.allTime)}
          </View>

          {/* Monthly View */}
          <View key="1" style={styles.pageContainer}>
            {renderCryptoList(cryptoHoldingsData.monthly)}
          </View>
        </PagerView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E3A8A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
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
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  playLearnSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  playLearnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 15,
  },
  headerIcon: {
    padding: 5,
  },
  portfolioValue: {
    alignItems: "center",
    paddingBottom: 30,
  },
  portfolioAmount: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "bold",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#ffffff",
  },
  tabText: {
    color: "#ffffff80",
    fontSize: 16,
    fontWeight: "500",
  },
  activeTabText: {
    color: "#ffffff",
  },
  performanceContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 15,
    marginBottom: 25,
  },
  performanceCard: {
    flex: 1,
    backgroundColor: "#ffffff20",
    borderRadius: 12,
    padding: 15,
  },
  performanceTitle: {
    color: "#ffffff80",
    fontSize: 12,
    marginBottom: 8,
  },
  performanceValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 5,
  },
  performancePositive: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "600",
  },
  performanceNegative: {
    color: "#F44336",
    fontSize: 16,
    fontWeight: "600",
  },
  performanceAmount: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  portfolioBuilder: {
    backgroundColor: "#2563EB",
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  portfolioBuilderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  portfolioBuilderContent: {
    flex: 1,
  },
  portfolioBuilderTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  portfolioBuilderSubtitle: {
    color: "#ffffff80",
    fontSize: 14,
  },
  cashBalance: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  cashBalanceIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#EBF3FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  cashBalanceContent: {
    flex: 1,
  },
  cashBalanceTitle: {
    color: "#333333",
    fontSize: 16,
    fontWeight: "500",
  },
  cashBalanceRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cashBalanceAmount: {
    color: "#333333",
    fontSize: 16,
    fontWeight: "600",
  },
  portfolioSection: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    minHeight: 400,
  },
  portfolioHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  portfolioTitle: {
    color: "#333333",
    fontSize: 18,
    fontWeight: "600",
  },
  portfolioTabs: {
    flexDirection: "row",
    gap: 10,
  },
  portfolioTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activePortfolioTab: {
    backgroundColor: "#2563EB",
  },
  portfolioTabText: {
    color: "#666666",
    fontSize: 14,
    fontWeight: "500",
  },
  activePortfolioTabText: {
    color: "#ffffff",
  },
  cryptoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  cryptoLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cryptoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cryptoIconText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cryptoInfo: {
    flex: 1,
  },
  cryptoSymbol: {
    color: "#333333",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  cryptoName: {
    color: "#666666",
    fontSize: 14,
  },
  cryptoCenter: {
    flex: 1,
    alignItems: "center",
  },
  miniChart: {
    width: 60,
    height: 20,
    justifyContent: "center",
  },
  chartLine: {
    height: 2,
    backgroundColor: "#E0E0E0",
    borderRadius: 1,
  },
  cryptoRight: {
    alignItems: "flex-end",
  },
  cryptoValue: {
    color: "#333333",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  cryptoChange: {
    fontSize: 14,
    fontWeight: "500",
  },
  cryptoChangePositive: {
    color: "#4CAF50",
  },
  cryptoChangeNegative: {
    color: "#F44336",
  },
  pagerView: {
    flex: 1,
    minHeight: 400,
  },
  pageContainer: {
    flex: 1,
  },
  cryptoList: {
    flex: 1,
  },
});

export default Page;
