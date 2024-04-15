import { SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import React from 'react';
import { BlurView } from 'expo-blur';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

const CustomHeader = () => {
  const { top } = useSafeAreaInsets();

  return (
    <BlurView intensity={80} tint='extraLight' style={{ paddingTop: top }}>
      <View style={[styles.container]}>
        <Link href={'/(authenticated)/(modals)/account'}>
          <TouchableOpacity style={[styles.roundBtn]}>
            <Text style={[{ color: 'white', fontSize: 16, fontWeight: '500' }]}>
              SM
            </Text>
          </TouchableOpacity>
        </Link>
        <View style={styles.searchSection}>
          <Ionicons name='search' size={20} style={styles.searchIcon} />
          <TextInput style={styles.input} placeholder='Search' />
        </View>
        <View style={styles.circle}>
          <Ionicons name='stats-chart' size={20} color={'black'} />
        </View>
        <View style={styles.circle}>
          <Ionicons name='card' size={20} color={'black'} />
        </View>
      </View>
    </BlurView>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    gap: 10,
    paddingHorizontal: 20,
  },
  roundBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: Colors.lightGray,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: { padding: 10 },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
