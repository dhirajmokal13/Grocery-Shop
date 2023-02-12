import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import conn from "./db/dbconn.js";
import router from "./routes/routes.js";
import { join } from 'path';
import cors from "cors";

// Creating Database Url
const DATABASE_URL = process.env.DATABASE_URL_OFFLINE;
conn(DATABASE_URL);
//Defining Server Port Number
const port = process.env.PORT;

// Creating Express app
const app = express();
//Using Json middleware
app.use(express.json());
//Serving static files at root endpoint
app.use('/', express.static(join(process.cwd(), "public")));

// using cors for Rest api and get allow access to client
app.use(cors({
  origin: JSON.parse(process.env.CLIENT_URLS),
  methods: JSON.parse(process.env.ALLOWED_METHODS),
  credentials: true,
}));

//load routes
app.use("/", router);

//Listen server on the port number which is mentioned on above
app.listen(process.env.PORT, () => {
  console.log(`server listening at http://localhost:${port}`);
});
