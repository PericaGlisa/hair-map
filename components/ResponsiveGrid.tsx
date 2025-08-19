import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useDeviceDimensions } from '@/hooks/useDeviceDimensions';
import { getGridColumns, getGridItemWidth, getResponsiveSpacing } from '@/constants/Breakpoints';

interface ResponsiveGridProps {
  children: React.ReactNode[];
  spacing?: keyof typeof import('@/constants/Breakpoints').SPACING.md;
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  style?: ViewStyle;
  itemStyle?: ViewStyle;
  renderItem?: (item: React.ReactNode, index: number, itemWidth: number) => React.ReactNode;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  spacing = 'md',
  columns,
  style,
  itemStyle,
  renderItem,
}) => {
  const { screenSize, isTablet, width } = useDeviceDimensions();
  
  const spacingValue = getResponsiveSpacing(spacing, screenSize);
  
  const getColumns = () => {
    if (columns) {
      return columns[screenSize] || columns.md || getGridColumns(screenSize, isTablet);
    }
    return getGridColumns(screenSize, isTablet);
  };
  
  const columnsCount = getColumns();
  // Calculate item width considering that last column doesn't have marginRight
  // Also account for container padding (left + right)
  const containerPadding = getResponsiveSpacing('lg', screenSize) * 2;
  const availableWidth = width - containerPadding;
  const totalSpacing = spacingValue * (columnsCount - 1);
  const itemWidth = (availableWidth - totalSpacing) / columnsCount;
  
  const renderRows = () => {
    const rows = [];
    const childrenArray = React.Children.toArray(children);
    
    for (let i = 0; i < childrenArray.length; i += columnsCount) {
      const rowItems = childrenArray.slice(i, i + columnsCount);
      
      const row = (
        <View
          key={i}
          style={{
            flexDirection: 'row',
            marginBottom: i + columnsCount < childrenArray.length ? spacingValue : 0,
          }}
        >
          {rowItems.map((item, index) => {
            const itemContent = renderItem ? renderItem(item, i + index, itemWidth) : item;
            const isLastInRow = index === rowItems.length - 1;
            
            return (
              <View
                key={i + index}
                style={[
                  {
                    width: itemWidth,
                    marginRight: isLastInRow ? 0 : spacingValue,
                  },
                  itemStyle,
                ]}
              >
                {itemContent}
              </View>
            );
          })}
          
          {/* Fill empty spaces in the last row */}
          {rowItems.length < columnsCount &&
            Array.from({ length: columnsCount - rowItems.length }).map((_, emptyIndex) => (
              <View
                key={`empty-${i}-${emptyIndex}`}
                style={{ width: itemWidth }}
              />
            ))}
        </View>
      );
      
      rows.push(row);
    }
    
    return rows;
  };
  
  return (
    <View style={style}>
      {renderRows()}
    </View>
  );
};

export default ResponsiveGrid;