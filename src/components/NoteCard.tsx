import React from 'react';
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { LocationPinIcon, TrashIcon } from './icons/AppIcons';
import { IconButton } from './IconButton';
import { Note } from '../features/notes/notesTypes';
import { formatDate } from '../utils/formatDate';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type NoteCardProps = {
  note: Note;
  onPress: () => void;
  onDelete: () => void;
  style?: StyleProp<ViewStyle>;
};

export const NoteCard = ({ note, onPress, onDelete, style }: NoteCardProps) => {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`Open note ${note.title}`}
          style={({ pressed }) => [
            styles.titleBlock,
            pressed && styles.pressed,
          ]}>
          <Text style={styles.title} numberOfLines={2}>
            {note.title}
          </Text>
          <Text style={styles.date}>{formatDate(note.createdAt)}</Text>
        </Pressable>
        <IconButton
          onPress={onDelete}
          variant="danger"
          size={40}
          accessibilityLabel={`Delete ${note.title}`}
          icon={<TrashIcon size={18} color={colors.danger} />}
        />
      </View>

      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Open note ${note.title}`}
        style={({ pressed }) => [styles.body, pressed && styles.pressed]}>
        {!!note.content && (
          <Text numberOfLines={3} style={styles.content}>
            {note.content}
          </Text>
        )}

        <View style={styles.locationRow}>
          <LocationPinIcon size={14} color={colors.primary} />
          <Text style={styles.coords} numberOfLines={1}>
            {note.location.latitude.toFixed(5)},{' '}
            {note.location.longitude.toFixed(5)}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
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
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
  },
  body: {
    marginTop: spacing.xs,
  },
  pressed: {
    opacity: 0.88,
  },
  title: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 17,
    lineHeight: 22,
  },
  date: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  content: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 21,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  coords: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});
