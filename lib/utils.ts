import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateRoomId(): string {
  // Generate 8 random characters (letters and numbers)
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  
  // Format as XXXX-XXXX
  return `${result.slice(0, 4)}-${result.slice(4)}`;
}

export function formatRoomId(id: string): string {
  // Convert to uppercase and remove any non-alphanumeric characters
  const clean = id.toUpperCase().replace(/[^0-9A-Z]/g, '');
  
  // Add formatting
  if (clean.length >= 8) {
    return `${clean.slice(0, 4)}-${clean.slice(4, 8)}`;
  }
  
  return clean;
}

// Array of visually distinct colors for users
const userColors = [
  '#FF6B6B', // coral red
  '#4ECDC4', // turquoise
  '#45B7D1', // sky blue
  '#96CEB4', // sage
  '#FFEEAD', // cream
  '#D4A5A5', // dusty rose
  '#9B59B6', // purple
  '#3498DB', // blue
  '#E67E22', // orange
  '#27AE60', // green
];

export function getUserColor(userId: string): string {
  // Use the sum of character codes to get a consistent index
  const sum = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return userColors[sum % userColors.length];
}
