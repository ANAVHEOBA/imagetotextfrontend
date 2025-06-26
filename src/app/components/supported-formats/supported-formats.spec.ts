import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportedFormats } from './supported-formats';

describe('SupportedFormats', () => {
  let component: SupportedFormats;
  let fixture: ComponentFixture<SupportedFormats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportedFormats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportedFormats);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
