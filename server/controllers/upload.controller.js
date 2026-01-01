import mammoth from "mammoth";
import { createRequire } from "module";
import Document from "../models/Document.js";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export async function uploadFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { originalname, mimetype, buffer } = req.file;
    let extractedText = "";

    if (mimetype === "application/pdf") {
      const data = await pdfParse(buffer);
      extractedText = data.text;
    } else if (
      mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else if (mimetype === "text/plain") {
      extractedText = buffer.toString("utf-8");
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    if (!extractedText || extractedText.trim().length < 50) {
      return res.status(400).json({ error: "File content is too short" });
    }

    const doc = await Document.create({
      filename: originalname,
      mimetype,
      text: extractedText,
    });

    return res.json({
      documentId: doc._id,
      message: "File processed and text saved successfully",
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return res.status(500).json({ error: "Upload failed" });
  }
}
