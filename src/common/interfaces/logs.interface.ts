export interface Logs {
  method: string;
  url: string;
  params: any;
  body: any;
  executionTime: Date;
  error?: Error;
}
