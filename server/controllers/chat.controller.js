import Document from "../models/Document.js";

export async function chatWithAssistant(req, res) {
  try {
    const { documentId, step = 1 } = req.body;

    if (!documentId) {
      return res.status(400).json({
        error: "documentId is required",
      });
    }

    /* =========================
       Get text from DB
    ========================= */
    const doc = await Document.findById(documentId);

    if (!doc) {
      return res.status(404).json({
        error: "Document not found",
      });
    }

    const fileText = doc.text;

    /* =========================
       Simple tutor logic (NO AI)
    ========================= */
    const sentences = fileText
      .replace(/\n+/g, " ")
      .split(".")
      .map((s) => s.trim())
      .filter((s) => s.length > 40);

    if (sentences.length === 0) {
      return res.json({
        question: "The document is too short to generate questions.",
        step,
      });
    }

    let question;

    switch (step) {
      case 1:
        question = `Explain the following idea in your own words:\n"${sentences[0]}"`;
        break;

      case 2:
        question = `Why is the following concept important?\n"${
          sentences[1] || sentences[0]
        }"`;
        break;

      case 3:
        question = `What could happen if this concept is misunderstood?\n"${
          sentences[2] || sentences[0]
        }"`;
        break;

      default:
        question = "You have completed the study session. Good job!";
    }

    return res.json({
      question,
      step,
    });
  } catch (err) {
    console.error("CHAT ERROR:", err);
    return res.status(500).json({
      error: "Chat failed",
    });
  }
}
