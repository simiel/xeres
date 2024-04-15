import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import React from 'react';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { BlurView } from 'expo-blur';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const Page = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [firstName, setFirstName] = React.useState(user?.firstName);
  const [lastName, setLastName] = React.useState(user?.lastName);
  const [edit, setEdit] = React.useState(false);

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

      {/* Add logout */}
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
});
