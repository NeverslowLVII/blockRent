'use client';

type BadgeColors = {
  bg: string;
  text: string;
};

type StatusType = 
  | 'available'
  | 'unavailable'
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'returned'
  | 'completed';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusColors: Record<StatusType, BadgeColors> = {
  available: {
    bg: 'bg-green-100',
    text: 'text-green-800'
  },
  unavailable: {
    bg: 'bg-red-100',
    text: 'text-red-800'
  },
  pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800'
  },
  confirmed: {
    bg: 'bg-blue-100',
    text: 'text-blue-800'
  },
  cancelled: {
    bg: 'bg-red-100', 
    text: 'text-red-800'
  },
  returned: {
    bg: 'bg-purple-100',
    text: 'text-purple-800'
  },
  completed: {
    bg: 'bg-gray-100',
    text: 'text-gray-800'
  }
};

const statusLabels: Record<StatusType, string> = {
  available: 'Disponible',
  unavailable: 'Non disponible',
  pending: 'En attente',
  confirmed: 'Confirmée',
  cancelled: 'Annulée',
  returned: 'Retournée',
  completed: 'Terminée'
};

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const { bg, text } = statusColors[status];
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${bg} ${text} ${className}`}>
      {statusLabels[status]}
    </span>
  );
} 