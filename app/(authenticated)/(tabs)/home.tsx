import { View, Text, ScrollView, StyleSheet, Button } from 'react-native';
import React from 'react';
import Colors from '@/constants/Colors';
import RoundBtn from '@/components/RoundBtn';
import Dropdown from '@/components/Dropdown';
import { useBalanceStore } from '@/store/balanceStore';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';

const Page = () => {
  const { balance, transactions, runTransaction, clearTransactions } =
    useBalanceStore();

  const onAddMoney = () => {
    runTransaction({
      id: Math.random().toString(),
      // +/- amount
      amount: Math.random() * 1000 * (Math.random() > 0.5 ? 1 : -1),
      title: 'Deposit',
      date: new Date(),
    });
  };
  return (
    <ScrollView style={{ backgroundColor: Colors.background }}>
      <View style={styles.account}>
        <View style={styles.row}>
          <Text style={styles.balance}>{balance().toFixed(2)}</Text>
          <Text style={styles.currency}>GHS</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <RoundBtn title='Deposit' icon='add' onPress={onAddMoney} />
        <RoundBtn title='Exchange' icon='refresh' onPress={clearTransactions} />
        <RoundBtn title='Details' icon='list' />
        <Dropdown />
      </View>

      <Text style={defaultStyles.sectionHeader}> Transactions </Text>
      <View style={styles.transactions}>
        {transactions.length === 0 && <Text>No transactions yet</Text>}
        {transactions
          // .sort((a, b) => b.date.getMilliseconds() - a.date.getMilliseconds())
          // .reverse()
          .map((transaction) => (
            <View key={transaction.id} style={styles.row}>
              {
                <View style={styles.circle}>
                  <Ionicons
                    name={transaction.amount > 0 ? 'add' : 'remove'}
                    size={20}
                  />
                </View>
              }
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '500' }}>{transaction.title}</Text>
                <Text style={{ color: Colors.gray }}>
                  {transaction.date.toLocaleString()}
                </Text>
              </View>
              <Text>
                {/* intl */}
                {Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'GHS',
                }).format(transaction.amount)}
              </Text>
            </View>
          ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  account: {
    margin: 80,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  balance: {
    fontSize: 60,
    fontWeight: 'bold',
  },
  currency: {
    fontSize: 20,
    alignSelf: 'flex-end',
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  transactions: {
    padding: 20,
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 16,
    gap: 20,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Page;
