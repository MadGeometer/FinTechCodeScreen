export interface CustomerData {
    firstName: String;
    lastName: String;
    clientId: String;
}

export interface ParsedDataSuccess {
    statusCode: number;
    data: CustomerData;
}

export interface ParsedDataFailure {
    statusCode: number;
    data: Object;
    error: String;
}