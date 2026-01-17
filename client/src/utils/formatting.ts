/**
 * Format a number to 3 significant figures
 * @param num - The number to format
 * @returns Formatted string with 3 significant figures
 */
export const formatToSignificantFigures = (num: number, sigFigs: number = 3): string => {
  if (num === 0) return '0';

  // Handle very small numbers (scientific notation)
  if (Math.abs(num) < 0.001) {
    return num.toExponential(sigFigs - 1);
  }

  // Calculate the number of decimal places needed for sig figs
  const magnitude = Math.floor(Math.log10(Math.abs(num)));
  const decimals = Math.max(0, sigFigs - magnitude - 1);

  return num.toFixed(decimals);
};

/**
 * Format a price with proper rounding to 3 significant figures
 * @param price - The price value
 * @param unit - The unit (e.g., '/mo', '/hr', '/req')
 * @returns Formatted price string
 */
export const formatPrice = (price: number, unit: string = ''): string => {
  if (price === 0) return `Free`;

  // For very small prices (less than a cent), show per million or use scientific notation
  if (price < 0.001) {
    // Check if per million makes sense
    const perMillion = price * 1000000;
    if (perMillion >= 0.01) {
      return `$${formatToSignificantFigures(perMillion)}/1M`;
    }
    return `$${formatToSignificantFigures(price)}${unit}`;
  }

  // For prices less than $1, show with appropriate precision
  if (price < 1) {
    return `$${formatToSignificantFigures(price)}${unit}`;
  }

  // For prices $1 and above
  return `$${formatToSignificantFigures(price)}${unit}`;
};

/**
 * Format cost for display in service cards and nodes
 * @param cost - The cost value
 * @returns Formatted cost string with appropriate unit
 */
export const formatCost = (cost: number): string => {
  if (cost === 0) return 'Free';

  // Hourly costs (typically < $10)
  if (cost < 0.01) {
    const perMillion = cost * 1000000;
    if (perMillion >= 0.01) {
      return `$${formatToSignificantFigures(perMillion)}/1M`;
    }
    return `$${formatToSignificantFigures(cost)}/hr`;
  }

  // Monthly costs (typically displayed in the UI)
  if (cost < 1) {
    return `$${formatToSignificantFigures(cost)}/mo`;
  }

  // Regular prices
  return `$${formatToSignificantFigures(cost)}/mo`;
};
