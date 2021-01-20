import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobStatusLogComponent } from './job-status-log.component';

describe('JobStatusLogComponent', () => {
  let component: JobStatusLogComponent;
  let fixture: ComponentFixture<JobStatusLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobStatusLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobStatusLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
