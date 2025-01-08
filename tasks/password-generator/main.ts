import type { Context } from "@oomol/types/oocana";
import { passwordGenerator } from "../../src";

type BlockContext = Context<Inputs, Outputs>;
type Inputs = Readonly<{
  count: number;
  length: number;
  numbers: boolean;
  symbols: boolean;
  lowercase: boolean;
  uppercase: boolean;
  exclude: string;
  easyRead: boolean;
  customChars: string;
}>;
type Outputs = Readonly<{
  single: string;
  multiple: string[]
}>;

export default async function(params: Inputs, context: BlockContext): Promise<Outputs> {
  const result: string[] = [];

  for (let i = 0; i < params.count; i++ ) {
    result.push(passwordGenerator(params));
  }

  return {
    single: result[0],
    multiple: result,
  }
};