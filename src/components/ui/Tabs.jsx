import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../lib/utils';

const Tabs = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('relative w-full', className)}
    {...props}
  />
));
Tabs.displayName = 'Tabs';

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
      className
    )}
    {...props}
  />
));
TabsList.displayName = 'TabsList';

const TabsTrigger = React.forwardRef(({ className, active, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300',
      active
        ? 'bg-white text-gray-950 shadow-sm dark:bg-gray-950 dark:text-gray-50'
        : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50',
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = React.forwardRef(({ className, active, ...props }, ref) => (
  <div
    ref={ref}
    role="tabpanel"
    className={cn(
      'mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300',
      !active && 'hidden',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = 'TabsContent';

Tabs.propTypes = {
  className: PropTypes.string,
};

TabsList.propTypes = {
  className: PropTypes.string,
};

TabsTrigger.propTypes = {
  className: PropTypes.string,
  active: PropTypes.bool,
};

TabsContent.propTypes = {
  className: PropTypes.string,
  active: PropTypes.bool,
};

export { Tabs, TabsList, TabsTrigger, TabsContent };