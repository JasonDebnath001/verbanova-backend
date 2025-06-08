import e from "express";
import "dotenv/config";
import cors from "cors";
import connectDb from "./config/db.js";
import adminRouter from "./routes/adminRoutes.js";
import blogRouter from "./routes/blogRoutes.js";

const app = e();

await connectDb();

// middleware
app.use(cors());
app.use(e.json());

// routes
app.get("/", (req, res) => {
  res.send("API is working");
});
app.use("/api/admin", adminRouter);
app.use("/api/blog", blogRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Serving is running on port: " + port);
});

export default app;
