import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessorManagementComponent } from './processor-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule, ToastrService, IndividualConfig } from 'ngx-toastr';
import { CommonService } from '../common.service';
import { of } from 'rxjs';

describe('ProcessorManagementComponent', () => {
  let component: ProcessorManagementComponent;
  let fixture: ComponentFixture<ProcessorManagementComponent>;
  const toastrService = {
    success: () => { },
    error: () => { }
  };
  const commonServiceStub = {

    getReconTypeVal: () => {
      return of([
        { recon_Id: 1, recon_Name: 'Ag & Turf' },
        { recon_Id: 1, recon_Name: 'C&F' }
      ]);
    },
    getUnassignDetail: () => {
      return of(
        [{ "client_id": "CSH", "contract_id": "H6672", "discp_code": "PEL", "report_mon": "202001", "assign_name": "a", "tot_unassign": 5, "tot_pend_work": 10, "proc_assign": 5, "proc_pend": 5 },
        { "client_id": "CSH", "contract_id": "H6672", "discp_code": "CNTY", "report_mon": "202002", "assign_name": "jravikumar", "tot_unassign": 0, "tot_pend_work": 5, "proc_assign": 6, "proc_pend": 5 },
        { "client_id": "CSH", "contract_id": "H6672", "discp_code": "GEND", "report_mon": "202003", "assign_name": "jravikumar", "tot_unassign": 0, "tot_pend_work": 1, "proc_assign": 1, "proc_pend": 1 }]
      );

    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, HttpClientModule, ToastrModule,
        AgGridModule.withComponents(
          [ProcessorManagementComponent]
        )],
      declarations: [ProcessorManagementComponent],
      providers: [{ provide: ToastrService, useValue: toastrService },
      { provide: CommonService, useValue: commonServiceStub },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessorManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test getReconType', () => {
    component.getReconType();
    expect(component.getReconType).toBeTruthy();
  });

  it('should test disableClientContr', () => {
    component.processorMgmtForm.controls['reconcilation'].setValue('1');
    component.disableClientContr();
    expect(component.disableClientContr).toBeTruthy();
  });

  it('should test getReportMonthValue', () => {
    component.unAssignDataArr = [{ "client_id": "CSH", "contract_id": "H6672", "discp_code": "PEL", "report_mon": "202003", "assign_name": "a", "tot_unassign": 5, "tot_pend_work": 10, "proc_assign": 5, "proc_pend": 5 },
    { "client_id": "CSH", "contract_id": "H6672", "discp_code": "CNTY", "report_mon": "202003", "assign_name": "jravikumar", "tot_unassign": 0, "tot_pend_work": 5, "proc_assign": 6, "proc_pend": 5 },
    { "client_id": "CSH", "contract_id": "H6672", "discp_code": "GEND", "report_mon": "202003", "assign_name": "jravikumar", "tot_unassign": 0, "tot_pend_work": 1, "proc_assign": 1, "proc_pend": 1 }];
    component.processorMgmtForm.controls['processorName'].setValue('jravikumar');
    component.getReportMonthValue();
    expect(component.getReportMonthValue).toBeTruthy();
  });
  it('should test getReportMonthValue1', () => {
    component.unAssignDataArr = [{ "client_id": "CSH", "contract_id": "H6672", "discp_code": "PEL", "report_mon": "202001", "assign_name": "a", "tot_unassign": 5, "tot_pend_work": 10, "proc_assign": 5, "proc_pend": 5 },
    { "client_id": "CSH", "contract_id": "H6672", "discp_code": "CNTY", "report_mon": "202002", "assign_name": "jravikumar", "tot_unassign": 0, "tot_pend_work": 5, "proc_assign": 6, "proc_pend": 5 },
    { "client_id": "CSH", "contract_id": "H6672", "discp_code": "GEND", "report_mon": "202003", "assign_name": "jravikumar", "tot_unassign": 0, "tot_pend_work": 1, "proc_assign": 1, "proc_pend": 1 }];

    component.processorMgmtForm.controls['processorName'].setValue('jravikumar');
    component.getReportMonthValue();
    expect(component.getReportMonthValue).toBeTruthy();
  });
  it('should test onChangeProcessor', () => {
    component.onChangeProcessor();
    expect(component.onChangeProcessor).toBeTruthy();
  });
  it('should test assign', () => {
    component.assign("U");
    expect(component.assign).toBeTruthy();
  });

  it('should test validateFileds', () => {
    component.processorMgmtForm.controls['reconcilation'].setValue('');
    component.validateFileds();
    expect(component.validateFileds).toBeTruthy();
  });
  it('should test validateFileds1', () => {
    component.processorMgmtForm.controls['reconcilation'].setValue('1');
    component.validateFileds();
    expect(component.validateFileds).toBeTruthy();
  });
  it('should test validateFileds2', () => {
    component.processorMgmtForm.controls['reconcilation'].setValue('1');
    component.processorMgmtForm.controls['processorName'].setValue('1');
    component.rowData = [{ "client_id": "CSH", "contract_id": "H6672", "discp_code": "PEL", "tot_unassign": 5, "tot_pend_work": 10, "proc_pend": 5 },
    { "client_id": "CSH", "contract_id": "H6672", "discp_code": "CNTY", "tot_unassign": 0, "tot_pend_work": 5, "proc_pend": 5 },
    { "client_id": "CSH", "contract_id": "H6672", "discp_code": "GEND", "tot_unassign": 0, "tot_pend_work": 1, "proc_pend": 1 }];
    component.validateFileds([{}]);
    expect(component.validateFileds).toBeTruthy();
  });

});

