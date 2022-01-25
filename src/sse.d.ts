export interface SSE {
  init(req: Express.Request, resp: Express.Response): void;
  send(d: string): void;
}