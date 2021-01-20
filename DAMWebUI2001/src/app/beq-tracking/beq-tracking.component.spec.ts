import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeqTrackingComponent } from './beq-tracking.component';

describe('BeqTrackingComponent', () => {
  let component: BeqTrackingComponent;
  let fixture: ComponentFixture<BeqTrackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeqTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeqTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
