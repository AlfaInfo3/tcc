import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
export interface HugeIconProps extends Omit<React.ComponentProps<typeof HugeiconsIcon>, 'icon'> {
  icon: React.ComponentProps<typeof HugeiconsIcon>['icon'];
  size?: number | string;
  className?: string;
  strokeWidth?: number;
  color?: string;
}

/**
 * Standard Hugeicons wrapper for the project.
 * Provides crisp 24x24 pixel-perfect stroke icons with customizable size and Tailwind className.
 */
export function HugeIcon({
  icon,
  size = 20,
  className = '',
  strokeWidth = 1.5,
  color = 'currentColor',
  ...props
}: HugeIconProps) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      className={className}
      strokeWidth={strokeWidth}
      color={color}
      {...props}
    />
  );
}

export default HugeIcon;
