import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// Dummy data
const lifestyleData = {
  monthlySpending: "€2,847",
  budgetRemaining: "€1,153",
  totalBudget: "€4,000",
  spendingProgress: 0.71, // 71%
};

const spendingCategories = [
  {
    id: "dining",
    name: "Dining",
    amount: "€890",
    percentage: 31,
    color: "#FFD700",
    icon: "restaurant",
  },
  {
    id: "shopping",
    name: "Shopping",
    amount: "€654",
    percentage: 23,
    color: "#FFA500",
    icon: "bag",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    amount: "€523",
    percentage: 18,
    color: "#FF8C00",
    icon: "game-controller",
  },
  {
    id: "travel",
    name: "Travel",
    amount: "€480",
    percentage: 17,
    color: "#DAA520",
    icon: "airplane",
  },
  {
    id: "fitness",
    name: "Fitness",
    amount: "€300",
    percentage: 11,
    color: "#B8860B",
    icon: "fitness",
  },
];

const lifestyleGoals = [
  {
    id: "vacation",
    title: "Summer Vacation",
    target: 3500,
    current: 2100,
    icon: "sunny",
    color: "#FFD700",
  },
  {
    id: "gadget",
    title: "New MacBook",
    target: 2500,
    current: 800,
    icon: "laptop",
    color: "#FFA500",
  },
  {
    id: "experience",
    title: "Concert Tickets",
    target: 400,
    current: 320,
    icon: "musical-notes",
    color: "#DAA520",
  },
];

const recentTransactions = [
  {
    id: "1",
    merchant: "Starbucks",
    category: "Dining",
    amount: "-€12.50",
    date: "Today",
    icon: "cafe",
  },
  {
    id: "2",
    merchant: "Netflix",
    category: "Entertainment",
    amount: "-€15.99",
    date: "Yesterday",
    icon: "tv",
  },
  {
    id: "3",
    merchant: "Zara",
    category: "Shopping",
    amount: "-€89.99",
    date: "2 days ago",
    icon: "shirt",
  },
  {
    id: "4",
    merchant: "Spotify",
    category: "Entertainment",
    amount: "-€9.99",
    date: "3 days ago",
    icon: "musical-note",
  },
];

const quickActions = [
  { id: "split", title: "Split Bill", icon: "people", color: "#FFD700" },
  { id: "goal", title: "Add Goal", icon: "flag", color: "#FFA500" },
  { id: "budget", title: "Set Budget", icon: "wallet", color: "#DAA520" },
  {
    id: "subscription",
    title: "Subscriptions",
    icon: "refresh",
    color: "#B8860B",
  },
];

const Page = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");

  const renderProgressBar = (percentage: number, color: string) => (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${percentage}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );

  const renderCircularProgress = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    const circumference = 2 * Math.PI * 20;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <View style={styles.circularProgress}>
        <Text style={styles.goalPercentage}>{Math.round(percentage)}%</Text>
      </View>
    );
  };

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
            <Text style={styles.welcomeText}>Good evening</Text>
            <Text style={styles.userName}>Sarah</Text>
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

      {/* Spending Overview */}
      <View style={styles.spendingOverview}>
        <View style={styles.spendingCard}>
          <Text style={styles.spendingTitle}>This Month's Spending</Text>
          <Text style={styles.spendingAmount}>
            {lifestyleData.monthlySpending}
          </Text>
          <View style={styles.budgetInfo}>
            <Text style={styles.budgetText}>
              {lifestyleData.budgetRemaining} remaining of{" "}
              {lifestyleData.totalBudget}
            </Text>
            {renderProgressBar(lifestyleData.spendingProgress * 100, "#FFD700")}
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          {quickActions.map((action) => (
            <TouchableOpacity key={action.id} style={styles.quickActionItem}>
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

      {/* Spending Categories */}
      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Spending Categories</Text>
        <View style={styles.categoriesGrid}>
          {spendingCategories.map((category) => (
            <View key={category.id} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: category.color },
                  ]}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={18}
                    color="#ffffff"
                  />
                </View>
                <Text style={styles.categoryPercentage}>
                  {category.percentage}%
                </Text>
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryAmount}>{category.amount}</Text>
              {renderProgressBar(category.percentage, category.color)}
            </View>
          ))}
        </View>
      </View>

      {/* Lifestyle Goals */}
      <View style={styles.goalsContainer}>
        <Text style={styles.sectionTitle}>Lifestyle Goals</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.goalsScroll}>
            {lifestyleGoals.map((goal) => (
              <View key={goal.id} style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <View
                    style={[styles.goalIcon, { backgroundColor: goal.color }]}
                  >
                    <Ionicons
                      name={goal.icon as any}
                      size={20}
                      color="#ffffff"
                    />
                  </View>
                  {renderCircularProgress(goal.current, goal.target)}
                </View>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalProgress}>
                  €{goal.current.toLocaleString()} / €
                  {goal.target.toLocaleString()}
                </Text>
                <View style={styles.goalProgressBar}>
                  {renderProgressBar(
                    (goal.current / goal.target) * 100,
                    goal.color
                  )}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Recent Activity */}
      <View style={styles.activityContainer}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.transactionsList}>
          {recentTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <View style={styles.transactionIcon}>
                  <Ionicons
                    name={transaction.icon as any}
                    size={20}
                    color="#FFD700"
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionMerchant}>
                    {transaction.merchant}
                  </Text>
                  <Text style={styles.transactionCategory}>
                    {transaction.category}
                  </Text>
                </View>
              </View>
              <View style={styles.transactionRight}>
                <Text style={styles.transactionAmount}>
                  {transaction.amount}
                </Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Insights & Tips */}
      <View style={styles.insightsContainer}>
        <Text style={styles.sectionTitle}>Insights & Tips</Text>
        <View style={styles.insightCard}>
          <View style={styles.insightIcon}>
            <Ionicons name="bulb" size={24} color="#FFD700" />
          </View>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Smart Spending Tip</Text>
            <Text style={styles.insightText}>
              You're spending 31% more on dining this month. Consider cooking at
              home 2-3 times a week to save €200+
            </Text>
          </View>
        </View>

        <View style={styles.insightCard}>
          <View style={styles.insightIcon}>
            <Ionicons name="trophy" size={24} color="#FFD700" />
          </View>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Goal Achievement</Text>
            <Text style={styles.insightText}>
              You're 80% towards your concert tickets goal! Just €80 more to
              reach it.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8DC", // Light gold background
  },
  header: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#FFD700", // Solid gold background instead of gradient
  },
  profileSection: {
    width: "50%",
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
  userName: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 0,
  },
  headerIcon: {
    padding: 5,
  },
  spendingOverview: {
    paddingHorizontal: 20,
    marginTop: -10,
    marginBottom: 20,
  },
  spendingCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  spendingTitle: {
    color: "#666",
    fontSize: 14,
    marginBottom: 8,
  },
  spendingAmount: {
    color: "#333",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 15,
  },
  budgetInfo: {
    gap: 10,
  },
  budgetText: {
    color: "#666",
    fontSize: 14,
  },
  progressBarContainer: {
    marginTop: 5,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: "#F5F5F5",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    color: "#2C1810", // Dark brown for better contrast on light gold background
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
    color: "#2C1810", // Dark brown for better contrast
    fontSize: 12,
    textAlign: "center",
    fontWeight: "600",
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    width: (width - 56) / 2,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryPercentage: {
    color: "#2C1810", // Dark brown for better contrast
    fontSize: 12,
    fontWeight: "700",
  },
  categoryName: {
    color: "#2C1810", // Dark brown for better contrast
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  categoryAmount: {
    color: "#1A1A1A", // Very dark for strong contrast
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  goalsContainer: {
    marginBottom: 25,
    paddingLeft: 20, // Add left padding to align with other sections
  },
  goalsScroll: {
    flexDirection: "row",
    paddingLeft: 0, // Remove extra padding since parent has it
    paddingRight: 20,
    gap: 15,
  },
  goalCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    width: 180,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  goalIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  circularProgress: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  goalPercentage: {
    color: "#2C1810", // Dark brown for better contrast
    fontSize: 10,
    fontWeight: "bold",
  },
  goalTitle: {
    color: "#1A1A1A", // Very dark for strong contrast
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 5,
  },
  goalProgress: {
    color: "#555", // Medium dark for good contrast
    fontSize: 12,
    marginBottom: 10,
  },
  goalProgressBar: {
    marginTop: 5,
  },
  activityContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  transactionsList: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  transactionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF8DC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionMerchant: {
    color: "#1A1A1A", // Very dark for strong contrast
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  transactionCategory: {
    color: "#555", // Medium dark for good contrast
    fontSize: 12,
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  transactionDate: {
    color: "#666",
    fontSize: 12,
  },
  insightsContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  insightCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF8DC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  insightText: {
    color: "#666",
    fontSize: 12,
    lineHeight: 16,
  },
});

export default Page;
