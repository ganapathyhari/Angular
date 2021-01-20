import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleConfigRxComponent } from './rule-config-rx.component';

describe('RuleConfigRxComponent', () => {
  let component: RuleConfigRxComponent;
  let fixture: ComponentFixture<RuleConfigRxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleConfigRxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleConfigRxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
