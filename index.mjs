import url_middleware from "./middleware/url.mjs";

export default async (fn) => {
  if (process.env.WEBWORKER) {
    // if we're building a webworker export an express-like structure
    // designed for use with cloudflare workers
    const { handleRequest, router } = await import("express-flare");

    const app = router();

    app.use(url_middleware);

    return {
      async fetch(request, env, context) {
        try {
          await fn(app, env);
          return await handleRequest({
            request,
            env,
            context,
            router: app,
            cacheTime: 0,
          });
        } catch (e) {
          return new Response(e);
        }
      },
    };
  } else {
    // otherwise create an actual express server and begin serving
    const { default: express } = await import("express");
    // the build system must support branch elimination otherwise the express
    // dependency should be explicitly shimmed with an empty module

    const port = process.env.PORT || 3000;

    const app = express();

    app.use("*", url_middleware);
    await fn(app, process.env);

    // Start the server
    await new Promise((r) =>
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
        r();
      }),
    );
    return app;
  }
};
