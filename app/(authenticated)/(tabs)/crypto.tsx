import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Currency } from '@/interfaces/crypto';
import { Link } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';

const Page = () => {
  const headerHeight = useHeaderHeight();

  const currencies = useQuery({
    queryKey: ['listings'],
    queryFn: () => fetch('/api/listings').then((res) => res.json()),
  });

  const ids = currencies.data
    ?.map((currency: Currency) => currency.id)
    .join(',');

  const { data } = useQuery({
    queryKey: ['info', ids],
    queryFn: () => fetch(`/api/info?ids=${ids}`).then((res) => res.json()),
    enabled: !!ids,
  });

  return (
    <ScrollView
      style={[{ paddingTop: headerHeight, backgroundColor: Colors.background }]}
    >
      <Text style={defaultStyles.sectionHeader}>Latest GHS Crypto</Text>
      <View style={defaultStyles.block}>
        {currencies.data?.map((currency: Currency) => (
          <Link key={currency.id} href={`/crypto/${currency.id}`} asChild>
            <TouchableOpacity
              key={currency.id}
              style={{ flexDirection: 'row' }}
            >
              <Image
                source={{ uri: data?.[currency.id].logo }}
                style={{ width: 40, height: 40 }}
              />
              <View
                style={{ flexDirection: 'column', marginLeft: 10, flex: 1 }}
              >
                <Text style={{ fontWeight: '600', color: Colors.dark }}>
                  {currency.name}
                </Text>
                <Text style={{ color: Colors.gray }}>{currency.symbol}</Text>
              </View>

              <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
                <Text style={{ color: Colors.dark, fontWeight: '600' }}>
                  {Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'GHS',
                  }).format(currency.quote.GHS.price)}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons
                    name={
                      currency.quote.GHS.percent_change_24h > 0
                        ? 'arrow-up'
                        : 'arrow-down'
                    }
                    size={16}
                    color={
                      currency.quote.GHS.percent_change_24h > 0
                        ? 'green'
                        : 'red'
                    }
                  />
                  <Text style={{ color: Colors.gray }}>
                    {currency.quote.GHS.percent_change_24h.toFixed(2)}%
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
};
export default Page;
