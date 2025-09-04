export interface AddAssignmentInput {
  operationId: string;
  sellerId: string;
  assignment: {
    operatorId: string;
    catalogId: string;
    role: string;
  };
}

export interface AddAssignmentOutput {
  operationId: string;
  sellerId: string;
  operatorId: string;
  catalogId: string;
  role: string;
}