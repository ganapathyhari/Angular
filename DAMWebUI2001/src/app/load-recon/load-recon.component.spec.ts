import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadReconComponent } from './load-recon.component';

describe('LoadReconComponent', () => {
  let component: LoadReconComponent;
  let fixture: ComponentFixture<LoadReconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadReconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadReconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
