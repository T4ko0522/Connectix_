import express from "express";
import db from "../config/db.js";
import { authenticateToken } from "../utils/jwt.js";

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  const { username, links } = req.body;
  if (!username || !Array.isArray(links)) {
    return res.status(400).json({ message: "Invalid request data." });
  }

  try {
    await db.query("BEGIN");

    // 現在のリンク数を取得
    const { rows: countRows } = await db.query(
      "SELECT COUNT(*) FROM links WHERE username = $1",
      [username]
    );
    const currentCount = parseInt(countRows[0].count, 10);

    for (const link of links) {
      if (currentCount >= 10) {
        await db.query(
          "DELETE FROM links WHERE id = (SELECT id FROM links WHERE username = $1 ORDER BY id ASC LIMIT 1)",
          [username]
        );
      }

      // 新しいリンクを挿入
      await db.query(
        "INSERT INTO links (id, username, title, url, type, custom_icon) VALUES ($1, $2, $3, $4, $5, $6)",
        [link.id, username, link.title, link.url, link.type, link.custom_icon]
      );
    }

    await db.query("COMMIT");
    res.status(200).json({ message: "Links saved successfully." });
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error saving links:", error);
    res.status(500).json({ message: "Server error." });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const { rows: userRows } = await db.query(
      "SELECT username FROM users WHERE id = $1",
      [req.user.id]
    );
    if (userRows.length === 0) {
      return res.status(404).json({ message: "ユーザーが見つかりません" });
    }
    const username = userRows[0].username;

    const { rows } = await db.query(
      "SELECT * FROM links WHERE username = $1 ORDER BY id DESC",
      [username]
    );

    return res.status(200).json({ links: rows });
  } catch (error) {
    console.error("リンク取得エラー:", error);
    return res.status(500).json({ message: "サーバーエラー" });
  }
});

export default router;