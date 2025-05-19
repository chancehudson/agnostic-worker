export default (req, _res, next) => {
  /// assign a mdn compliant URL object
  /// how we build it varies based on whether we're in NodeJS
  /// or a cloudflare worker
  /// this is determined at compile time
  req.mdn_url = new URL(
    process.env.WEBWORKER
      ? req.url
      : req.protocol + "://" + req.get("host") + req.originalUrl,
  );
  next();
};
