import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import conn from "./db/dbconn.js";
import router from "./routes/routes.js";
import { join } from 'path';
import cors from "cors";

const DATABASE_URL = process.env.DATABASE_URL_OFFLINE;
conn(DATABASE_URL);
const port = process.env.PORT;

const app = express();
app.use(express.json());
app.use('/', express.static(join(process.cwd(), "public")));

app.use(cors({
  origin: JSON.parse(process.env.CLIENT_URLS),
  methods: JSON.parse(process.env.ALLOWED_METHODS),
  credentials: true,
}));

//load routes
app.use("/", router);
app.listen(process.env.PORT, () => {
  console.log(`server listening at http://localhost:${port}`);
});
