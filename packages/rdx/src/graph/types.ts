
export enum NodeStatus {
  Running = "Running",
  Waiting = "Waiting",
  IDeal = "IDeal",
  Error = "Error"
}

export interface BasePoint {
  key: string;
}

export interface IGraphDeps {
  id: string | RegExp;
  value?: any;
}

export interface NotifyPoint extends BasePoint {
  downStreamOnly?: boolean;
  valid?: boolean;
}

export interface Point extends BasePoint {
  deps?: IGraphDeps[];
}



