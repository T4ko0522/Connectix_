import express from "express";
import db from "../config/db.js";
import { authenticateToken } from "../utils/jwt.js";

const router = express.Router();

// POST /api/links
// リクエストボディ例:
// {
//   "username": "exampleUser",
//   "links": [
//     { "id": "123", "title": "Link 1", "url": "https://example.com", "type": "link", "custom_icon": null },
//     { "id": "456", "title": "Link 2", "url": "https://example.org", "type": "instagram", "custom_icon": "data:image/png;base64,..." }
//   ]
// }

router.post("/", authenticateToken, async (req, res) => {
  const { username, links } = req.body;
  if (!username || !Array.isArray(links)) {
    return res.status(400).json({ message: "Invalid request data." });
  }

  try {
    await db.query("BEGIN");
    // 既存のリンクを削除
    await db.query("DELETE FROM links WHERE username = $1", [username]);
    // 新規リンクを挿入
    for (const link of links) {
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
    // トークンからユーザーの id を取得して、ユーザーの username を取得する
    const { rows: userRows } = await db.query("SELECT username FROM users WHERE id = $1", [req.user.id]);
    if (userRows.length === 0) {
      return res.status(404).json({ message: "ユーザーが見つかりません" });
    }
    const username = userRows[0].username;
    // その username に紐づくリンク情報を取得する
    const { rows } = await db.query("SELECT * FROM links WHERE username = $1", [username]);
    return res.status(200).json({ links: rows });
  } catch (error) {
    console.error("リンク取得エラー:", error);
    return res.status(500).json({ message: "サーバーエラー" });
  }
});

export default router;