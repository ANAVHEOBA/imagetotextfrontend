import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureHighlights } from './feature-highlights';

describe('FeatureHighlights', () => {
  let component: FeatureHighlights;
  let fixture: ComponentFixture<FeatureHighlights>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureHighlights]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeatureHighlights);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
