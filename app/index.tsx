import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { useAssets } from 'expo-asset';
import { defaultStyles } from '@/constants/Styles';
import { ResizeMode, Video } from 'expo-av';
import Colors from '@/constants/Colors';
import { Link } from 'expo-router';

const Page = () => {
  const [assets] = useAssets([require('@/assets/videos/intro.mp4')]);
  return (
    <View style={styles.container}>
      {assets && (
        <Video
          isMuted
          isLooping
          shouldPlay
          resizeMode={ResizeMode.COVER}
          source={{ uri: assets[0].uri }}
          style={styles.video}
        />
      )}

      <View style={{ marginTop: 40, padding: 20 }}>
        <Text style={styles.header}>Welcome to the App!</Text>
      </View>

      <View style={styles.buttons}>
        <Link
          href={'/login'}
          style={[defaultStyles.pillButton, { backgroundColor: Colors.dark }]}
          asChild
        >
          <TouchableOpacity>
            <Text style={{ color: 'white', fontSize: 22, fontWeight: '500' }}>
              Log in
            </Text>
          </TouchableOpacity>
        </Link>

        <Link
          href={'/signup'}
          style={[defaultStyles.pillButton, { backgroundColor: '#fff' }]}
          asChild
          // replace
        >
          <TouchableOpacity>
            <Text style={{ fontSize: 22, fontWeight: '500' }}>Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  header: {
    fontSize: 40,
    fontWeight: '900',
    color: '#fff',
    textTransform: 'uppercase',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 20,
    marginTop: 'auto',
    marginBottom: 40,
  },
});

export default Page;
