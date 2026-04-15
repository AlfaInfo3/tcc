import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface BubblyInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  helpText?: string;
  icon?: React.ReactNode;
}

export function BubblyInput({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = true,
  helpText,
  icon,
}: BubblyInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-foreground">{label}</label>
      <div className="relative">
        <input
          type={inputType}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="input-duo pr-12"
        />
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {helpText && (
        <p className="text-xs text-muted-foreground font-medium">{helpText}</p>
      )}
    </div>
  );
}

interface BubblyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  fullWidth?: boolean;
}

const variantStyles: Record<string, string> = {
  primary: 'bg-primary text-white border-primary-dark hover:bg-primary/90',
  secondary: 'bg-secondary text-white border-secondary-dark hover:bg-secondary/90',
  danger: 'bg-danger text-white border-danger-dark hover:bg-danger/90',
  outline: 'bg-white text-foreground border-border hover:bg-muted',
};

export function BubblyButton({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
  fullWidth = true,
}: BubblyButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        btn-duo ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''}
        py-4 px-6 text-base font-bold rounded-2xl border-b-4
        transition-all duration-150 active:translate-y-1 active:border-b-0 active:shadow-none
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0
        min-h-[56px]
        ${className}
      `}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Carregando...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
