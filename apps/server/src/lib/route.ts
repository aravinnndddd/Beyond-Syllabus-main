import { publicProcedure } from "./orpc";

const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),

};

export { appRouter };
export type AppRouter = typeof appRouter;
