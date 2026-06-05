import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnDialog } from './return-dialog';

describe('ReturnDialog', () => {
  let component: ReturnDialog;
  let fixture: ComponentFixture<ReturnDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ReturnDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
