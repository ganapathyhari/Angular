import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { AgGridModule } from 'ag-grid-angular';
import { AdminComponent } from './admin/admin.component';
import { JobStatusLogComponent } from './job-status-log/job-status-log.component';
import { DiscrepancyAnalysisManagerComponent } from './discrepancy-analysis-manager/discrepancy-analysis-manager.component';
import { LoadReconComponent } from './load-recon/load-recon.component';
import { ExportReconComponent } from './export-recon/export-recon.component';
import { MyQueueComponent } from './my-queue/my-queue.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MemberSearchComponent } from './member-search/member-search.component';
import { ProcDetailComponent } from './proc-detail/proc-detail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ChartsModule } from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ErrorPageComponent } from './error-page/error-page.component';
import { RuleConfigComponent } from './rule-config/rule-config.component';
import { PopupComponentComponent } from './popup-component/popup-component.component';
import { BeqTrackingComponent } from './beq-tracking/beq-tracking.component';
import { ExecuteBatchComponent } from './execute-batch/execute-batch.component';
import { ProcessorManagementComponent } from './processor-management/processor-management.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HomeRxComponent } from './home-rx/home-rx.component';
import { RuleConfigRxComponent } from './rule-config-rx/rule-config-rx.component';
import { DiscrepancyAnalyzerComponent } from './discrepancy-analyzer/discrepancy-analyzer.component';
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    AdminComponent,
    JobStatusLogComponent,
    DiscrepancyAnalysisManagerComponent,
    LoadReconComponent,
    ExportReconComponent,
    MyQueueComponent,
    MemberSearchComponent,
    ProcDetailComponent,
    ErrorPageComponent,
    RuleConfigComponent,
    PopupComponentComponent,
    BeqTrackingComponent,
    ExecuteBatchComponent,
    ProcessorManagementComponent,
    HomeRxComponent,
    RuleConfigRxComponent,
    DiscrepancyAnalyzerComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ChartsModule,
    DragDropModule,
    NgbModule,
    ToastrModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    AgGridModule.withComponents([])
  ],
  entryComponents: [PopupComponentComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
