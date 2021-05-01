import {APIGatewayProxyHandler} from 'aws-lambda';
import 'source-map-support/register';
import {Response} from '../types/response';
import {ReportService} from '../services/report-service';
import {ReportDefinition} from '../types/report-definition';

export const generateReport: APIGatewayProxyHandler = async (event, _context) => {
    const {body} = event;
    const reportDefinition = JSON.parse(body) as ReportDefinition;
    const reportUrl = await ReportService.generateReport(reportDefinition.amountOfRows, reportDefinition.delay);
    return Response.success(reportUrl);
}
