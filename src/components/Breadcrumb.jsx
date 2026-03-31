import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const breadcrumbNames = {
  '/': 'Home',
  '/scanner': 'Component Scanner',
  '/database': 'Toxicity Database',
  '/map': 'Recycler Map',
  '/report': 'Report Hazard',
  '/health': 'Health Hub',
  '/profile': 'My Profile',
  '/about': 'About',
  '/contact': 'Contact',
  '/privacy': 'Privacy Policy',
  '/terms': 'Terms of Service',
  '/accessibility': 'Accessibility',
};

export const Breadcrumb = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  if (pathSegments.length === 0) return null;

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    ...pathSegments.map((segment, index) => {
      const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
      return {
        name: breadcrumbNames[path] || segment.charAt(0).toUpperCase() + segment.slice(1),
        path,
      };
    }),
  ];

  return (
    <nav className="flex items-center space-x-2 px-4 py-3 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto w-full flex items-center space-x-2">
        <Link
          to="/"
          className="text-slate-600 hover:text-emerald-600 transition-colors"
          title="Home"
        >
          <Home className="h-5 w-5" />
        </Link>

        {breadcrumbs.slice(1).map((breadcrumb, index) => (
          <div key={breadcrumb.path} className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4 text-slate-400" />
            {index === breadcrumbs.length - 2 ? (
              <span className="text-sm font-medium text-slate-900">
                {breadcrumb.name}
              </span>
            ) : (
              <Link
                to={breadcrumb.path}
                className="text-sm text-slate-600 hover:text-emerald-600 transition-colors"
              >
                {breadcrumb.name}
              </Link>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};
