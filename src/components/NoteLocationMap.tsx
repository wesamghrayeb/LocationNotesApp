import React, { useMemo, useState } from 'react';
import {
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import {
  buildOpenStreetMapUrl,
  buildSingleNoteMapHtml,
  OSM_ATTRIBUTION,
} from '../utils/leafletMapHtml';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type NoteLocationMapProps = {
  latitude: number;
  longitude: number;
  title?: string;
};

export const NoteLocationMap = ({
  latitude,
  longitude,
  title,
}: NoteLocationMapProps) => {
  const [hasError, setHasError] = useState(false);
  const mapHtml = useMemo(
    () => buildSingleNoteMapHtml(latitude, longitude, title),
    [latitude, longitude, title],
  );

  const coordinateLabel = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

  if (hasError) {
    return (
      <View style={styles.container}>
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Map unavailable</Text>
          <Text style={styles.errorText}>Could not load the map.</Text>
        </View>
        <MapFooter
          coordinateLabel={coordinateLabel}
          onOpenInBrowser={() =>
            Linking.openURL(buildOpenStreetMapUrl(latitude, longitude)).catch(
              () => undefined,
            )
          }
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        source={{ html: mapHtml }}
        style={styles.webview}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        nestedScrollEnabled
        setSupportMultipleWindows={false}
        onError={() => setHasError(true)}
        onHttpError={() => setHasError(true)}
      />
      <MapFooter
        coordinateLabel={coordinateLabel}
        onOpenInBrowser={() =>
          Linking.openURL(buildOpenStreetMapUrl(latitude, longitude)).catch(
            () => undefined,
          )
        }
      />
    </View>
  );
};

type MapFooterProps = {
  coordinateLabel: string;
  onOpenInBrowser: () => void;
};

const MapFooter = ({ coordinateLabel, onOpenInBrowser }: MapFooterProps) => (
  <View style={styles.footer}>
    <Text style={styles.footerCoords}>{coordinateLabel}</Text>
    <Pressable
      onPress={onOpenInBrowser}
      accessibilityRole="link"
      accessibilityLabel="Open location in OpenStreetMap browser">
      <Text style={styles.footerLink}>Open in browser</Text>
    </Pressable>
    <Text style={styles.attribution}>
      {OSM_ATTRIBUTION.replace('&copy;', '©')}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 280,
    borderRadius: spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  webview: {
    flex: 1,
    minHeight: 220,
    backgroundColor: colors.background,
  },
  footer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
    gap: spacing.xs,
  },
  footerCoords: {
    color: colors.text,
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  footerLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  attribution: {
    color: colors.textMuted,
    fontSize: 11,
  },
  errorBox: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  errorTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  errorText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});
