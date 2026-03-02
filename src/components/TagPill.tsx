interface TagPillProps {
  name: string;
  color?: string;
  onClick?: () => void;
  selected?: boolean;
}

export function TagPill({ name, color = '#10B981', onClick, selected }: TagPillProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all ${
        selected 
          ? 'bg-primary text-white ring-2 ring-primary/50' 
          : 'text-white hover:opacity-80'
      }`}
      style={{ backgroundColor: selected ? undefined : color }}
    >
      {name}
    </button>
  );
}