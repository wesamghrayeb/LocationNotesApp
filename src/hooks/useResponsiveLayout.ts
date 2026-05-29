import { useWindowDimensions } from 'react-native';
import { breakpoints, contentMaxWidth } from '../theme/layout';
import { spacing } from '../theme/spacing';

export const useResponsiveLayout = () => {
  const { width } = useWindowDimensions();

  const isTablet = width >= breakpoints.tablet;
  const isLargeTablet = width >= breakpoints.largeTablet;
  const columns = isLargeTablet ? 3 : isTablet ? 2 : 1;

  const maxContentWidth = isLargeTablet
    ? contentMaxWidth.largeTablet
    : isTablet
      ? contentMaxWidth.tablet
      : width;

  const horizontalPadding = isTablet ? spacing.xxl : spacing.lg;
  const cardGap = isTablet ? spacing.lg : spacing.md;

  return {
    width,
    isTablet,
    isLargeTablet,
    columns,
    maxContentWidth,
    horizontalPadding,
    cardGap,
  };
};
