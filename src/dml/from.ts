import { Expression } from 'src/expression';

export type FromTable = string;
export type FromExpressions = Record<string, FromTable | Expression>;
export type From = FromTable | FromExpressions;
