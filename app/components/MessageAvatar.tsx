'use client';

import CharAvatar from './CharAvatar';

type AvatarProps = {
  charClass?: number | null;
  hairColor?: number | null;
  isAdmin?: boolean;
  userId: string;
  size?: number;
};

export default function MessageAvatar({ charClass, hairColor, isAdmin, userId, size = 36 }: AvatarProps) {
  if (isAdmin) {
    return <CharAvatar size={size} bg="#14161a" fallback="⚙" alt="Soporte" />;
  }
  return (
    <CharAvatar
      size={size}
      charClass={charClass}
      hairColor={hairColor}
      fallback={userId[0]?.toUpperCase() ?? '?'}
      alt={userId}
    />
  );
}
