export interface SeoData {
  title: string;
  description: string;
  canonical: string;
  image?: string;
  type?: string;
}

export const SEO_DATA: Record<string, SeoData> = {
  home: {
    title: 'CaluMetra - Free Online Calculators',
    description:
      'Free online calculators for finance, health, education, math, and everyday calculations.',
    canonical: 'https://calumetra.com/',
    image: 'https://calumetra.com/assets/media/seo/calumetra-og.png',
    type: 'website',
  },

  ageCalculator: {
    title: 'Age Calculator - Calculate Your Exact Age | CaluMetra',
    description:
      'Calculate your exact age in years, months, days, hours, minutes, and seconds with our free online age calculator.',
    canonical: 'https://calumetra.com/age-calculator',
    image: 'https://calumetra.com/assets/media/seo/age-calculator-og.png',
    type: 'website',
  },

  profitCalculator: {
    title: 'Profit Calculator - Calculate Your Business Profit | CaluMetra',
    description:
      'Calculate your business profit, gross profit, and net profit with our free online profit calculator.',
    canonical: 'https://calumetra.com/profit-calculator',
    image: 'https://calumetra.com/assets/media/seo/profit-calculator-og.png',
    type: 'website',
  },

  compoundInterestCalculator: {
    title: 'Compound Interest Calculator - Calculate Compound Interest | CaluMetra',
    description:
      'Calculate compound interest on your investments with our free online compound interest calculator.',
    canonical: 'https://calumetra.com/compound-interest-calculator',
    image: 'https://calumetra.com/assets/media/seo/compound-interest-calculator-og.png',
    type: 'website',
  },

  bmiCalculator: {
    title: 'BMI Calculator - Calculate Your Body Mass Index | CaluMetra',
    description:
      'Calculate your Body Mass Index (BMI) using our free online BMI calculator and understand your BMI category.',
    canonical: 'https://calumetra.com/bmi-calculator',
    image: 'https://calumetra.com/assets/media/seo/bmi-calculator-og.png',
    type: 'website',
  },

  calorieCalculator: {
    title: 'Calorie Calculator - Calculate Daily Calorie Needs | CaluMetra',
    description:
      'Calculate your daily calorie needs based on your age, gender, height, weight, and activity level.',
    canonical: 'https://calumetra.com/calorie-calculator',
    image: 'https://calumetra.com/assets/media/seo/calorie-calculator-og.png',
    type: 'website',
  },

  incomeTaxCalculator: {
    title: 'Income Tax Calculator - Calculate Income Tax | CaluMetra',
    description:
      'Calculate your estimated income tax quickly with our free online income tax calculator.',
    canonical: 'https://calumetra.com/income-tax-calculator',
    image: 'https://calumetra.com/assets/media/seo/income-tax-calculator-og.png',
    type: 'website',
  },

  paycheckCalculator: {
    title: 'Paycheck Calculator - Calculate Take-Home Pay | CaluMetra',
    description:
      'Calculate your estimated paycheck and take-home pay with our free online paycheck calculator.',
    canonical: 'https://calumetra.com/paycheck-calculator',
    image: 'https://calumetra.com/assets/media/seo/paycheck-calculator-og.png',
    type: 'website',
  },

  emiCalculator: {
    title: 'EMI Calculator - Calculate Loan EMI | CaluMetra',
    description:
      'Calculate monthly loan EMI, total interest, and total repayment amount with our free EMI calculator.',
    canonical: 'https://calumetra.com/emi-calculator',
    image: 'https://calumetra.com/assets/media/seo/emi-calculator-og.png',
    type: 'website',
  },

  jewelleryCalculator: {
    title: 'Jewellery Calculator - Calculate Jewellery Price | CaluMetra',
    description:
      'Calculate jewellery prices based on weight, purity, making charges, and other costs.',
    canonical: 'https://calumetra.com/jewellery-calculator',
    image: 'https://calumetra.com/assets/media/seo/jewellery-calculator-og.png',
    type: 'website',
  },

  cgpaCalculator: {
    title: 'CGPA Calculator - Calculate CGPA Easily | CaluMetra',
    description:
      'Calculate your CGPA and grade points quickly with our free online CGPA calculator.',
    canonical: 'https://calumetra.com/cgpa-calculator',
    image: 'https://calumetra.com/assets/media/seo/cgpa-calculator-og.png',
    type: 'website',
  },
savingsGoalCalculator: {
  title: 'Savings Goal Calculator - Plan Your Savings | CaluMetra',
  description:
    'Calculate how much you need to save each month and how long it will take to reach your savings goal with our free online savings goal calculator.',
  canonical: 'https://calumetra.com/savings-goal-calculator',
  image: 'https://calumetra.com/assets/media/seo/savings-goal-calculator-og.png',
  type: 'website',
},
discountCalculator: {
  title: 'Discount Calculator - Calculate Final Price | CaluMetra',
  description:
    'Calculate discount amount, sale price, VAT, and your final price with our free online discount calculator.',
  canonical: 'https://calumetra.com/discount-calculator',
  image: 'https://calumetra.com/assets/media/seo/discount-calculator-og.png',
  type: 'website',
},
  blog: {
    title: 'CaluMetra Blog - Calculator Guides, Tips & Insights',
    description:
      'Explore calculator guides, financial tips, health information, education resources, and useful calculation tips.',
    canonical: 'https://calumetra.com/blog',
    image: 'https://calumetra.com/assets/media/seo/blog-og.png',
    type: 'website',
  },

  about: {
    title: 'About CaluMetra - Free Online Calculators',
    description:
      'Learn about CaluMetra, a free online calculator platform built to make everyday calculations simple and accessible.',
    canonical: 'https://calumetra.com/about',
    image: 'https://calumetra.com/assets/media/seo/calumetra-og.png',
    type: 'website',
  },

  contact: {
    title: 'Contact CaluMetra',
    description: 'Contact the CaluMetra team for questions, feedback, suggestions, or support.',
    canonical: 'https://calumetra.com/contact',
    image: 'https://calumetra.com/assets/media/seo/calumetra-og.png',
    type: 'website',
  },

  privacyPolicy: {
    title: 'Privacy Policy | CaluMetra',
    description:
      'Read the CaluMetra Privacy Policy to understand how information is collected, used, and protected.',
    canonical: 'https://calumetra.com/privacy-policy',
    type: 'website',
  },

  terms: {
    title: 'Terms of Use | CaluMetra',
    description:
      'Read the terms and conditions for using the CaluMetra website and its online calculators.',
    canonical: 'https://calumetra.com/terms',
    type: 'website',
  },

  cookiePolicy: {
    title: 'Cookie Policy | CaluMetra',
    description: 'Learn how CaluMetra uses cookies and similar technologies on its website.',
    canonical: 'https://calumetra.com/cookie-policy',
    type: 'website',
  },

  disclaimer: {
    title: 'Disclaimer | CaluMetra',
    description:
      'Read the CaluMetra disclaimer regarding the information and calculations provided on this website.',
    canonical: 'https://calumetra.com/disclaimer',
    type: 'website',
  },
};
