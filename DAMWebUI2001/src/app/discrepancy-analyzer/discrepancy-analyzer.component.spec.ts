import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscrepancyAnalyzerComponent } from './discrepancy-analyzer.component';

describe('DiscrepancyAnalyzerComponent', () => {
  let component: DiscrepancyAnalyzerComponent;
  let fixture: ComponentFixture<DiscrepancyAnalyzerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscrepancyAnalyzerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscrepancyAnalyzerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
