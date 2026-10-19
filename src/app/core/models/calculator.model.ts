export interface Calculator {
  name: string;
  description: string;
  category: string;
  icon: string;
  iconBg: string;
  route: string;
  popular?: boolean;
}

export const CALCULATORS: Calculator[] = [
  // FINANCE
  {
    name: 'Income Tax Calculator',
    description: 'Calculate your income tax quickly and easily.',
    category: 'Finance',
    icon: '💰',
    iconBg: '#eef6ff',
    route: '/income-tax-calculator',
    popular: true,
  },
  {
  name: 'Savings Goal Calculator',
  description: 'Calculate how much you need to save each month and how long it will take to reach your savings goal.',
  category: 'Finance',
  icon: '🎯',
  iconBg: '#eff6ff',
  route: '/savings-goal-calculator',
  popular: true,
},

{
  name: 'Discount Calculator',
  description:
    'Calculate your discount amount, final sale price, and savings with optional VAT.',
  category: 'Finance',
  icon: '🏷️',
  iconBg: '#fff1f0',
  route: '/discount-calculator',
  popular: true,
},

  {
    name: 'Paycheck Calculator',
    description: 'Estimate your take-home pay after deductions.',
    category: 'Finance',
    icon: '💵',
    iconBg: '#ecfdf5',
    route: '/paycheck-calculator',
    popular: true,
  },
  {
    name: 'Mortgage Calculator',
    description: 'Calculate monthly mortgage payments.',
    category: 'Finance',
    icon: '🏠',
    iconBg: '#fff7ed',
    route: '/mortgage-calculator',
    popular: true,
  },
  {
    name: 'Loan Calculator',
    description: 'Calculate loan payments and interest.',
    category: 'Finance',
    icon: '🏦',
    iconBg: '#f5f3ff',
    route: '/loan-calculator',
    popular: true,
  },
  {
    name: 'EMI Calculator',
    description: 'Calculate monthly EMI, interest, and total loan payment.',
    category: 'Finance',
    icon: '💰',
    iconBg: '#f5f3ff',
    route: '/emi-calculator',
    popular: true,
  },
  {
    name: 'Jewellery Calculator',
    description: 'Calculate jewellery prices based on weight, purity, and current rates.',
    category: 'Finance',
    icon: '💎',
    iconBg: '#fdf2f8',
    route: '/jewellery-calculator',
    popular: true,
  },


  // MATH
  {
    name: 'Percentage Calculator',
    description: 'Calculate percentages, increases and decreases.',
    category: 'Math',
    icon: '%',
    iconBg: '#f0fdf4',
    route: '/percentage-calculator',
  },

  {
    name: 'Scientific Calculator',
    description: 'Perform advanced mathematical calculations.',
    category: 'Math',
    icon: '∑',
    iconBg: '#eff6ff',
    route: '/scientific-calculator',
  },
  // {
  //   name: 'Fraction Calculator',
  //   description: 'Add, subtract, multiply and divide fractions.',
  //   category: 'Math',
  //   icon: '½',
  //   iconBg: '#fefce8',
  //   route: '/calculators/fraction',
  // },
  // {
  //   name: 'Average Calculator',
  //   description: 'Calculate average and mean values.',
  //   category: 'Math',
  //   icon: 'x̄',
  //   iconBg: '#fdf2f8',
  //   route: '/calculators/average',
  // },

  // HEALTH
  {
    name: 'BMI Calculator',
    description: 'Calculate your Body Mass Index.',
    category: 'Health',
    icon: '⚖',
    iconBg: '#ecfdf5',
    route: '/bmi-calculator',
  },
  // {
  //   name: 'BMR Calculator',
  //   description: 'Calculate your Basal Metabolic Rate.',
  //   category: 'Health',
  //   icon: '🔥',
  //   iconBg: '#fff7ed',
  //   route: '/calculators/bmr',
  // },
  {
    name: 'Calorie Calculator',
    description: 'Estimate your daily calorie requirements.',
    category: 'Health',
    icon: '🍎',
    iconBg: '#fef2f2',
    route: '/calorie-calculator',
  },
  {
    name: 'Age Calculator',
    description: 'Calculate your exact age from your birth date.',
    category: 'Health',
    icon: '🎂',
    iconBg: '#fdf4ff',
    route: '/age-calculator',
  },

  // DATE & TIME
  // {
  //   name: 'Date Calculator',
  //   description: 'Calculate the difference between dates.',
  //   category: 'Date & Time',
  //   icon: '📅',
  //   iconBg: '#eff6ff',
  //   route: '/calculators/date',
  // },
  // {
  //   name: 'Time Calculator',
  //   description: 'Add and subtract hours, minutes and seconds.',
  //   category: 'Date & Time',
  //   icon: '⏱',
  //   iconBg: '#f0fdf4',
  //   route: '/calculators/time',
  // },
  // {
  //   name: 'Countdown Calculator',
  //   description: 'Calculate the time remaining until a date.',
  //   category: 'Date & Time',
  //   icon: '⌛',
  //   iconBg: '#fff7ed',
  //   route: '/calculators/countdown',
  // },
  // {
  //   name: 'Time Zone Calculator',
  //   description: 'Convert time between different time zones.',
  //   category: 'Date & Time',
  //   icon: '🌎',
  //   iconBg: '#f5f3ff',
  //   route: '/calculators/time-zone',
  // },

  // CONVERTERS
  // {
  //   name: 'Unit Converter',
  //   description: 'Convert length, weight, volume and more.',
  //   category: 'Converters',
  //   icon: '🔄',
  //   iconBg: '#eff6ff',
  //   route: '/calculators/unit-converter',
  // },
  // {
  //   name: 'Currency Converter',
  //   description: 'Convert currencies quickly and easily.',
  //   category: 'Converters',
  //   icon: '💱',
  //   iconBg: '#ecfdf5',
  //   route: '/calculators/currency',
  // },
  // {
  //   name: 'Temperature Converter',
  //   description: 'Convert Celsius, Fahrenheit and Kelvin.',
  //   category: 'Converters',
  //   icon: '🌡',
  //   iconBg: '#fff7ed',
  //   route: '/calculators/temperature',
  // },
  // {
  //   name: 'Length Converter',
  //   description: 'Convert different units of length.',
  //   category: 'Converters',
  //   icon: '📏',
  //   iconBg: '#fefce8',
  //   route: '/calculators/length',
  // },

  // EVERYDAY
  // {
  //   name: 'Discount Calculator',
  //   description: 'Calculate discounts and final prices.',
  //   category: 'Everyday',
  //   icon: '🏷',
  //   iconBg: '#fdf2f8',
  //   route: '/calculators/discount',
  // },
  // {
  //   name: 'Tip Calculator',
  //   description: 'Calculate tips and split bills.',
  //   category: 'Everyday',
  //   icon: '🍽',
  //   iconBg: '#f0fdf4',
  //   route: '/calculators/tip',
  // },
  // {
  //   name: 'Fuel Cost Calculator',
  //   description: 'Estimate your fuel and travel costs.',
  //   category: 'Everyday',
  //   icon: '⛽',
  //   iconBg: '#fff7ed',
  //   route: '/calculators/fuel-cost',
  // },
  // {
  //   name: 'GPA Calculator',
  //   description: 'Calculate your GPA and grade average.',
  //   category: 'Everyday',
  //   icon: '🎓',
  //   iconBg: '#eff6ff',
  //   route: '/calculators/gpa',
  // },

  // STATISTICS
  // {
  //   name: 'Statistics Calculator',
  //   description: 'Calculate mean, median and standard deviation.',
  //   category: 'Statistics',
  //   icon: '📊',
  //   iconBg: '#eff6ff',
  //   route: '/calculators/statistics',
  // },
  // {
  //   name: 'Probability Calculator',
  //   description: 'Calculate probability and statistical outcomes.',
  //   category: 'Statistics',
  //   icon: '🎲',
  //   iconBg: '#f5f3ff',
  //   route: '/calculators/probability',
  // },

  // BUSINESS
  {
    name: 'Profit Margin Calculator',
    description: 'Calculate profit margins and markup.',
    category: 'Business',
    icon: '📈',
    iconBg: '#ecfdf5',
    route: '/profit-calculator',
  },
  // {
  //   name: 'ROI Calculator',
  //   description: 'Calculate return on investment.',
  //   category: 'Business',
  //   icon: '💼',
  //   iconBg: '#eff6ff',
  //   route: '/calculators/roi',
  // },
  {
    name: 'CGPA Calculator',
    description: 'Calculate your CGPA and overall academic performance.',
    category: 'Education',
    icon: '🎓',
    iconBg: '#eff6ff',
    route: '/cgpa-calculator',
    popular: true,
  },
];
