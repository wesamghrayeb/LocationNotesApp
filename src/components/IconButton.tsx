import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type IconButtonProps = {
  onPress: () => void;
  icon: React.ReactNode;
  accessibilityLabel: string;
  variant?: 'default' | 'danger' | 'ghost' | 'primary';
  size?: number;
  style?: ViewStyle;
  disabled?: boolean;
};

const variantStyles = {
  default: {
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  danger: {
    backgroundColor: colors.dangerLight,
    borderColor: '#FECACA',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  primary: {
    backgroundColor: colors.primaryLight,
    borderColor: '#BBDEFB',
  },
} as const;

export const IconButton = ({
  onPress,
  icon,
  accessibilityLabel,
  variant = 'default',
  size = spacing.touchTarget,
  style,
  disabled = false,
}: IconButtonProps) => {
  const palette = variantStyles[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      style={({ pressed }) => [
        styles.base,
        {
          width: size,
          height: size,
          backgroundColor: palette.backgroundColor,
          borderColor: palette.borderColor,
          opacity: disabled ? 0.45 : pressed ? 0.72 : 1,
        },
        style,
      ]}>
      <View pointerEvents="none">{icon}</View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: spacing.md,
    borderWidth: 1,
  },
});
