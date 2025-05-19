import agnostic from "agnostic-worker";

export default await agnostic(async (app) => {
  app.get("/", (req, res) => {
    res.setHeader("access-control-allow-origin", "*");
    res.end("Hello from the agnostic-worker example!");
  });
  if (!process.env.WEBWORKER) {
    // if we're in node
    // load our env variables and serve static files as needed
    (await import("dotenv")).default.config({});
    const { default: express } = await import("express");
    app.use(express.static("public"));
  }
  console.log("example server has started, ready to handle requests!");
});
