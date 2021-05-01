import {S3} from 'aws-sdk';
import {Body} from 'aws-sdk/clients/s3';

export class ReportService {

    public static async generateReport(amountOfRows:number,delay: number): Promise<string> {
        const bucketName = process.env.REPORTS_BUCKET_NAME as string;
        return new Promise(resolve => {
            setTimeout(async () => {
                const reportHeader = ['Date', 'Item', 'Amount'];
                const reportRows = [...Array(amountOfRows).keys()].map(i => [new Date(new Date().getTime() + (86400000 * i)).toDateString(), `Item ${i + 1}`, Math.round((Math.random() * 100000) + 1)]);
                const report = this.createCsvReport(reportHeader, reportRows);
                const objectKey = 'report.csv';
                await this.storeReport(bucketName, objectKey, report)
                resolve(this.getReportUrl(bucketName, objectKey, 5 * 60));
            }, delay)
        });
    };

    private static createCsvReport(header: string[], data: (string | number)[][]): Buffer {
        const newLine = '\r\n';
        const separator = ';';
        let csv = header.join(separator) + newLine;
        data.forEach(row => {
            csv += row.join(separator) + newLine;
        })
        return new Buffer(csv);
    }

    private static getReportUrl(bucketName: string, objectKey: string, expiration: number): string {
        const item = {
            Bucket: bucketName,
            Key: objectKey,
            Expires: expiration,
        };
        return new S3().getSignedUrl('getObject', item);
    };

    private static async storeReport(bucketName: string, objectKey: string, body: Body): Promise<any> {
        return new S3().putObject({
            Bucket: bucketName,
            Key: objectKey,
            Body: body,
        }).promise();
    };
}
