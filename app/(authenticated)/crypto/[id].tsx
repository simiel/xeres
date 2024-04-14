import {
  Image,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useQuery } from '@tanstack/react-query';
import { defaultStyles } from '@/constants/Styles';

const categories = ['Overview', 'Markets', 'Transactions', 'Holders', 'Social'];

const Page = () => {
  const headerHeight = useHeaderHeight();
  const { id } = useLocalSearchParams();
  const [activeIndex, setActiveIndex] = React.useState(0);

  const { data } = useQuery({
    queryKey: ['logo', id],
    queryFn: async () => {
      const info = await fetch(`/api/info?ids=${id}`).then((res) => res.json());
      //   const logo = info[+id].logo;
      return info[+id];
    },
  });

  return (
    <>
      <Stack.Screen
        options={{
          title: data?.name,
        }}
      />

      <SectionList
        style={{ marginTop: headerHeight }}
        // renderSectionHeader={({ section }) => (
        //     <Text>{section.title}</Text>
        // )}
        keyExtractor={(item, index) => item.title}
        sections={[{ data: [{ title: 'Hello' }] }]}
        // style={{ paddingTop: headerHeight }}
        scrollEnabled={true}
        ListHeaderComponent={() => (
          <>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 16,
              }}
            >
              <Text style={styles.subtitle}>{data?.symbol}</Text>
              <Image
                source={{ uri: data?.logo }}
                style={{ width: 60, height: 60, borderRadius: 32 }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                gap: 12,
                margin: 12,
              }}
            >
              <TouchableOpacity
                style={[
                  defaultStyles.pillButtonSmall,
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: Colors.primary,
                  },
                ]}
              >
                <Ionicons name='add' size={24} color={'white'} />
                <Text style={{ color: 'white' }}>Add to Watchlist</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  defaultStyles.pillButtonSmall,
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: Colors.primaryMuted,
                  },
                ]}
              >
                <Ionicons
                  name='share-outline'
                  size={24}
                  color={Colors.primary}
                />
                <Text style={{ color: Colors.primary }}>Share</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        contentInsetAdjustmentBehavior='automatic'
        renderSectionHeader={() => (
          <ScrollView
            horizontal
            contentContainerStyle={{
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              paddingHorizontal: 16,
              paddingBottom: 8,
              backgroundColor: Colors.background,
              borderBottomColor: Colors.lightGray,
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          >
            {categories.map((category, index) => (
              <TouchableOpacity
                key={category}
                style={
                  activeIndex === index
                    ? styles.categoriesBtnActive
                    : styles.categoriesBtn
                }
                onPress={() => setActiveIndex(index)}
              >
                <Text
                  style={
                    activeIndex === index
                      ? styles.categoryTextActive
                      : styles.categoryText
                  }
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        renderItem={({ item }) => <></>}
      ></SectionList>
    </>
  );
};

export default Page;

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 24,
    color: Colors.dark,
  },
  categoryText: {
    fontSize: 18,
    color: Colors.gray,
  },
  categoryTextActive: {
    fontSize: 18,
    color: '#000',
  },
  categoriesBtn: {
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesBtnActive: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
