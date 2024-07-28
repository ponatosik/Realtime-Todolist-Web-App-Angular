import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCautionComponent } from './app-caution.component';

describe('AppCautionComponent', () => {
  let component: AppCautionComponent;
  let fixture: ComponentFixture<AppCautionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppCautionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppCautionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
