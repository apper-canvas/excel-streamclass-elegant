import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Header = ({ webinar, participantCount = 0 }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Schedule", href: "/schedule", icon: "Calendar" },
    { name: "Join Room", href: "/join", icon: "LogIn" },
    { name: "Recordings", href: "/recordings", icon: "Video" }
  ];

  const isActive = (href) => {
    if (href === "/" && location.pathname === "/") return true;
    if (href !== "/" && location.pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="bg-background/95 backdrop-blur-lg border-b border-secondary/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Video" className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-display font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  StreamClass
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-body font-medium transition-all duration-200 flex items-center gap-2",
                    isActive(item.href)
                      ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-white border border-secondary/30"
                      : "text-gray-300 hover:text-white hover:bg-surface/50"
                  )}
                >
                  <ApperIcon name={item.icon} size={16} />
                  {item.name}
                </button>
              ))}
            </div>
          </nav>

          {/* Webinar Info & Controls */}
          <div className="flex items-center gap-4">
            {webinar && (
              <div className="hidden md:flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-body font-medium text-white">
                    {webinar.title}
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-2">
                    <ApperIcon name="Users" size={12} />
                    {participantCount} participants
                  </div>
                </div>
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-surface/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary"
              >
                <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-surface/50 backdrop-blur-lg border-t border-secondary/20">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.href);
                  setMobileMenuOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm font-body font-medium transition-all duration-200 flex items-center gap-2",
                  isActive(item.href)
                    ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-white border border-secondary/30"
                    : "text-gray-300 hover:text-white hover:bg-surface/50"
                )}
              >
                <ApperIcon name={item.icon} size={16} />
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;