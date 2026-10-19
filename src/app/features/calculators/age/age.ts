import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, DOCUMENT, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Seo } from '../../../core/services/seo';
import { Meta, Title } from '@angular/platform-browser';

interface AgeResult {
  years: number;
  months: number;
  days: number;
  liveHours: number;
  liveMinutes: number;
  liveSeconds: number;
  totalDays: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-age',
  imports: [FormsModule, CommonModule],
  templateUrl: './age.html',
  styleUrl: './age.scss',
})
export class Age implements OnInit, OnDestroy, AfterViewInit {
  birthDay: string = '';
  birthMonth: string = '';
  birthYear: string = '';

  targetDay: string = '';
  targetMonth: string = '';
  targetYear: string = '';

  errorMessage: string = '';
  age: AgeResult | null = null;
  nextBirthday: { months: number; days: number } | null = null;

  private timerInterval: any = null;

  constructor(
    private titleService: Title, 
    private metaService: Meta,
    private cdr: ChangeDetectorRef ,@Inject(DOCUMENT) private doc: Document,
   
    private seo: Seo,
  ) {}

  ngAfterViewInit() {
    setTimeout(() => {
      document.getElementById('dd')?.focus();
    }, 100);
  }

  ngOnInit() {
    const today = new Date();
    this.targetDay = String(today.getDate()).padStart(2, '0');
    this.targetMonth = String(today.getMonth() + 1).padStart(2, '0');
    this.targetYear = String(today.getFullYear());
    this.setCanonicalURL('https://calumetra.com/age-calculator');
    // this.titleService.setTitle('Exact Age Calculator Online - Job & Admission Age Finder');
    // this.titleService.setTitle('Age Calculator – Exact Age, Job & Admission Age Finder');
    this.metaService.updateTag({
      name: 'description',
      content:'Calculate your exact age in years, months, days, and hours on any specific date. Perfect for government jobs, school admissions, and form filling.',});
    this.seo.setPage('ageCalculator');
  }
setCanonicalURL(url: string) {
    let link: HTMLLinkElement | null = this.doc.querySelector("link[rel='canonical']");
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
  allowOnlyNumbers(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    if (allowedKeys.includes(event.key)) return true;
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  // --- BIRTH DATE HANDLERS ---
  private focusAndMoveCursorToEnd(elementId: string) {
    setTimeout(() => {
      const input = document.getElementById(elementId) as HTMLInputElement;
      if (input) {
        input.focus();
        const len = input.value.length;
        input.setSelectionRange(len, len);
      }
    }, 0);
  }

  // --- BIRTH DATE HANDLERS ---

  handleDayKeyDown(event: KeyboardEvent) {
    if (!this.allowOnlyNumbers(event)) return;
    const input = event.target as HTMLInputElement;

    if (event.key === 'ArrowRight' && input.selectionStart === input.value.length) {
      event.preventDefault(); 
      this.focusAndMoveCursorToEnd('mm');
    }
  }

  onDayInput(event: any) {
    if (this.birthDay && this.birthDay.length >= 2) {
      this.focusAndMoveCursorToEnd('mm');
    }
  }

  handleMonthKeyDown(event: KeyboardEvent) {
    if (!this.allowOnlyNumbers(event)) return;
    const input = event.target as HTMLInputElement;

    if (event.key === 'ArrowLeft' && input.selectionStart === 0) {
      event.preventDefault();
      this.focusAndMoveCursorToEnd('dd');
    } else if (event.key === 'Backspace' && input.value.length === 0) {
      event.preventDefault();
      this.focusAndMoveCursorToEnd('dd');
    } else if (event.key === 'ArrowRight' && input.selectionStart === input.value.length) {
      event.preventDefault();
      this.focusAndMoveCursorToEnd('yyyy');
    }
  }

  onMonthInput(event: any) {
    if (this.birthMonth && this.birthMonth.length >= 2) {
      this.focusAndMoveCursorToEnd('yyyy');
    }
  }

  handleYearKeyDown(event: KeyboardEvent) {
    if (!this.allowOnlyNumbers(event)) return;
    const input = event.target as HTMLInputElement;

    if (event.key === 'ArrowLeft' && input.selectionStart === 0) {
      event.preventDefault();
      this.focusAndMoveCursorToEnd('mm');
    } else if (event.key === 'Backspace' && input.value.length === 0) {
      event.preventDefault();
      this.focusAndMoveCursorToEnd('mm');
    }
  }

  onYearInput(event: any) {}

  // --- TARGET DATE HANDLERS ---

  handleTargetDayKeyDown(event: KeyboardEvent) {
    if (!this.allowOnlyNumbers(event)) return;
    const input = event.target as HTMLInputElement;

    if (event.key === 'ArrowRight' && input.selectionStart === input.value.length) {
      event.preventDefault();
      this.focusAndMoveCursorToEnd('target-mm');
    }
  }

  onTargetDayInput(event: any) {
    if (this.targetDay && this.targetDay.length >= 2) {
      this.focusAndMoveCursorToEnd('target-mm');
    }
  }

  handleTargetMonthKeyDown(event: KeyboardEvent) {
    if (!this.allowOnlyNumbers(event)) return;
    const input = event.target as HTMLInputElement;

    if (event.key === 'ArrowLeft' && input.selectionStart === 0) {
      event.preventDefault();
      this.focusAndMoveCursorToEnd('target-dd');
    } else if (event.key === 'Backspace' && input.value.length === 0) {
      event.preventDefault();
      this.focusAndMoveCursorToEnd('target-dd');
    } else if (event.key === 'ArrowRight' && input.selectionStart === input.value.length) {
      event.preventDefault();
      this.focusAndMoveCursorToEnd('target-yyyy');
    }
  }

  onTargetMonthInput(event: any) {
    if (this.targetMonth && this.targetMonth.length >= 2) {
      this.focusAndMoveCursorToEnd('target-yyyy');
    }
  }

  handleTargetYearKeyDown(event: KeyboardEvent) {
    if (!this.allowOnlyNumbers(event)) return;
    const input = event.target as HTMLInputElement;

    if (event.key === 'ArrowLeft' && input.selectionStart === 0) {
      event.preventDefault();
      this.focusAndMoveCursorToEnd('target-mm');
    } else if (event.key === 'Backspace' && input.value.length === 0) {
      event.preventDefault();
      this.focusAndMoveCursorToEnd('target-mm');
    }
  }

  onTargetYearInput(event: any) {}

  // --- CALCULATION LOGIC ---
  calculateAge() {
    this.errorMessage = '';
    this.age = null;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    const bDay = parseInt(this.birthDay, 10);
    const bMonth = parseInt(this.birthMonth, 10) - 1;
    const bYear = parseInt(this.birthYear, 10);

    const tDay = parseInt(this.targetDay, 10);
    const tMonth = parseInt(this.targetMonth, 10) - 1;
    const tYear = parseInt(this.targetYear, 10);

    if (!bDay || !this.birthMonth || !bYear) {
      this.errorMessage = 'Please enter a valid Date of Birth';
      return;
    }

    const birthDate = new Date(bYear, bMonth, bDay);
    const targetDate = new Date(tYear, tMonth, tDay);

    if (isNaN(birthDate.getTime()) || birthDate.getDate() !== bDay) {
      this.errorMessage = 'Invalid Birth Date entered';
      return;
    }

    if (isNaN(targetDate.getTime()) || targetDate.getDate() !== tDay) {
      this.errorMessage = 'Invalid Target Date entered';
      return;
    }

    if (birthDate > targetDate) {
      this.errorMessage = 'Birth date cannot be after the target date';
      return;
    }

    // প্রথমবার ইনস্ট্যান্ট রান করা
    this.updateLiveAge(birthDate, targetDate);

    // প্রতি ১ সেকেন্ড পরপর ডাটা আপডেট করবে এবং চেঞ্জ ডিটেক্ট করবে
    this.timerInterval = setInterval(() => {
      this.updateLiveAge(birthDate, targetDate);
    }, 1000);

    this.calculateNextBirthday(birthDate, targetDate);
  }

  private updateLiveAge(birthDate: Date, targetDateBase: Date) {
    const now = new Date();

    // জন্ম সময় থেকে বর্তমান আসল সময় (ঘণ্টা, মিনিট, সেকেন্ড) ধরে রিয়েল-টাইম পার্থক্য বের করা
    const birthDateTime = new Date(
      birthDate.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate(),
      0,
      0,
      0,
    );

    const currentDateTime = new Date(
      targetDateBase.getFullYear(),
      targetDateBase.getMonth(),
      targetDateBase.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
    );

    let years = currentDateTime.getFullYear() - birthDateTime.getFullYear();
    let months = currentDateTime.getMonth() - birthDateTime.getMonth();
    let days = currentDateTime.getDate() - birthDateTime.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // নিখুঁত মিলিসেকেন্ড পার্থক্য
    const diffTime = Math.abs(currentDateTime.getTime() - birthDateTime.getTime());

    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diffTime / (1000 * 60 * 60));
    const minutes = Math.floor(diffTime / (1000 * 60));
    const seconds = Math.floor(diffTime / 1000);

    const liveHours = currentDateTime.getHours();
    const liveMinutes = currentDateTime.getMinutes();
    const liveSeconds = currentDateTime.getSeconds();

    this.age = {
      years,
      months,
      days,
      liveHours,
      liveMinutes,
      liveSeconds,
      totalDays,
      hours,
      minutes,
      seconds,
    };

    // Angular-কে বাধ্য করা হলো UI রিফ্রেশ করার জন্য
    this.cdr.detectChanges();
  }

  calculateNextBirthday(birthDate: Date, targetDate: Date) {
    let nextBday = new Date(targetDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (targetDate > nextBday) {
      nextBday.setFullYear(targetDate.getFullYear() + 1);
    }

    let months = nextBday.getMonth() - targetDate.getMonth();
    let days = nextBday.getDate() - targetDate.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(nextBday.getFullYear(), nextBday.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      months += 12;
    }

    this.nextBirthday = { months, days };
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}
