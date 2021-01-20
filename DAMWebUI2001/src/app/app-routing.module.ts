import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { JobStatusLogComponent } from './job-status-log/job-status-log.component';
import { LoadReconComponent } from './load-recon/load-recon.component';
import { ExportReconComponent } from './export-recon/export-recon.component';
import { MyQueueComponent } from './my-queue/my-queue.component';
import { DiscrepancyAnalysisManagerComponent } from './discrepancy-analysis-manager/discrepancy-analysis-manager.component';
import { MemberSearchComponent } from './member-search/member-search.component';
import { ProcDetailComponent } from './proc-detail/proc-detail.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { RuleConfigComponent } from './rule-config/rule-config.component';
import { BeqTrackingComponent } from './beq-tracking/beq-tracking.component';
import { BLANK } from 'src/common/constant';
import { ExecuteBatchComponent } from './execute-batch/execute-batch.component';
import { ProcessorManagementComponent } from './processor-management/processor-management.component';
import { DiscrepancyAnalyzerComponent } from './discrepancy-analyzer/discrepancy-analyzer.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'job-status-log', component: JobStatusLogComponent },
  { path: 'load-recon', component: LoadReconComponent },
  { path: 'export-recon', component: ExportReconComponent },
  { path: 'assign', component: DiscrepancyAnalysisManagerComponent },
  { path: 'processor-management', component: ProcessorManagementComponent },
  { path: 'my-queue', component: MyQueueComponent },
  { path: 'member-search', component: MemberSearchComponent },
  { path: 'proc-detail', component: ProcDetailComponent },
  { path: 'rule-config', component: RuleConfigComponent },
  { path: 'beq-tracking', component: BeqTrackingComponent },
  { path: 'execute-batch', component: ExecuteBatchComponent },
  { path: 'discrepancy-analyzer', component: DiscrepancyAnalyzerComponent },
  { path: 'error-page', component: ErrorPageComponent },
  { path: BLANK, redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: HomeComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
