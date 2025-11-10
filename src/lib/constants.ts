export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080'

export const ROUTES = {
  HOME: '/',
  CAMERAS: '/cameras',
  MONITORING: '/monitoring',
  RESIDENTS: '/residents',
  VIOLATIONS: '/violations',
  STATISTICS: '/statistics',
  SETTINGS: '/settings',
} as const

export const PERSON_TYPES = {
  resident: { 
    label: 'Cư dân', 
    color: 'bg-green-500',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  guest: { 
    label: 'Khách', 
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200'
  },
  unknown: { 
    label: 'Người lạ', 
    color: 'bg-red-500',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  },
} as const

export const VIOLATION_SEVERITY = {
  low: { 
    label: 'Thấp', 
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50'
  },
  medium: { 
    label: 'Trung bình', 
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    bgColor: 'bg-yellow-50'
  },
  high: { 
    label: 'Cao', 
    color: 'bg-orange-500',
    textColor: 'text-orange-700',
    bgColor: 'bg-orange-50'
  },
  critical: { 
    label: 'Nghiêm trọng', 
    color: 'bg-red-500',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50'
  },
} as const

export const ACTIONS = {
  walking: { label: 'Đi bộ', icon: '' },
  standing: { label: 'Đứng', icon: '' },
  sitting: { label: 'Ngồi', icon: '' },
  running: { label: 'Chạy', icon: '' },
  lying: { label: 'Nằm', icon: '' },
  unknown: { label: 'Không xác định', icon: '' },
} as const
