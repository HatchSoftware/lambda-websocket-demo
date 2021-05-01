import {ReportDefinition} from './report-definition';

export interface GenerateReportEvent {
    connectionId: string;
    reportDefinition: ReportDefinition;
}
