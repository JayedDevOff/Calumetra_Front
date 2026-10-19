import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Seo } from '../../../core/services/seo';

interface Course {
  name: string;
  code: string;
  credit: number;
  grade: string;
  gradePoint: number;
  qualityPoint: number;
}

interface Grade {
  letter: string;
  point: number;
}

interface GradeSystem {
  name: string;
  maxGpa: number;
  grades: Grade[];
}

interface Semester {
  number: number;
  name: string;
  courses: Course[];
}

interface YearResult {
  year: number;
  cgpa: number;
  credits: number;
}

@Component({
  selector: 'app-cgpa',
  imports: [CommonModule, FormsModule],
  templateUrl: './cgpa.html',
  styleUrl: './cgpa.scss',
})
export class Cgpa implements OnInit {
  gradeSystems: GradeSystem[] = [
    {
      name: '4.00 Scale',
      maxGpa: 4,
      grades: [
        { letter: 'A+', point: 4.0 },
        { letter: 'A', point: 3.75 },
        { letter: 'A-', point: 3.5 },
        { letter: 'B+', point: 3.25 },
        { letter: 'B', point: 3.0 },
        { letter: 'B-', point: 2.75 },
        { letter: 'C+', point: 2.5 },
        { letter: 'C', point: 2.25 },
        { letter: 'D', point: 2.0 },
        { letter: 'F', point: 0.0 },
      ],
    },

    {
      name: '5.00 Scale',
      maxGpa: 5,
      grades: [
        { letter: 'A+', point: 5.0 },
        { letter: 'A', point: 4.5 },
        { letter: 'A-', point: 4.0 },
        { letter: 'B+', point: 3.5 },
        { letter: 'B', point: 3.0 },
        { letter: 'C', point: 2.0 },
        { letter: 'D', point: 1.0 },
        { letter: 'F', point: 0.0 },
      ],
    },
    {
      name: '10.00 Scale',
      maxGpa: 10,
      grades: [
        { letter: 'A+', point: 10.0 },
        { letter: 'A', point: 9.0 },
        { letter: 'B+', point: 8.0 },
        { letter: 'B', point: 7.0 },
        { letter: 'C+', point: 6.0 },
        { letter: 'C', point: 5.0 },
        { letter: 'D', point: 4.0 },
        { letter: 'F', point: 0.0 },
      ],
    },
  ];

  selectedSystem: GradeSystem = this.gradeSystems[0];

  courses: Course[] = [
    {
      name: '',
      code: '',
      credit: 3,
      grade: 'A+',
      gradePoint: 4,
      qualityPoint: 12,
    },
  ];

  semesters: Semester[] = [];

  usePreviousAcademicRecord = false;

  previousCgpa = 0;
  previousCredits = 0;

  targetCgpa = 3.5;
  remainingCredits = 15;

  percentage = 0;

  activeTab = 'gpa';

  conversionCgpa = 0;
  conversionGpa = 0;
  conversionGpaScale = 4;
  conversionCgpaScale = 10;

  percentageToGpaValue = 0;
  percentageGpaScale = 4;

  grandTotalGradePoints = 0;
  grandTotalCredits = 0;

  year1Cgpa = 0;
  year1Credits = 0;
  year2Cgpa = 0;
  year2Credits = 0;
  year3Cgpa = 0;
  year3Credits = 0;
  year4Cgpa = 0;
  year4Credits = 0;

  constructor(
    private seo: Seo,
    private renderer: Renderer2,
    private elRef: ElementRef,
  ) {}

  ngOnInit(): void {
    this.updateAllCourses();
    this.semesters = [this.createSemester(1)];
    this.seo.setPage('cgpaCalculator');
  }

  private createCourse(): Course {
    const firstGrade = this.selectedSystem.grades[0];

    return {
      name: '',
      code: '',
      credit: 3,
      grade: firstGrade.letter,
      gradePoint: firstGrade.point,
      qualityPoint: 3 * firstGrade.point,
    };
  }

  private createSemester(number: number): Semester {
    return {
      number,
      name: `Semester ${number}`,
      courses: [this.createCourse()],
    };
  }

  selectSystem(system: GradeSystem): void {
    this.selectedSystem = system;

    this.courses.forEach((course) => {
      const grade = system.grades.find((g) => g.letter === course.grade) || system.grades[0];

      course.grade = grade.letter;
      course.gradePoint = grade.point;
      course.qualityPoint = this.toNumber(course.credit) * grade.point;
    });

    this.semesters.forEach((semester) => {
      semester.courses.forEach((course) => {
        const grade = system.grades.find((g) => g.letter === course.grade) || system.grades[0];

        course.grade = grade.letter;
        course.gradePoint = grade.point;
        course.qualityPoint = this.toNumber(course.credit) * grade.point;
      });
    });

    this.conversionGpaScale = system.maxGpa;
    this.updateAllCourses();
  }

  addCourse(): void {
    this.courses.push(this.createCourse());
  }

  removeCourse(index: number): void {
    if (this.courses.length === 1) {
      this.courses[0] = this.createCourse();
      return;
    }

    this.courses.splice(index, 1);
  }

  duplicateCourse(index: number): void {
    const course = this.courses[index];

    this.courses.splice(index + 1, 0, {
      ...course,
    });
  }

  resetCourses(): void {
    this.courses = [this.createCourse()];
  }

  updateGrade(course: Course): void {
    const grade = this.selectedSystem.grades.find((g) => g.letter === course.grade);

    if (!grade) {
      const firstGrade = this.selectedSystem.grades[0];
      course.grade = firstGrade.letter;
      course.gradePoint = firstGrade.point;
    } else {
      course.gradePoint = grade.point;
    }

    course.qualityPoint = this.toNumber(course.credit) * course.gradePoint;
  }

  updateCourse(course: Course): void {
    course.credit = this.toNumber(course.credit);
    course.qualityPoint = course.credit * course.gradePoint;
  }

  updateAllCourses(): void {
    this.courses.forEach((course) => this.updateGrade(course));
  }

  addSemester(): void {
    const nextNumber = this.semesters.length
      ? Math.max(...this.semesters.map((s) => s.number)) + 1
      : 1;

    this.semesters.push(this.createSemester(nextNumber));
  }

  removeSemester(index: number): void {
    if (this.semesters.length === 1) {
      return;
    }

    this.semesters.splice(index, 1);
  }

  resetSemester(semester: Semester): void {
    semester.courses = [this.createCourse()];
  }

  resetSemesters(): void {
    this.semesters = [this.createSemester(1)];
    this.usePreviousAcademicRecord = false;
    this.previousCgpa = 0;
    this.previousCredits = 0;
  }

  addSemesterCourse(semester: Semester): void {
    semester.courses.push(this.createCourse());
  }

  removeSemesterCourse(semester: Semester, index: number): void {
    if (semester.courses.length === 1) {
      semester.courses[0] = this.createCourse();
      return;
    }

    semester.courses.splice(index, 1);
  }

  duplicateSemesterCourse(semester: Semester, index: number): void {
    const course = semester.courses[index];

    semester.courses.splice(index + 1, 0, {
      ...course,
    });
  }

  updateSemesterGrade(course: Course): void {
    this.updateGrade(course);
  }

  updateSemesterCourse(course: Course): void {
    this.updateCourse(course);
  }

  getSemesterTotalCredits(semester: Semester): number {
    return semester.courses.reduce((total, course) => total + this.toNumber(course.credit), 0);
  }

  getSemesterQualityPoints(semester: Semester): number {
    return semester.courses.reduce(
      (total, course) => total + this.toNumber(course.qualityPoint),
      0,
    );
  }

  getSemesterGpa(semester: Semester): number {
    const credits = this.getSemesterTotalCredits(semester);
    const qualityPoints = this.getSemesterQualityPoints(semester);

    return credits > 0 ? qualityPoints / credits : 0;
  }

  get totalSemesterCredits(): number {
    return this.semesters.reduce(
      (total, semester) => total + this.getSemesterTotalCredits(semester),
      0,
    );
  }

  get totalSemesterQualityPoints(): number {
    return this.semesters.reduce(
      (total, semester) => total + this.getSemesterQualityPoints(semester),
      0,
    );
  }

  get totalSemesterCourses(): number {
    return this.semesters.reduce((total, semester) => total + semester.courses.length, 0);
  }

  get semesterCount(): number {
    return this.semesters.length;
  }

  get previousQualityPoints(): number {
    if (!this.usePreviousAcademicRecord) {
      return 0;
    }

    return this.toNumber(this.previousCgpa) * this.toNumber(this.previousCredits);
  }

  get academicTotalCredits(): number {
    const previousCredits = this.usePreviousAcademicRecord
      ? this.toNumber(this.previousCredits)
      : 0;

    return previousCredits + this.totalSemesterCredits;
  }

  get academicTotalQualityPoints(): number {
    return this.previousQualityPoints + this.totalSemesterQualityPoints;
  }

  get academicCourseCount(): number {
    return this.totalSemesterCourses;
  }

  get academicOverallCgpa(): number {
    const credits = this.academicTotalCredits;

    return credits > 0 ? this.academicTotalQualityPoints / credits : 0;
  }

  get academicOverallPercentage(): number {
    return this.selectedSystem.maxGpa > 0
      ? (this.academicOverallCgpa / this.selectedSystem.maxGpa) * 100
      : 0;
  }

  get totalCredits(): number {
    return this.courses.reduce((total, course) => total + this.toNumber(course.credit), 0);
  }

  get totalQualityPoints(): number {
    return this.courses.reduce((total, course) => total + this.toNumber(course.qualityPoint), 0);
  }

  get courseCount(): number {
    return this.courses.length;
  }

  get gpa(): number {
    return this.totalCredits > 0 ? this.totalQualityPoints / this.totalCredits : 0;
  }

  get currentSemesterGpa(): number {
    return this.gpa;
  }

  get updatedCgpa(): number {
    return this.academicOverallCgpa;
  }

  get targetCurrentCgpa(): number {
    const hasAcademicData =
      this.totalSemesterCredits > 0 || (this.usePreviousAcademicRecord && this.previousCredits > 0);

    return hasAcademicData ? this.academicOverallCgpa : this.toNumber(this.previousCgpa);
  }

  get targetCompletedCredits(): number {
    const hasAcademicData =
      this.totalSemesterCredits > 0 || (this.usePreviousAcademicRecord && this.previousCredits > 0);

    return hasAcademicData ? this.academicTotalCredits : this.toNumber(this.previousCredits);
  }

  get requiredGpa(): number {
    const currentCgpa = this.targetCurrentCgpa;
    const completedCredits = this.targetCompletedCredits;
    const remainingCredits = this.toNumber(this.remainingCredits);
    const target = this.toNumber(this.targetCgpa);
    const maxGpa = this.selectedSystem.maxGpa;

    if (remainingCredits <= 0) {
      return 0;
    }

    const required =
      (target * (completedCredits + remainingCredits) - currentCgpa * completedCredits) /
      remainingCredits;

    return Math.max(0, required);
  }

  get targetMessage(): string {
    const required = this.requiredGpa;
    const maxGpa = this.selectedSystem.maxGpa;

    if (this.toNumber(this.remainingCredits) <= 0) {
      return 'Enter remaining credits to calculate the required GPA.';
    }

    if (required > maxGpa) {
      return `The target CGPA is not achievable with a maximum GPA of ${this.formatNumber(maxGpa)}.`;
    }

    if (required <= 0) {
      return 'Your current academic record already meets or exceeds the target CGPA.';
    }

    return `You need approximately ${this.formatNumber(required)} GPA in your remaining credits.`;
  }

  percentageToCgpa(): number {
    const value = this.toNumber(this.percentage);

    return (value / 100) * this.selectedSystem.maxGpa;
  }

  cgpaToPercentage(): number {
    return this.selectedSystem.maxGpa > 0 ? (this.gpa / this.selectedSystem.maxGpa) * 100 : 0;
  }

  overallCgpaToPercentage(): number {
    return this.selectedSystem.maxGpa > 0
      ? (this.academicOverallCgpa / this.selectedSystem.maxGpa) * 100
      : 0;
  }

  cgpaToGpa(): void {
    this.conversionGpa =
      this.selectedSystem.maxGpa > 0
        ? (this.conversionCgpa / this.selectedSystem.maxGpa) * this.conversionGpaScale
        : 0;
  }

  gpaToCgpa(): void {
    this.conversionCgpa =
      this.conversionGpaScale > 0
        ? (this.conversionGpa / this.conversionGpaScale) * this.conversionCgpaScale
        : 0;
  }

  get convertedGpa(): number {
    return this.selectedSystem.maxGpa > 0
      ? (this.conversionCgpa / this.selectedSystem.maxGpa) * this.conversionGpaScale
      : 0;
  }

  get convertedCgpa(): number {
    return this.conversionGpaScale > 0
      ? (this.conversionGpa / this.conversionGpaScale) * this.conversionCgpaScale
      : 0;
  }

  percentageToGpa(): void {
    this.percentageToGpaValue = (this.percentage / 100) * this.percentageGpaScale;
  }

  get percentageGpaResult(): number {
    return (this.percentage / 100) * this.percentageGpaScale;
  }

  get grandTotalCgpa(): number {
    return this.grandTotalCredits > 0 ? this.grandTotalGradePoints / this.grandTotalCredits : 0;
  }

  get fourYearTotalCredits(): number {
    return (
      this.toNumber(this.year1Credits) +
      this.toNumber(this.year2Credits) +
      this.toNumber(this.year3Credits) +
      this.toNumber(this.year4Credits)
    );
  }

  get fourYearTotalQualityPoints(): number {
    return (
      this.toNumber(this.year1Cgpa) * this.toNumber(this.year1Credits) +
      this.toNumber(this.year2Cgpa) * this.toNumber(this.year2Credits) +
      this.toNumber(this.year3Cgpa) * this.toNumber(this.year3Credits) +
      this.toNumber(this.year4Cgpa) * this.toNumber(this.year4Credits)
    );
  }

  get fourYearCgpa(): number {
    return this.fourYearTotalCredits > 0
      ? this.fourYearTotalQualityPoints / this.fourYearTotalCredits
      : 0;
  }

  get yearResults(): YearResult[] {
    return [
      {
        year: 1,
        cgpa: this.year1Cgpa,
        credits: this.year1Credits,
      },
      {
        year: 2,
        cgpa: this.year2Cgpa,
        credits: this.year2Credits,
      },
      {
        year: 3,
        cgpa: this.year3Cgpa,
        credits: this.year3Credits,
      },
      {
        year: 4,
        cgpa: this.year4Cgpa,
        credits: this.year4Credits,
      },
    ];
  }

  setTab(tab: string): void {
    this.activeTab = tab;
  }

  conversionPercentage(): number {
    if (this.conversionGpaScale <= 0) {
      return 0;
    }

    return (this.conversionGpa / this.conversionGpaScale) * 100;
  }

  currentGpaPercentage(): number {
    return this.cgpaToPercentage();
  }

  formatNumber(value: number): string {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return '0.00';
    }

    return number.toFixed(2);
  }

  resetConversions(): void {
    this.conversionCgpa = 0;
    this.conversionGpa = 0;
    this.percentage = 0;
    this.percentageToGpaValue = 0;
  }

  resetFourYear(): void {
    this.year1Cgpa = 0;
    this.year1Credits = 0;
    this.year2Cgpa = 0;
    this.year2Credits = 0;
    this.year3Cgpa = 0;
    this.year3Credits = 0;
    this.year4Cgpa = 0;
    this.year4Credits = 0;
  }

  private toNumber(value: number | string | null | undefined): number {
    const number = Number(value);

    return Number.isFinite(number) ? number : 0;
  }
}
