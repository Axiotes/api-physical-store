export interface Logs {
  method: string;
  url: string;
  params: any;
  body: any;
  executionTime: string;
  statusCode: number;
  error?: Error;
}
