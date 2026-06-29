import { FileText, Image, Video, Music, Archive, File } from 'lucide-react';
import { FileCategory } from '@/types';

const ICON_MAP: Record<FileCategory, { Icon: React.ElementType; color: string }> = {
  all:      { Icon: File,     color: 'text-gray-400'  },
  document: { Icon: FileText, color: 'text-blue-500'  },
  image:    { Icon: Image,    color: 'text-green-500' },
  video:    { Icon: Video,    color: 'text-purple-500'},
  audio:    { Icon: Music,    color: 'text-pink-500'  },
  archive:  { Icon: Archive,  color: 'text-orange-500'},
  other:    { Icon: File,     color: 'text-gray-400'  },
};

interface Props {
  category: FileCategory;
  size?: 'sm' | 'md' | 'lg';
}

export default function FileIcon({ category, size = 'md' }: Props) {
  const { Icon, color } = ICON_MAP[category] ?? ICON_MAP.other;
  const sizeClass = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }[size];
  return <Icon className={`${sizeClass} ${color}`} />;
}
