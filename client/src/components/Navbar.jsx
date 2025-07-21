import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Building, Users, CreditCard } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/properties', label: 'Properties', icon: Building },
    { path: '/tenants', label: 'Tenants', icon: Users },
    { path: '/payments', label: 'Payments', icon: CreditCard }
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Building className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">RentRoll</span>
          </div>
          
          <div className="hidden md:flex space-x-8">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === path
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
          
          <div className="md:hidden">
            <select
              value={location.pathname}
              onChange={(e) => window.location.href = e.target.value}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              {navItems.map(({ path, label }) => (
                <option key={path} value={path}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;