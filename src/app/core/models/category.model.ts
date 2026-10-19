export interface Category {
  name: string;
  icon: string;
  count: number;
}

export const CATEGORIES: Category[] = [
  {
    name: 'Finance',
    icon: '💰',
    count: 15,
  },
  {
    name: 'Math',
    icon: '🧮',
    count: 12,
  },
  {
    name: 'Health',
    icon: '❤️',
    count: 10,
  },
  {
    name: 'Education',
    icon: '🎓',
    count: 8,
  },
  {
    name: 'Date & Time',
    icon: '📅',
    count: 8,
  },
  {
    name: 'Converters',
    icon: '🔄',
    count: 12,
  },
  {
    name: 'Everyday',
    icon: '🛠',
    count: 15,
  },
  {
    name: 'Statistics',
    icon: '📊',
    count: 8,
  },
  {
    name: 'Business',
    icon: '💼',
    count: 10,
  },
];
