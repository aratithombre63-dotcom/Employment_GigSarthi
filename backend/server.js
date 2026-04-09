// server.js
import express from "express";
import cors from "cors";
import featureRoutes from "./routes/featureRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger (new feature)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// API routes
app.use("/api/features", featureRoutes);

// Health check route (new feature)
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "GigSense AI Backend is healthy",
    timestamp: new Date().toISOString()
  });
});

// Static files for images/graphs
app.use("/outputs", express.static("outputs"));

// Home route
app.get("/", (req, res) => {
  res.send("GigSense AI Backend Running");
});

// 404 handler (bug fix)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Global error handler (new feature)
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
