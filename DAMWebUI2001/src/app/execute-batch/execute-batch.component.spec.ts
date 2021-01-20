import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecuteBatchComponent } from './execute-batch.component';

describe('ExecuteBatchComponent', () => {
  let component: ExecuteBatchComponent;
  let fixture: ComponentFixture<ExecuteBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecuteBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecuteBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
