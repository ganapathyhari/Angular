import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportReconComponent } from './export-recon.component';

describe('ExportReconComponent', () => {
  let component: ExportReconComponent;
  let fixture: ComponentFixture<ExportReconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportReconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportReconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
