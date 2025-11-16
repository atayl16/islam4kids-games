interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const sizeClasses = {
  small: 'w-12 h-12',
  medium: 'w-16 h-16',
  large: 'w-24 h-24',
};

const ringSize = {
  small: 'w-12 h-12 border-2',
  medium: 'w-16 h-16 border-4',
  large: 'w-24 h-24 border-[6px]',
};

export function LoadingSpinner({ message = 'Loading...', size = 'medium' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Animated rings */}
        <div className={`absolute inset-0 rounded-full border-emerald-200 border-t-emerald-500 ${ringSize[size]} animate-spin`}></div>
        <div className={`absolute inset-0 rounded-full border-violet-200 border-r-violet-500 ${ringSize[size]} animate-spin`} style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
        <div className={`absolute inset-0 rounded-full border-amber-200 border-b-amber-500 ${ringSize[size]} animate-spin`} style={{ animationDuration: '2s' }}></div>

        {/* Center star */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${size === 'small' ? 'text-xl' : size === 'medium' ? 'text-3xl' : 'text-5xl'} animate-pulse`}>⭐</span>
        </div>
      </div>

      <p className={`mt-4 text-slate-600 font-medium ${size === 'small' ? 'text-sm' : size === 'medium' ? 'text-base' : 'text-lg'}`}>
        {message}
      </p>
    </div>
  );
}
