import React from 'react';
import { StyleSheet, View } from 'react-native';

type IconProps = {
  size?: number;
  color?: string;
};

export const TrashIcon = ({ size = 20, color = '#D32F2F' }: IconProps) => {
  const handleWidth = size * 0.42;
  const lidWidth = size * 0.72;
  const binWidth = size * 0.62;
  const binHeight = size * 0.52;
  const stroke = Math.max(1.5, size * 0.09);

  return (
    <View style={[styles.root, { width: size, height: size }]}>
      <View
        style={{
          width: handleWidth,
          height: stroke,
          backgroundColor: color,
          borderRadius: stroke,
          marginBottom: stroke * 0.8,
        }}
      />
      <View
        style={{
          width: lidWidth,
          height: stroke * 1.4,
          backgroundColor: color,
          borderRadius: stroke * 0.6,
          marginBottom: stroke * 0.6,
        }}
      />
      <View
        style={{
          width: binWidth,
          height: binHeight,
          borderWidth: stroke,
          borderColor: color,
          borderTopWidth: 0,
          borderBottomLeftRadius: stroke * 1.2,
          borderBottomRightRadius: stroke * 1.2,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'flex-start',
          paddingTop: stroke * 1.2,
        }}>
        <View
          style={{
            width: stroke * 0.75,
            height: binHeight * 0.55,
            backgroundColor: color,
            borderRadius: 1,
          }}
        />
        <View
          style={{
            width: stroke * 0.75,
            height: binHeight * 0.55,
            backgroundColor: color,
            borderRadius: 1,
          }}
        />
      </View>
    </View>
  );
};

export const LocationPinIcon = ({ size = 16, color = '#1E88E5' }: IconProps) => {
  const pinSize = size * 0.72;
  const dot = Math.max(2, size * 0.18);

  return (
    <View style={[styles.root, { width: size, height: size }]}>
      <View
        style={{
          width: pinSize,
          height: pinSize,
          borderRadius: pinSize / 2,
          borderBottomRightRadius: 2,
          backgroundColor: color,
          transform: [{ rotate: '45deg' }],
          marginTop: size * 0.08,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: dot,
          height: dot,
          borderRadius: dot / 2,
          backgroundColor: '#FFFFFF',
          top: size * 0.28,
        }}
      />
    </View>
  );
};

export const LogOutIcon = ({ size = 20, color = '#1E88E5' }: IconProps) => {
  const stroke = Math.max(1.8, size * 0.1);
  const doorWidth = size * 0.38;
  const doorHeight = size * 0.72;

  return (
    <View style={[styles.root, { width: size, height: size }]}>
      <View
        style={{
          position: 'absolute',
          left: 0,
          width: doorWidth,
          height: doorHeight,
          borderWidth: stroke,
          borderColor: color,
          borderRightWidth: 0,
          borderRadius: stroke,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: doorWidth * 0.55,
          top: size * 0.46,
          width: size * 0.48,
          height: stroke,
          backgroundColor: color,
          borderRadius: stroke,
        }}
      />
      <View
        style={{
          position: 'absolute',
          right: 0,
          top: size * 0.34,
          width: size * 0.22,
          height: size * 0.22,
          borderTopWidth: stroke,
          borderRightWidth: stroke,
          borderColor: color,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </View>
  );
};

export const ListIcon = ({ size = 22, color = '#6B7280' }: IconProps) => {
  const lineHeight = Math.max(2, size * 0.11);
  const lineWidth = size * 0.78;

  return (
    <View
      style={[
        styles.root,
        styles.listLines,
        { width: size, height: size, gap: size * 0.18 },
      ]}>
      {[0, 1, 2].map(key => (
        <View
          key={key}
          style={{
            width: lineWidth,
            height: lineHeight,
            backgroundColor: color,
            borderRadius: lineHeight,
          }}
        />
      ))}
    </View>
  );
};

export const PlusIcon = ({ size = 22, color = '#6B7280' }: IconProps) => {
  const stroke = Math.max(2, size * 0.11);
  const barLength = size * 0.62;

  return (
    <View style={[styles.root, { width: size, height: size }]}>
      <View
        style={{
          position: 'absolute',
          width: barLength,
          height: stroke,
          backgroundColor: color,
          borderRadius: stroke,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: stroke,
          height: barLength,
          backgroundColor: color,
          borderRadius: stroke,
        }}
      />
    </View>
  );
};

export const MapIcon = ({ size = 22, color = '#6B7280' }: IconProps) => {
  const stroke = Math.max(1.8, size * 0.09);
  const frameWidth = size * 0.82;
  const frameHeight = size * 0.72;

  return (
    <View style={[styles.root, { width: size, height: size }]}>
      <View
        style={{
          width: frameWidth,
          height: frameHeight,
          borderWidth: stroke,
          borderColor: color,
          borderRadius: stroke * 0.8,
          overflow: 'hidden',
          backgroundColor: '#E3F2FD',
        }}>
        <View
          style={{
            position: 'absolute',
            left: frameWidth * 0.18,
            top: frameHeight * 0.22,
            width: stroke * 0.9,
            height: frameHeight * 0.42,
            backgroundColor: color,
            opacity: 0.35,
            transform: [{ rotate: '18deg' }],
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: frameWidth * 0.42,
            top: frameHeight * 0.34,
            width: stroke * 1.4,
            height: stroke * 1.4,
            borderRadius: stroke * 0.7,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
};

export const NoteEmptyIcon = ({ size = 56, color = '#1E88E5' }: IconProps) => {
  const stroke = Math.max(2, size * 0.04);

  return (
    <View
      style={[
        styles.root,
        {
          width: size,
          height: size * 1.15,
          borderWidth: stroke,
          borderColor: color,
          borderRadius: size * 0.12,
          backgroundColor: '#E3F2FD',
          padding: size * 0.18,
          gap: size * 0.1,
        },
      ]}>
      {[0.55, 0.75, 0.45].map((w, i) => (
        <View
          key={i}
          style={{
            width: `${w * 100}%`,
            height: stroke * 1.2,
            backgroundColor: color,
            opacity: 0.35 + i * 0.15,
            borderRadius: stroke,
          }}
        />
      ))}
      <LocationPinIcon size={size * 0.38} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  listLines: {
    flexDirection: 'column',
  },
});
