import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from "../ui/button";
import { LogOut, UserIcon, X, Menu } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

interface HeaderProps {
  size?: { width: number; height: number };
}

export default function Header({ size = { width: 150, height: 50 } }: HeaderProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const commonLinkClasses = "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200";
  const mobileLinkClasses = "block px-4 py-2 text-sm";

  const renderNavLinks = () => {
    if (status === "authenticated") {
      if (session.user?.role === "NUTRITIONIST") {
        return (
          <>
            <Link href="/dashboard" className={commonLinkClasses}>Dashboard</Link>
            <Link href="/dashboard/clients" className={commonLinkClasses}>Clientes</Link>
            <Link href="/anamnesis" className={commonLinkClasses}>Anamnese</Link>
            <Link href="/evaluations" className={commonLinkClasses}>Avaliações</Link>
            <Link href="/diets" className={commonLinkClasses}>Dietas</Link>
            <Link href="/reports" className={commonLinkClasses}>Relatórios</Link>
            <Link href="/dashboard/profile" className={commonLinkClasses}>Meu Perfil</Link>
            <Button variant="ghost" onClick={() => signOut()} className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
              <LogOut className="h-4 w-4 mr-2" /> Sair
            </Button>
          </>
        );
      } else if (session.user.role === "CLIENT") {
        return (
          <>
            <Link href="/dashboard/patient" className={commonLinkClasses}>Dashboard</Link>
            <Link href="/dashboard/patient/evaluations" className={commonLinkClasses}>Minhas Avaliações</Link>
            <Link href="/dashboard/patient/diets" className={commonLinkClasses}>Minhas Dietas</Link>
            <Link href="/dashboard/patient/evolution" className={commonLinkClasses}>Minha Evolução</Link>
            <Link href="/dashboard/patient/profile" className={commonLinkClasses}>Meu Perfil</Link>
            <Button variant="ghost" onClick={() => signOut()} className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
              <LogOut className="h-4 w-4 mr-2" /> Sair
            </Button>
          </>
        );
      }
    } else if (status === "unauthenticated") {
      return (
                <Link href="/login" className={commonLinkClasses}>
          <UserIcon className="h-4 w-4 mr-2" />Login
                  </Link>
      );
    }
    return null;
  };

  const renderMobileNavLinks = () => {
    if (status === "authenticated") {
      if (session.user?.role === "NUTRITIONIST") {
        return (
          <>
            <Link href="/dashboard" className={mobileLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
            <Link href="/dashboard/clients" className={mobileLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>Clientes</Link>
            <Link href="/anamnesis" className={mobileLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>Anamnese</Link>
            <Link href="/evaluations" className={mobileLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>Avaliações</Link>
            <Link href="/diets" className={mobileLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>Dietas</Link>
            <Link href="/reports" className={mobileLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>Relatórios</Link>
            <Link href="/dashboard/profile" className={mobileLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>Meu Perfil</Link>
            <Button variant="ghost" onClick={() => { signOut(); setIsMobileMenuOpen(false); }} className="w-full justify-start text-sm">
              <LogOut className="h-4 w-4 mr-2" /> Sair
            </Button>
          </>
        );
      } else if (session.user?.role === "CLIENT") {
        return (
          <>
            <Link href="/dashboard/patient" className={mobileLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
            <Link href="/dashboard/patient/evaluations" className={mobileLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>Minhas Avaliações</Link>
            <Link href="/dashboard/patient/diets" className={mobileLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>Minhas Dietas</Link>
            <Link href="/dashboard/patient/evolution" className={mobileLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>Minha Evolução</Link>
            <Link href="/dashboard/patient/profile" className={mobileLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>Meu Perfil</Link>
            <Button variant="ghost" onClick={() => { signOut(); setIsMobileMenuOpen(false); }} className="w-full justify-start text-sm">
              <LogOut className="h-4 w-4 mr-2" /> Sair
            </Button>
          </>
        );
      }
    } else if (status === "unauthenticated") {
      return (
        <Link
          href="/login"
          className={mobileLinkClasses}
                    onClick={() => setIsMobileMenuOpen(false)}>
          <UserIcon className="h-4 w-4 mr-2" />Login
                  </Link>
      );
    }
    return null;
  };

  return (
    <header style={headerStyle} className="w-full shadow-md">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/">
          <Image
            src="/assets/logo.png"
            alt="Logo Nutri Xpert Pro"
            width={size.width}
            height={size.height}
            style={{ objectFit: 'contain' }}
            priority
            className="rounded-lg"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 items-center">
          {renderNavLinks()}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
          >
            {isMobileMenuOpen ? (
              <X className="w-8 h-8" />
            ) : (
              <Menu className="w-8 h-8" />
            )}
          </button>
        </div>
      </nav>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-100 dark:bg-gray-800 py-4 px-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
          {renderMobileNavLinks()}
        </div>
      )}
    </header>
  );
}
