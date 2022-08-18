// Using the express dependency to handle routes
import express from "express";
const app = express();
import bcrypt from "bcrypt";
import File from "./models/File.js";

//express multer middleware for uploads destination
import multer from "multer";

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const upload = multer({ dest: "uploads" });

mongoose.connect(process.env.DB_CONNECT, () => {
  console.log("connection to db🚀");
});

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", upload.single("file"), async (req, res) => {
  const fileData = {
    path: req.file.path,
    originalName: req.file.originalname,
  };
  if (req.body.password != null && req.body.password !== "") {
    fileData.password = await bcrypt.hash(req.body.password, 10);
  }

  const file = await File.create(fileData);

  res.render("index", { fileLink: `${req.headers.origin}/file/${file.id}` });
});

app.get("/file/:id", (req, res) => {});

app.listen(process.env.PORT, () => {
  console.log("Server running on localhost:3000 ");
});
