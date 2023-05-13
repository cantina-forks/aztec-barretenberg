import fs from 'fs';
import { mapDeserializer, mapType } from './mappings.js';
import { toCamelCase } from './to_camel_case.js';
import { FunctionDeclaration } from './function_declaration.js';

export function generateTypeScriptCode(filename: string) {
  const fileContent = fs.readFileSync(filename, 'utf-8');
  const functionDeclarations: FunctionDeclaration[] = JSON.parse(fileContent);

  let output = `// WARNING: FILE CODE GENERATED BY BINDGEN UTILITY. DO NOT EDIT!
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BarretenbergBinder, BarretenbergBinderSync } from '../barretenberg_binder/index.js';
import { BufferDeserializer, NumberDeserializer, VectorDeserializer, BoolDeserializer } from '../serialize/index.js';
import { Fr, Fq, Point, Buffer32, Buffer128, Ptr } from '../types/index.js';

export class BarretenbergApi {
  constructor(public binder: BarretenbergBinder) {}

  async destroy() {
    await this.binder.wasm.destroy();
  }
`;

  for (const { functionName, inArgs, outArgs } of functionDeclarations) {
    try {
      const parameters = inArgs.map(({ name, type }) => `${toCamelCase(name)}: ${mapType(type)}`).join(', ');
      const inArgsVar = `[${inArgs.map(arg => toCamelCase(arg.name)).join(', ')}]`;
      const outTypesVar = `[${outArgs.map(arg => mapDeserializer(arg.type)).join(', ')}]`;
      const wasmCall = `const result = await this.binder.callWasmExport('${functionName}', ${inArgsVar}, ${outTypesVar});`;

      const n = outArgs.length;
      const returnStmt = n === 0 ? 'return;' : n === 1 ? 'return result[0];' : 'return result as any;';
      const returnType =
        outArgs.length === 0
          ? 'void'
          : outArgs.length === 1
          ? `${mapType(outArgs[0].type)}`
          : `[${outArgs.map(a => mapType(a.type)).join(', ')}]`;

      output += `
  async ${toCamelCase(functionName)}(${parameters}): Promise<${returnType}> {
    ${wasmCall}
    ${returnStmt}
  }
`;
    } catch (err: any) {
      throw new Error(`Function ${functionName}: ${err.message}`);
    }
  }

  output += `}

export class BarretenbergApiSync {
  constructor(public binder: BarretenbergBinderSync) {}

  async destroy() {
    await this.binder.wasm.destroy();
  }
`;

  for (const { functionName, inArgs, outArgs } of functionDeclarations) {
    try {
      const parameters = inArgs.map(({ name, type }) => `${toCamelCase(name)}: ${mapType(type)}`).join(', ');
      const inArgsVar = `[${inArgs.map(arg => toCamelCase(arg.name)).join(', ')}]`;
      const outTypesVar = `[${outArgs.map(arg => mapDeserializer(arg.type)).join(', ')}]`;
      const wasmCall = `const result = this.binder.callWasmExport('${functionName}', ${inArgsVar}, ${outTypesVar});`;

      const n = outArgs.length;
      const returnStmt = n === 0 ? 'return;' : n === 1 ? 'return result[0];' : 'return result as any;';
      const returnType =
        outArgs.length === 0
          ? 'void'
          : outArgs.length === 1
          ? `${mapType(outArgs[0].type)}`
          : `[${outArgs.map(a => mapType(a.type)).join(', ')}]`;

      output += `
  ${toCamelCase(functionName)}(${parameters}): ${returnType} {
    ${wasmCall}
    ${returnStmt}
  }
`;
    } catch (err: any) {
      throw new Error(`Function ${functionName}: ${err.message}`);
    }
  }

  output += '}';

  return output;
}
