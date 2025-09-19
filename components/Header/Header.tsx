import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface HeaderProps {
  size?: { width: number; height: number };
}

export default function Header({ size = { width: 150, height: 50 } }: HeaderProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const headerStyle = {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: theme === 'dark' ? '#1a202c' : '#f4f4f4',
    transition: 'background-color 0.3s',
  };

  return (
    <header style={headerStyle} className="w-full">
      <Image
        src="/logo.png"
        alt="Logo Nutri Xpert Pro"
        width={size.width}
        height={size.height}
        style={{ objectFit: 'contain' }}
        priority
        className="rounded-lg shadow-md"
      />
    </header>
  );
}
