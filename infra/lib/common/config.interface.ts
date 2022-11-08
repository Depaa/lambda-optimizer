export interface BuildConfig {
  readonly account: string;
  readonly region: string;
  readonly environment: string;
  readonly project: string;
  readonly version: string;
  readonly build: string;
  
  readonly stacks: BuildStaks;
}

export interface BuildStaks {
  vpc: BuildVPCStack;
}

export interface BuildVPCStack {
  maxAzs: number;
  cidr: string;
  natGateways: number;
}
