import { Allow, parse } from "partial-json";

export function parseStreamingArgs(args: string): Record<string, any> | undefined {
  if (!args.trim()) return undefined;
  try {
    return parse(args, Allow.ALL & ~Allow.STR & ~Allow.NUM);
  } catch {
    return undefined;
  }
}
