import { z } from "zod";

const status = z.string().min(1).max(80).meta({
  description:
    "Short sentence shown on screen while this runs, saying what you're doing for them, e.g. Checking Joe Pesci's filmography",
});

export const withStatus = <T extends z.ZodRawShape>(shape: T) => z.object({ status, ...shape });

export const withoutStatus = <T extends Record<string, unknown>>({ status: _status, ...rest }: T): Omit<T, "status"> =>
  rest;
