import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Percentage } from './percentage';

describe('Percentage', () => {
  let component: Percentage;
  let fixture: ComponentFixture<Percentage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Percentage],
    }).compileComponents();

    fixture = TestBed.createComponent(Percentage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
