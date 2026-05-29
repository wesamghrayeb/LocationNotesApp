import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NotesStackParamList } from '../navigation/NotesStack';
import { NoteLocationMap } from '../components/NoteLocationMap';
import { LocationPinIcon } from '../components/icons/AppIcons';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';
import { formatDate } from '../utils/formatDate';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = NativeStackScreenProps<NotesStackParamList, 'NoteDetails'>;

export const NoteDetailsScreen = ({ route }: Props) => {
  const { note } = route.params;
  const { maxContentWidth, horizontalPadding, isTablet } = useResponsiveLayout();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          paddingHorizontal: horizontalPadding,
          maxWidth: maxContentWidth,
          alignSelf: 'center',
          width: '100%',
        },
      ]}
      showsVerticalScrollIndicator={false}>
      <View style={styles.metaCard}>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.date}>{formatDate(note.createdAt)}</Text>
        {!!note.content && <Text style={styles.body}>{note.content}</Text>}

        <View style={styles.coordsChip}>
          <LocationPinIcon size={16} color={colors.primary} />
          <Text style={styles.coords}>
            {note.location.latitude.toFixed(6)},{' '}
            {note.location.longitude.toFixed(6)}
          </Text>
        </View>
      </View>

      <View style={[styles.mapWrap, isTablet && styles.mapWrapTablet]}>
        <NoteLocationMap
          latitude={note.location.latitude}
          longitude={note.location.longitude}
          title={note.title}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
  metaCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: spacing.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
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
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
  },
  date: {
    color: colors.textMuted,
    marginTop: spacing.xs,
    fontSize: 14,
  },
  body: {
    color: colors.text,
    marginTop: spacing.lg,
    fontSize: 16,
    lineHeight: 24,
  },
  coordsChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: spacing.md,
    alignSelf: 'flex-start',
  },
  coords: {
    color: colors.primaryDark,
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '500',
  },
  mapWrap: {
    flex: 1,
    minHeight: 280,
    borderRadius: spacing.lg,
    overflow: 'hidden',
  },
  mapWrapTablet: {
    minHeight: 420,
  },
});
