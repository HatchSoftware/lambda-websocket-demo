import {APIGatewayProxyHandler} from 'aws-lambda';
import {Response} from '../types/response';
import {ApiGatewayManagementApi, DynamoDB, Lambda} from 'aws-sdk';
import {ReportService} from '../services/report-service';
import {ReportDefinition} from '../types/report-definition';
import {GenerateReportEvent} from '../types/generate-report-event';

export const handleRequests: APIGatewayProxyHandler = async (event, _context) => {
    const dynamodb = new DynamoDB.DocumentClient();
    const lambda = new Lambda();
    const connectionTable = process.env.WEBSOCKET_CONNECTIONS_TABLE_NAME;
    const {body, requestContext: {connectionId, routeKey}} = event;

    switch (routeKey) {
        case '$connect':
            await dynamodb.put({
                TableName: connectionTable,
                Item: {
                    connectionId,
                    // Forget this connection after 1 hour
                    ttl: (new Date().getTime() / 1000) + 3600
                }
            }).promise();
            break;

        case '$disconnect':
            await dynamodb.delete({
                TableName: connectionTable,
                Key: {connectionId}
            }).promise();
            break;

        case 'generateReport':
            const reportDefinition = JSON.parse(body).data as ReportDefinition;
            const event: GenerateReportEvent = {connectionId: connectionId, reportDefinition: reportDefinition};
            await lambda.invoke({
                FunctionName: process.env.WEBSOCKET_REPORT_GENERATION_LAMBDA_NAME as string,
                InvocationType: 'Event',
                Payload: JSON.stringify(event),
            }).promise();
            break;

        case '$default':
        default:
            const apiGatewayManagementApi = new ApiGatewayManagementApi({
                endpoint: process.env.APIG_ENDPOINT
            });

            await apiGatewayManagementApi.postToConnection({
                ConnectionId: connectionId,
                Data: `Action ${routeKey} is not supported`
            }).promise();
    }

    return Response.success({});
}

export const generateReport = async (event:GenerateReportEvent, _context) => {
    const connectionId = event.connectionId;
    const reportDefinition = event.reportDefinition;
    const reportUrl = await ReportService.generateReport(reportDefinition.amountOfRows, reportDefinition.delay)
    const apiGatewayManagementApi = new ApiGatewayManagementApi({
        endpoint: process.env.APIG_ENDPOINT
    });

    await apiGatewayManagementApi.postToConnection({
        ConnectionId: connectionId,
        Data: reportUrl
    }).promise();

    return Response.success({});
}

