const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["index.mjs"],
    define: {
      "process.env.WEBWORKER": "true",
    },
    bundle: true,
    outfile: "dist/worker.mjs",
    format: "esm",
    minify: false,
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
