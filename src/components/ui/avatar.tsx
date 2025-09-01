import * as React from 'react';
import { cn } from '@/lib/utils';

export interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export function Avatar({ className, ...props }: AvatarProps) {
    return <img className={cn('h-16 w-16 rounded-full object-cover', className)} {...props} />;
}
