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
    <View>
      {currencies.data?.map((currency: Currency) => (
        <View key={currency.id} style={{ flexDirection: 'row' }}>
          <Image
            source={{ uri: data?.[currency.id].logo }}
            style={{ width: 64, height: 64 }}
          />
          <Text>{currency.name}</Text>
        </View>
      ))}
    </View>
  );
};
export default Page;
