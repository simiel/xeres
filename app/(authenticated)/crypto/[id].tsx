import {
  Image,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useQuery } from '@tanstack/react-query';
import { defaultStyles } from '@/constants/Styles';
import { CartesianChart, Line, useChartPressState } from 'victory-native';
import { Circle, useFont } from '@shopify/react-native-skia';
import { format } from 'date-fns';
import * as Haptics from 'expo-haptics';
import Animated, {
  SharedValue,
  useAnimatedProps,
} from 'react-native-reanimated';

Animated.addWhitelistedNativeProps({ text: true });

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const categories = ['Overview', 'Markets', 'Transactions', 'Holders', 'Social'];

function Tooltip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
  return <Circle cx={x} cy={y} r={8} color={Colors.primary} />;
}

const Page = () => {
  const headerHeight = useHeaderHeight();
  const { id } = useLocalSearchParams();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const font = useFont(require('@/assets/fonts/SpaceMono-Regular.ttf'));
  const { state, isActive } = useChartPressState({ x: 0, y: { price: 0 } });

  useEffect(() => {
    if (isActive) {
      console.log('Pressed on', state, isActive);
      Haptics.selectionAsync();
    }
    console.log('🚀 ~ useEffect ~ isActive:', isActive);
  }, [isActive]);

  const { data } = useQuery({
    queryKey: ['logo', id],
    queryFn: async () => {
      const info = await fetch(`/api/info?ids=${id}`).then((res) => res.json());
      //   const logo = info[+id].logo;
      return info[+id];
    },
  });

  const { data: tickers } = useQuery({
    queryKey: ['tickers'],
    queryFn: async (): Promise<any[]> =>
      fetch(`/api/tickers`).then((res) => res.json()),
  });

  const AnimatedText = useAnimatedProps(() => {
    return {
      text: `GHS ${state.y.price.value.value.toFixed(2)} `,
      defaultValue: `GHS ${state.y.price.value.value.toFixed(2)} `,
    };
  });

  const AnimatedDateText = useAnimatedProps(() => {
    const date = new Date(state.x.value.value);
    return {
      text: `${date.toLocaleDateString()}`,
      defaultValue: `${date.toLocaleDateString()}`,
    };
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
        renderItem={({ item }) => (
          <>
            <View style={[defaultStyles.block, { height: 300 }]}>
              {tickers && (
                <>
                  {!isActive && (
                    <View>
                      <Text
                        style={{
                          fontSize: 30,
                          fontWeight: 'bold',
                          color: Colors.dark,
                        }}
                      >
                        GHS {tickers![tickers!.length - 1].price.toFixed(2)}
                      </Text>
                      <Text style={{ fontSize: 18, color: Colors.gray }}>
                        Today
                      </Text>
                    </View>
                  )}

                  {isActive && (
                    <View>
                      <AnimatedTextInput
                        style={{
                          fontSize: 30,
                          fontWeight: 'bold',
                          color: Colors.dark,
                        }}
                        editable={false}
                        animatedProps={AnimatedText}
                      ></AnimatedTextInput>
                      <AnimatedTextInput
                        style={{
                          fontSize: 30,
                          fontWeight: 'bold',
                          color: Colors.dark,
                        }}
                        editable={false}
                        animatedProps={AnimatedDateText}
                      ></AnimatedTextInput>
                    </View>
                  )}
                  <CartesianChart
                    data={tickers!}
                    chartPressState={state}
                    xKey='timestamp'
                    yKeys={['price']}
                    axisOptions={{
                      font,
                      tickCount: 5,
                      labelOffset: { x: -2, y: 0 },
                      labelColor: Colors.gray,
                      formatYLabel: (v) => `GHS ${v}`,
                      formatXLabel: (ms) => format(new Date(ms), 'MM/yy'),
                    }}
                  >
                    {({ points }) => (
                      <>
                        <Line
                          points={points.price}
                          color={Colors.primary}
                          strokeWidth={3}
                        />
                        {isActive && (
                          <Tooltip
                            x={state.x.position}
                            y={state.y.price.position}
                          />
                        )}
                      </>
                    )}
                  </CartesianChart>
                </>
              )}
            </View>
            <View style={[defaultStyles.block, { marginTop: 20 }]}>
              <Text style={styles.subtitle}>Overview</Text>
              <Text style={{ color: Colors.gray }}>{data?.description}</Text>
            </View>
          </>
        )}
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
