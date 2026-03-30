const AVATAR_BACKGROUNDS = [
  '#c9922a33', '#9FE1CB33', '#B5D4F433', '#F4C0D133',
  '#C0DD9733', '#F5C4B333', '#CECBF633', '#D3D1C733'
];

const AVATAR_COLORS = [
  '#e8b84b', '#5ba3e8', '#7cc94a', '#e87a4a',
  '#a0d060', '#e8b84b', '#c0b8f0', '#a09d93'
];

const TIER_CLASSES = {
  champion: 'bc',
  supporter: 'bs',
  neutral: 'bn',
  skeptic: 'bk',
};

const TIER_LABELS = {
  champion: 'Champion',
  supporter: 'Supporter',
  neutral: 'Neutral',
  skeptic: 'Skeptic',
};

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase();
}

export function getAvatarStyle(id: string): Record<string, string> {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % 8;
  return {
    background: AVATAR_BACKGROUNDS[index],
    color: AVATAR_COLORS[index],
    border: `0.5px solid ${AVATAR_COLORS[index]}40`,
  };
}

export function getTierBadgeClass(tier: string): string {
  return TIER_CLASSES[tier as keyof typeof TIER_CLASSES] || 'bn';
}

export function getTierLabel(tier: string): string {
  return TIER_LABELS[tier as keyof typeof TIER_LABELS] || 'Neutral';
}
