import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout').then((m) => m.MainLayout),

    children: [
      // {
      //   path: '',
      //   redirectTo: 'dashboard',
      //   pathMatch: 'full',
      // },
      {
        path: '',
        loadComponent: () =>
          import('./shared/components/dashboard/dashboard').then((m) => m.Dashboard),
      },

      // Finance Categories Menu
      {
        path: 'emi-calculator',
        loadComponent: () => import('./features//calculators/emi/emi').then((m) => m.Emi),
      },
      {
        path: 'income-tax-calculator',
        loadComponent: () =>
          import('./features//calculators/income-tax/income-tax').then((m) => m.IncomeTax),
      },
      {
        path: 'paycheck-calculator',
        loadComponent: () =>
          import('./features//calculators/paycheck/paycheck').then((m) => m.Paycheck),
      },
      {
        path: 'mortgage-calculator',
        loadComponent: () =>
          import('./features//calculators/mortgage/mortgage').then((m) => m.Mortgage),
      },
      {
        path: 'jewellery-calculator',
        loadComponent: () =>
          import('./features//calculators/jewellery/jewellery').then((m) => m.Jewellery),
      },
      {
        path: 'compound-interest-calculator',
        loadComponent: () =>
          import('./features//calculators/compound-interest/compound-interest').then(
            (m) => m.CompoundInterest,
          ),
      },
      {
        path: 'loan-calculator',
        loadComponent: () => import('./features//calculators/loan/loan').then((m) => m.Loan),
      },
      

      // Business Categories Menu
      {
        path: 'profit-calculator',
        loadComponent: () => import('./features//calculators/profit/profit').then((m) => m.Profit),
      },

      // Math Categories Menu
      {
        path: 'percentage-calculator',
        loadComponent: () =>
          import('./features//calculators/percentage/percentage').then((m) => m.Percentage),
      },
      {
        path: 'scientific-calculator',
        loadComponent: () =>
          import('./features//calculators/scientific/scientific').then((m) => m.Scientific),
      },

      //Education Categories Menu
      {
        path: 'cgpa-calculator',
        loadComponent: () => import('./features//calculators/cgpa/cgpa').then((m) => m.Cgpa),
      },

      // Health Categories Menu
      {
        path: 'calorie-calculator',
        loadComponent: () =>
          import('./features//calculators/calorie/calorie').then((m) => m.Calorie),
      },
      {
        path: 'age-calculator',
        loadComponent: () => import('./features/calculators/age/age').then((m) => m.Age),
      },

      {
        path: 'bmi-calculator',
        loadComponent: () => import('./features//calculators/bmi/bmi').then((m) => m.Bmi),
      },
  {
      path: 'savings-goal-calculator',
      loadComponent: () =>
        import('./features/calculators/savings-goal/savings-goal')
          .then((m) => m.SavingsGoal),
    },
  {
      path: 'discount-calculator',
      loadComponent: () =>
        import('./features/calculators/discount/discount').then((m) => m.Discount),
    },
      // Footer Company Pages Links
      {
        path: 'blog',
        loadComponent: () => import('./features/pages/blog/blog').then((m) => m.Blog),
      },
      {
        path: 'about',
        loadComponent: () => import('./features/pages/about/about').then((m) => m.About),
      },
      {
        path: 'contact',
        loadComponent: () => import('./features/pages/contact/contact').then((m) => m.Contact),
      },
      {
        path: 'faq',
        loadComponent: () => import('./features/pages/faq/faq').then((m) => m.Faq),
      },

      //Footer Legal Pages Links
      {
        path: 'privacy-policy',
        loadComponent: () => import('./features/pages/privacy/privacy').then((m) => m.Privacy),
      },
      {
        path: 'terms-and-conditions',
        loadComponent: () => import('./features/pages/terms/terms').then((m) => m.Terms),
      },
      {
        path: 'cookie',
        loadComponent: () => import('./features/pages/cookie/cookie').then((m) => m.Cookie),
      },
      {
        path: 'disclaimer',
        loadComponent: () =>
          import('./features/pages/disclaimer/disclaimer').then((m) => m.Disclaimer),
      },
    ],
  },
];
