import { Alert, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { Link, useLocalSearchParams } from 'expo-router';
import {
  isClerkAPIResponseError,
  useSignIn,
  useSignUp,
} from '@clerk/clerk-expo';
import { defaultStyles } from '@/constants/Styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import Colors from '@/constants/Colors';

const CELL_COUNT = 6;

const Page = () => {
  const { phone, signin } = useLocalSearchParams<{
    phone: string;
    signin: string;
  }>();
  const [code, setCode] = React.useState('');
  const { signIn } = useSignIn();
  const { signUp, setActive } = useSignUp();

  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });

  useEffect(() => {
    if (code.length === 6) {
      if (signin === 'true') {
        verifySignIn();
      } else {
        verifyCode();
      }
    }
  }, [code]);

  const verifyCode = async () => {
    try {
      await signUp?.attemptPhoneNumberVerification({ code });

      await setActive!({ session: signUp!.createdSessionId });
    } catch (error) {
      console.error('error', JSON.stringify(error, null, 2));

      if (isClerkAPIResponseError(error)) {
        Alert.alert('Error', error.errors[0].message);
      }
    }
  };
  const verifySignIn = async () => {
    try {
      await signIn?.attemptFirstFactor({ strategy: 'phone_code', code });

      await setActive!({ session: signIn!.createdSessionId });
    } catch (error) {}
  };
  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.header}>6-digit code</Text>
      <Text style={defaultStyles.descriptionText}>
        Code sent to {phone} unless you already have an account
      </Text>

      <CodeField
        ref={ref}
        {...props}
        value={code}
        onChangeText={setCode}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType='number-pad'
        textContentType='oneTimeCode'
        renderCell={({ index, symbol, isFocused }) => (
          <>
            <View
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
            >
              <Text style={styles.cellText}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
            {index === 2 && <View style={styles.seperator} />}
          </>
        )}
      />

      <Link href={'/login'} replace asChild>
        <TouchableOpacity>
          <Text style={defaultStyles.textLink}>
            Already have an account? Log in
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  codeFieldRoot: {
    marginVertical: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    gap: 12,
  },
  cell: {
    width: 45,
    height: 60,
    lineHeight: 38,
    justifyContent: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
  },
  focusCell: {
    borderColor: '#000',
  },
  textLink: {
    color: '#007AFF',
    fontSize: 16,
    marginTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  seperator: {
    width: 10,
    height: 2,
    backgroundColor: '#00000030',
    alignSelf: 'center',
  },
  cellText: {
    color: '#000',
    fontSize: 24,
    textAlign: 'center',
  },
});
