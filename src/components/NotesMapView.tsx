import React, { useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Linking,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { Note } from '../features/notes/notesTypes';
import {
  buildAllNotesMapHtml,
  buildAllNotesOpenStreetMapUrl,
  buildFocusNoteMarkerScript,
  buildRefreshMapScript,
  OSM_ATTRIBUTION,
} from '../utils/leafletMapHtml';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type NotesMapViewProps = {
  notes: Note[];
  onNoteSelect: (note: Note) => void;
  style?: StyleProp<ViewStyle>;
};

type NoteSelectedMessage = {
  type: 'noteSelected';
  noteId: string;
};

const isNoteSelectedMessage = (value: unknown): value is NoteSelectedMessage =>
  typeof value === 'object' &&
  value !== null &&
  'type' in value &&
  (value as NoteSelectedMessage).type === 'noteSelected' &&
  'noteId' in value &&
  typeof (value as NoteSelectedMessage).noteId === 'string';

export const NotesMapView = ({
  notes,
  onNoteSelect,
  style,
}: NotesMapViewProps) => {
  const webViewRef = useRef<WebView>(null);
  const [hasError, setHasError] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const markers = useMemo(
    () =>
      notes.map(note => ({
        id: note.id,
        title: note.title,
        latitude: note.location.latitude,
        longitude: note.location.longitude,
      })),
    [notes],
  );

  const mapHtml = useMemo(() => buildAllNotesMapHtml(markers), [markers]);

  const notesById = useMemo(
    () => new Map(notes.map(note => [note.id, note])),
    [notes],
  );

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const payload: unknown = JSON.parse(event.nativeEvent.data);
      if (!isNoteSelectedMessage(payload)) {
        return;
      }
      const note = notesById.get(payload.noteId);
      if (note) {
        setSelectedNoteId(note.id);
        onNoteSelect(note);
      }
    } catch {
      return;
    }
  };

  const focusNoteOnMap = (noteId: string) => {
    setSelectedNoteId(noteId);
    webViewRef.current?.injectJavaScript(buildFocusNoteMarkerScript(noteId));
  };

  const openInBrowser = () => {
    Linking.openURL(buildAllNotesOpenStreetMapUrl(markers)).catch(() => undefined);
  };

  if (hasError) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Map unavailable</Text>
          <Text style={styles.errorText}>Could not load the map.</Text>
        </View>
        <NotesPicker
          notes={notes}
          selectedNoteId={selectedNoteId}
          onPreview={focusNoteOnMap}
          onOpen={onNoteSelect}
        />
        <MapFooter
          summary={`${notes.length} note${notes.length === 1 ? '' : 's'} on map`}
          onOpenInBrowser={openInBrowser}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.mapArea}>
        <WebView
          ref={webViewRef}
          source={{ html: mapHtml }}
          style={styles.webview}
          originWhitelist={['*']}
          javaScriptEnabled
          domStorageEnabled
          scrollEnabled={false}
          nestedScrollEnabled
          setSupportMultipleWindows={false}
          overScrollMode="never"
          onMessage={handleMessage}
          onError={() => setHasError(true)}
          onHttpError={() => setHasError(true)}
          onLoadEnd={() => {
            webViewRef.current?.injectJavaScript(buildRefreshMapScript());
          }}
        />
      </View>

      <NotesPicker
        notes={notes}
        selectedNoteId={selectedNoteId}
        onPreview={focusNoteOnMap}
        onOpen={onNoteSelect}
      />

      <MapFooter
        summary={`${notes.length} note${notes.length === 1 ? '' : 's'}`}
        onOpenInBrowser={openInBrowser}
      />
    </View>
  );
};

type NotesPickerProps = {
  notes: Note[];
  selectedNoteId: string | null;
  onPreview: (noteId: string) => void;
  onOpen: (note: Note) => void;
};

const NotesPicker = ({
  notes,
  selectedNoteId,
  onPreview,
  onOpen,
}: NotesPickerProps) => (
  <View style={styles.pickerSection}>
    <Text style={styles.pickerTitle}>Notes</Text>
    <FlatList
      data={notes}
      keyExtractor={item => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.pickerList}
      renderItem={({ item, index }) => {
        const isSelected = item.id === selectedNoteId;
        return (
          <View
            style={[
              styles.pickerChip,
              isSelected && styles.pickerChipSelected,
            ]}>
            <Pressable
              onPress={() => onPreview(item.id)}
              accessibilityRole="button"
              accessibilityLabel={`Show ${item.title} on map`}
              style={({ pressed }) => [
                styles.pickerBadgeButton,
                pressed && styles.pickerChipPressed,
              ]}>
              <Text style={styles.pickerBadgeText}>{index + 1}</Text>
            </Pressable>
            <Pressable
              onPress={() => onOpen(item)}
              accessibilityRole="button"
              accessibilityLabel={`Open ${item.title}`}
              style={({ pressed }) => [
                styles.pickerTextWrap,
                pressed && styles.pickerChipPressed,
              ]}>
              <Text style={styles.pickerChipTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.pickerChipAction}>View</Text>
            </Pressable>
          </View>
        );
      }}
    />
  </View>
);

type MapFooterProps = {
  summary: string;
  onOpenInBrowser: () => void;
};

const MapFooter = ({ summary, onOpenInBrowser }: MapFooterProps) => (
  <View style={styles.footer}>
    <Text style={styles.footerSummary}>{summary}</Text>
    <Pressable
      onPress={onOpenInBrowser}
      accessibilityRole="link"
      accessibilityLabel="Open map in OpenStreetMap browser">
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
    borderRadius: spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  mapArea: {
    flex: 1,
    minHeight: 260,
  },
  webview: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pickerSection: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  pickerTitle: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  pickerList: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  pickerChip: {
    width: 188,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    marginRight: spacing.sm,
  },
  pickerChipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  pickerChipPressed: {
    opacity: 0.88,
  },
  pickerBadgeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerBadgeText: {
    color: colors.card,
    fontSize: 12,
    fontWeight: '700',
  },
  pickerTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  pickerChipTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  pickerChipAction: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
    gap: spacing.xs,
  },
  footerSummary: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '500',
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
