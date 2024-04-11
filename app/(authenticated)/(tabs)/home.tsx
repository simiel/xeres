import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import Colors from '@/constants/Colors';

const Page = () => {
  const balance = 1000;
  return (
    <ScrollView style={{ backgroundColor: Colors.background }}>
      <View style={styles.account}>
        <Text>{balance}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  account: {
    margin: 80,
    alignItems: 'center',
  },
});

export default Page;
