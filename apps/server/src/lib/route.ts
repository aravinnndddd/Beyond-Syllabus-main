import { publicProcedure } from "./orpc";
import { chatRoutes } from "../routes/chat";

const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),

  chat: chatRoutes,
};

export { appRouter };
export type AppRouter = typeof appRouter;
