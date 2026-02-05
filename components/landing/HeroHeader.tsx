'use client';

import { useState, MouseEvent } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Logo = () => (
  <div className="flex items-center space-x-2">
    <div className="w-8 h-8 bg-[#1a1a2e] rounded-lg flex items-center justify-center">
      <span className="text-white font-bold text-sm">T</span>
    </div>
    <span className="text-xl font-semibold text-foreground">TalentFlow</span>
  </div>
);

interface MenuItem {
  name: string;
  href: string;
}

const menuItems: MenuItem[] = [
  { name: 'Hero', href: '#hero' },
  { name: 'Features', href: '#features' },
  { name: 'About', href: '#about' },
];

export function HeroHeader() {
  const [menuState, setMenuState] = useState(false);

  const handleSmoothScroll = (
    e: MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    setMenuState(false);

    if (href === '#hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const headerHeight = 80;
      const targetPosition = targetElement.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header className="w-full bg-background border-b border-border/40">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" aria-label="home">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <ul className="flex gap-8 text-sm">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    onClick={(e) => handleSmoothScroll(e, item.href)}
                    className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button asChild variant="outline" size="sm" className="rounded-lg">
              <Link href="/dashboard">Login</Link>
            </Button>
            <Button asChild size="sm" className="rounded-lg bg-[#1a1a2e] hover:bg-[#2a2a3e]">
              <Link href="/dashboard">Sign Up</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuState(!menuState)}
            aria-label={menuState ? 'Close Menu' : 'Open Menu'}
            className="lg:hidden p-2"
          >
            {menuState ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuState && (
          <div className="lg:hidden py-4 border-t border-border/40">
            <ul className="space-y-4">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    onClick={(e) => handleSmoothScroll(e, item.href)}
                    className="text-muted-foreground hover:text-foreground block py-2"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border/40">
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard">Login</Link>
              </Button>
              <Button asChild className="w-full bg-[#1a1a2e] hover:bg-[#2a2a3e]">
                <Link href="/dashboard">Sign Up</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
