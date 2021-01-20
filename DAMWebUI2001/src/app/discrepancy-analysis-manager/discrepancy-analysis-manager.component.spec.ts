import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscrepancyAnalysisManagerComponent } from './discrepancy-analysis-manager.component';

describe('DiscrepanyAnalysisManagerComponent', () => {
  let component: DiscrepancyAnalysisManagerComponent;
  let fixture: ComponentFixture<DiscrepancyAnalysisManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscrepancyAnalysisManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscrepancyAnalysisManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
