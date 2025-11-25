import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

interface TopNavigationBarProps {
  className?: string;
}

const TopNavigationBar = ({ className = '' }: TopNavigationBarProps) => {
  const location = useLocation();

  const navigationItems = [
    {
      label: 'Create',
      path: '/create',
      icon: 'Plus',
    },
    {
      label: 'List All',
      path: '/list-all',
      icon: 'List',
    },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] bg-card border-b border-border ${className}`}
    >
      <nav className="flex items-center h-[60px] px-4 md:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 mr-8 transition-opacity duration-micro hover:opacity-80"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
          >
            <rect
              x="4"
              y="4"
              width="24"
              height="24"
              rx="4"
              fill="var(--color-primary)"
            />
            <path
              d="M12 10h8v2h-8v-2zm0 4h8v2h-8v-2zm0 4h5v2h-5v-2z"
              fill="var(--color-primary-foreground)"
            />
            <circle
              cx="22"
              cy="22"
              r="6"
              fill="var(--color-accent)"
            />
            <path
              d="M22 19v6m-3-3h6"
              stroke="var(--color-accent-foreground)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-lg font-semibold text-foreground hidden sm:inline">
            File Canvas Processor
          </span>
        </Link>

        <div className="flex items-center gap-1 ml-auto">
          {navigationItems.map((item) => {
            const isActive = isActivePath(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-md
                  font-medium text-sm transition-all duration-micro
                  min-h-[44px] min-w-[44px]
                  ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  }
                `}
              >
                <Icon name={item.icon} size={18} />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
};

export default TopNavigationBar;