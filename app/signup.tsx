import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { Link, useRouter } from 'expo-router';
import { isClerkAPIResponseError, useSignUp } from '@clerk/clerk-expo';

const Page = () => {
  const router = useRouter();
  const [countryCode, setCountryCode] = useState('+233');
  const [phoneNumber, setPhoneNumber] = useState('');
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 90 : 0;
  const { signUp } = useSignUp();

  const onSignup = async () => {
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    try {
      console.log('🚀 ~ onSignup ~ fullPhoneNumber:', fullPhoneNumber);

      await signUp!.create({
        phoneNumber: fullPhoneNumber,
      });

      signUp!.preparePhoneNumberVerification();

      router.push({
        pathname: '/verify/[phone]',
        params: { phone: fullPhoneNumber },
      });
    } catch (error) {
      console.log('Error signing up:', error);
      if (isClerkAPIResponseError(error)) {
        console.log('Error signing up:', error.errors[0].message);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior='padding'
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Let's get started</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter your phone number and we will send a confirmation code here
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            value={countryCode}
            onChangeText={setCountryCode}
            style={styles.input}
            placeholder='Enter your phone number'
            keyboardType='phone-pad'
          />
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={[styles.input, { flex: 1 }]}
            placeholder='Enter your phone number'
            placeholderTextColor={Colors.gray}
            keyboardType='phone-pad'
            //   add dismis key
            enterKeyHint='done'
          />
        </View>

        <Link href={'/login'} replace asChild style={{ marginBottom: 20 }}>
          <TouchableOpacity>
            <Text style={defaultStyles.textLink}>
              Already have an account? Log in
            </Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            phoneNumber ? styles.enabled : styles.disabled,
            { marginTop: 'auto' },
          ]}
          onPress={onSignup}
          disabled={!phoneNumber}
        >
          <Text style={defaultStyles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    marginVertical: 40,
    gap: 10,
  },
  input: {
    backgroundColor: Colors.lightGray,
    padding: 20,
    borderRadius: 16,
    fontSize: 20,
  },
  enabled: {
    backgroundColor: Colors.primary,
  },
  disabled: {
    backgroundColor: Colors.primaryMuted,
  },
});

export default Page;
