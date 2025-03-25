import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-br from-primary-light to-primary-light/90 dark:from-primary-dark dark:to-primary-dark/90 text-white shadow-lg shadow-primary-light/20 dark:shadow-primary-dark/20 hover:shadow-xl hover:shadow-primary-light/30 dark:hover:shadow-primary-dark/30 hover:-translate-y-0.5',
        secondary: 'bg-gradient-to-br from-secondary-light to-secondary-light/90 dark:from-secondary-dark dark:to-secondary-dark/90 text-white shadow-lg shadow-secondary-light/20 dark:shadow-secondary-dark/20 hover:shadow-xl hover:shadow-secondary-light/30 dark:hover:shadow-secondary-dark/30 hover:-translate-y-0.5',
        outline: 'border border-gray-300/50 dark:border-gray-600/50 bg-white/5 backdrop-blur-sm hover:bg-gray-100/10 dark:hover:bg-gray-800/10 hover:border-gray-400 dark:hover:border-gray-500',
        ghost: 'hover:bg-gray-100/50 dark:hover:bg-gray-800/50 backdrop-blur-sm hover:shadow-sm',
        link: 'text-primary-light dark:text-primary-dark underline-offset-4 hover:underline decoration-primary-light/30 dark:decoration-primary-dark/30',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-6 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);