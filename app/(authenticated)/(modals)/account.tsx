import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { BlurView } from 'expo-blur';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getAppIcon, setAppIcon } from 'expo-dynamic-app-icon';

const ICONS = [
  {
    name: 'Default',
    icon: require('@/assets/images/icon.png'),
  },
  {
    name: 'Dark',
    icon: require('@/assets/images/icon-dark.png'),
  },
  {
    name: 'Vivid',
    icon: require('@/assets/images/icon-vivid.png'),
  },
];

const Page = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [firstName, setFirstName] = React.useState(user?.firstName);
  const [lastName, setLastName] = React.useState(user?.lastName);
  const [edit, setEdit] = React.useState(false);

  const [activeIcon, setActiveIcon] = React.useState('Default');

  useEffect(() => {
    const getIcon = async () => {
      const icon = getAppIcon();
      console.log('🚀 ~ getIcon ~ icon:', activeIcon);
      setActiveIcon(icon);
    };
    getIcon();
  }, []);

  const onSaveUser = async () => {
    try {
      await user?.update({
        firstName: firstName!,
        lastName: lastName!,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setEdit(false);
    }
  };

  const onGetImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
      base64: true,
    });
    if (!result.canceled) {
      const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
      user?.setProfileImage({
        file: base64,
      });
    }
  };

  const onChangeIcon = async (icon: string) => {
    console.log('🚀 ~ onChangeIcon ~ icon:', icon);
    setAppIcon(icon.toLocaleLowerCase());
    setActiveIcon(icon);
  };

  return (
    <BlurView
      intensity={70}
      tint='dark'
      style={{ backgroundColor: 'rgba(0,0,0,.5)', flex: 1 }}
    >
      <View style={{ alignItems: 'center', marginTop: 200 }}>
        <TouchableOpacity style={styles.captureBtn} onPress={onGetImage}>
          {user && (
            <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
          )}
        </TouchableOpacity>

        {!edit && (
          <View style={styles.editRow}>
            <Text>
              {lastName} {firstName}
            </Text>
            <TouchableOpacity onPress={() => setEdit(true)}>
              <Ionicons name='create' size={24} color='black' />
            </TouchableOpacity>
          </View>
        )}

        {edit && (
          <View style={styles.editRow}>
            <TextInput
              value={lastName!}
              onChangeText={setLastName}
              style={styles.input}
            />
            <TextInput
              value={firstName!}
              onChangeText={setFirstName}
              style={styles.input}
            />

            <TouchableOpacity onPress={onSaveUser}>
              <Ionicons name='save' size={24} color='black' />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.btn} onPress={() => signOut}>
          <Ionicons name='log-out' size={24} color='white' />
          <Text style={styles.actionText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Ionicons name='person' size={24} color='white' />
          <Text style={styles.actionText}>Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Ionicons name='bulb' size={24} color='white' />
          <Text style={styles.actionText}>Learn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Ionicons name='megaphone' size={24} color='white' />
          <Text style={styles.actionText}>Inbox</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        {ICONS.map((icon) => (
          <TouchableOpacity
            key={icon.name}
            style={styles.btn}
            onPress={() => onChangeIcon(icon.name)}
          >
            <Image source={icon.icon} style={{ height: 20, width: 20 }} />
            <Text style={styles.actionText}>{icon.name}</Text>
            {activeIcon.toLowerCase() === icon.name.toLowerCase() && (
              <Ionicons name='checkmark' size={24} color={'#fff'} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </BlurView>
  );
};

export default Page;

const styles = StyleSheet.create({
  captureBtn: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 100,
    height: 40,
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  actions: {
    backgroundColor: 'rgba(256, 256, 256, 0.1)',
    borderRadius: 16,
    gap: 0,
    margin: 20,
  },
  btn: {
    padding: 14,
    flexDirection: 'row',
    gap: 20,
  },
  actionText: {
    color: 'white',
    fontSize: 18,
  },
});
