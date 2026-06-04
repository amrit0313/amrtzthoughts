import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || `input-${label.replace(/\s+/g, '-').toLowerCase()}`;

    return (
      <div className="relative w-full pb-5">
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            placeholder=" "
            className={cn(
              'peer w-full border-b border-gray-300 bg-transparent px-0 py-2 pt-5 text-sm text-black placeholder-transparent focus:border-black focus:outline-none transition-colors',
              className
            )}
            {...props}
          />
          <label
            htmlFor={inputId}
            className="absolute left-0 top-1 text-xs text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs peer-focus:text-black"
          >
            {label}
          </label>
        </div>
        {error && (
          <p className="absolute bottom-0 left-0 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
