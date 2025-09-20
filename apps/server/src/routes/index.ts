import { publicProcedure } from "../lib/orpc";
import type { RouterClient } from "@orpc/server";
import path from "node:path";
import { file } from "bun";


export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),
  syllabus: publicProcedure.handler(async () => {
    const data = await file(
      path.join(process.cwd(), "src/routes/syllabus/generated/university.json")
    ).json();
    return data;
  }),
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
