import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"



const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors());

//router imports
import healthCheckRouter from "./routes/healthcheck.routes.js"
import router from "./routes/auth.routes.js"


app.use("/api/v1/healthcheck", healthCheckRouter)
app.use("/api/v1/auth",router);

export default app;
