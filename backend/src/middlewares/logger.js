// middlewares/logger.js
export const routeLogger = (req, res, next) => {
  const start = Date.now();

  // Keep a reference to the original res.send
  const oldSend = res.send;

  res.send = function (body) {
    const duration = Date.now() - start;

    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} → ${
        res.statusCode
      } (${duration}ms)`
    );

    try {
      // Log the response body safely (truncate if it's too long)
      const responsePreview =
        typeof body === "string" && body.length > 300
          ? body.slice(0, 300) + "..."
          : body;

      console.log("Response:", responsePreview);
    } catch (error) {
      console.log("Response could not be logged:", error.message);
    }

    // Call the original send method
    return oldSend.apply(res, arguments);
  };

  next();
};
