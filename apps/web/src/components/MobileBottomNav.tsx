import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Crown, Key, ShoppingBag, Headphones } from 'lucide-react';
import { useCart } from '../context/CartContext.js';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { itemCount } = useCart();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Ranks', path: '/ranks', icon: Crown },
    { label: 'Keys', path: '/crate-keys', icon: Key },
    { label: 'Cart', path: '/cart', icon: ShoppingBag, isCart: true },
    { label: 'Support', path: '/support', icon: Headphones },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0d0d14]/95 backdrop-blur-lg border-t border-[#252535] px-2 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          if (item.isCart) {
            return (
              <Link
                key={item.label}
                to="/cart"
                className={`flex flex-col items-center justify-center relative py-1 px-3 transition-colors ${
                  active ? 'text-gold' : 'text-[#8c8c9e] hover:text-white'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5 text-gold" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2.5 w-4 h-4 rounded-full bg-gold text-brand-bg text-[10px] font-extrabold flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium mt-1 text-gold">Cart</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-3 transition-colors ${
                active ? 'text-gold' : 'text-[#8c8c9e] hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
