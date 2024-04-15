import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-expo';
import Colors from '@/constants/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as LocalAuthentication from 'expo-local-authentication';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const Page = () => {
  const { user } = useUser();
  const [code, setCode] = React.useState<number[]>([]);
  const [username, setUsername] = React.useState(user?.fullName);
  const codeLength = Array(6).fill(0);
  const router = useRouter();

  const OFFSET = 20;
  const TIME = 80;

  const offset = useSharedValue(0);
  const style = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });

  useEffect(() => {
    if (code.length === 6) {
      if (code.join('') === '123456') {
        console.log('🚀 ~ handleAppStateChange ~ redirecting');
        router.replace('/(authenticated)/(tabs)/home');
      } else {
        offset.value = withSequence(
          withTiming(-OFFSET, { duration: TIME / 2 }),
          withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
          withTiming(0, { duration: TIME / 2 })
        );
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setCode([]);
      }
    }
  }, [code]);

  const numberPress = (number: number) => {
    setCode([...code, number]);
  };

  const facePress = async () => {
    const { success } = await LocalAuthentication.authenticateAsync();
    if (success) {
      router.replace('/(authenticated)/(tabs)/home');
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <Text style={styles.greeting}>Welcome back, {username}</Text>

      <Animated.View style={[styles.codeView, style]}>
        {codeLength.map((_, index) => (
          <View
            key={index}
            style={[
              styles.codeEmpty,
              {
                backgroundColor:
                  code[index] || code[index] === 0
                    ? Colors.primary
                    : Colors.lightGray,
              },
            ]}
          />
        ))}
      </Animated.View>

      <View style={[styles.numbersView]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {[1, 2, 3].map((number) => (
            <TouchableOpacity
              key={number}
              style={styles.numberBtn}
              onPress={() => numberPress(number)}
            >
              <Text>{number}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {[4, 5, 6].map((number) => (
            <TouchableOpacity
              key={number}
              style={styles.numberBtn}
              onPress={() => numberPress(number)}
            >
              <Text>{number}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {[7, 8, 9].map((number) => (
            <TouchableOpacity
              key={number}
              style={styles.numberBtn}
              onPress={() => numberPress(number)}
            >
              <Text>{number}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity style={styles.numberBtn} onPress={facePress}>
            <MaterialCommunityIcons
              name='face-recognition'
              size={24}
              color='black'
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.numberBtn}
            onPress={() => numberPress(0)}
          >
            <Text>0</Text>
          </TouchableOpacity>

          <View style={{ minWidth: 60 }}>
            {code.length > 0 && (
              <TouchableOpacity
                style={styles.numberBtn}
                onPress={() => setCode(code.slice(0, code.length - 1))}
              >
                <MaterialCommunityIcons
                  name='backspace-outline'
                  size={24}
                  color='black'
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Page;

const styles = StyleSheet.create({
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  container: {
    flex: 1,
  },
  codeView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 100,
  },
  codeEmpty: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
    marginHorizontal: 5,
  },
  numbersView: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 100,
    marginHorizontal: 80,
    gap: 60,
  },
  numberBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
