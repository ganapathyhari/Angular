import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcDetailComponent } from './proc-detail.component';

describe('ProcDetailComponent', () => {
  let component: ProcDetailComponent;
  let fixture: ComponentFixture<ProcDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
