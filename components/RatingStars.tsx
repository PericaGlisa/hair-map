import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

interface RatingStarsProps {
  rating: number;
  size?: number;
  showDecimal?: boolean;
}

export function RatingStars({ rating, size = 16, showDecimal = false }: RatingStarsProps) {
  const { colors } = useColorScheme();
  
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    star: {
      marginRight: 2,
    },
  });

  return (
    <View style={styles.container}>
      {[...Array(fullStars)].map((_, index) => (
        <Star
          key={`full-${index}`}
          size={size}
          color={colors.accent500}
          fill={colors.accent500}
          style={styles.star}
        />
      ))}
      
      {hasHalfStar && (
        <Star
          size={size}
          color={colors.accent500}
          fill={colors.accent500}
          style={[styles.star, { opacity: 0.5 }]}
        />
      )}
      
      {[...Array(emptyStars)].map((_, index) => (
        <Star
          key={`empty-${index}`}
          size={size}
          color={colors.gray300}
          style={styles.star}
        />
      ))}
    </View>
  );
}