import { View, Text, ScrollView, StyleSheet, Button } from 'react-native';
import React from 'react';
import Colors from '@/constants/Colors';
import RoundBtn from '@/components/RoundBtn';
import Dropdown from '@/components/Dropdown';

const Page = () => {
  const balance = 1000;

  const onAddMoney = () => {};
  return (
    <ScrollView style={{ backgroundColor: Colors.background }}>
      <View style={styles.account}>
        <View style={styles.row}>
          <Text style={styles.balance}>{balance}</Text>
          <Text style={styles.currency}>GHS</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <RoundBtn title='Deposit' icon='add' onPress={onAddMoney} />
        <RoundBtn title='Exchange' icon='refresh' />
        <RoundBtn title='Details' icon='list' />
        <Dropdown />
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
});

export default Page;
