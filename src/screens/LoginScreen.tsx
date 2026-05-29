import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import { AppInput } from '../components/AppInput';
import { AppButton } from '../components/AppButton';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';
import { loginUser } from '../features/auth/authSlice';
import { validateEmail, validatePassword } from '../utils/validators';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(state => state.auth.users);
  const { maxContentWidth, horizontalPadding } = useResponsiveLayout();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onLogin = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    if (emailError || passwordError) {
      setError(emailError ?? passwordError);
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const isValidUser = users.some(
      user => user.email === normalizedEmail && user.password === password,
    );
    if (!isValidUser) {
      setError('Login failed. Please check your email and password.');
      return;
    }

    dispatch(loginUser({ email, password }));
    setError(null);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: horizontalPadding,
            maxWidth: maxContentWidth,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Login</Text>

        <View style={styles.form}>
          <AppInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="name@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <AppInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Your password"
            secureTextEntry
            autoCapitalize="none"
          />
          {!!error && <Text style={styles.errorText}>{error}</Text>}
          <AppButton
            title="Login"
            onPress={onLogin}
            accessibilityLabel="Login button"
          />
          <AppButton
            title="Create Account"
            onPress={() => navigation.navigate('Register')}
            style={styles.secondaryButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  form: {
    backgroundColor: colors.card,
    borderRadius: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  errorText: {
    color: colors.danger,
    marginBottom: spacing.md,
  },
  secondaryButton: {
    marginTop: spacing.md,
    backgroundColor: colors.textMuted,
  },
});
