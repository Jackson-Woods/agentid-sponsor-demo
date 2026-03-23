import type { AvatarProps } from '@fluentui/react-components';

/**
 * Professional, non-garish color palette for avatar backgrounds.
 */
const AVATAR_COLORS: AvatarProps['color'][] = [
  'dark-red',
  'cranberry',
  'red',
  'pumpkin',
  'peach',
  'marigold',
  'forest',
  'dark-green',
  'teal',
  'blue',
  'royal-blue',
  'cornflower',
  'navy',
  'purple',
  'grape',
  'pink',
  'magenta',
  'plum',
  'lilac',
  'gold',
];

/** Simple deterministic hash from a string. */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/** Returns a deterministic professional color for a given name/id. */
export function getAvatarColor(name: string): AvatarProps['color'] {
  return AVATAR_COLORS[hashString(name) % AVATAR_COLORS.length];
}
