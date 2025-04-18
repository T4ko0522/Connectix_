import express from "express";
import db from "../config/db.js";
import { authenticateToken } from "../utils/jwt.js";

const router = express.Router();

// POST /api/links
router.post("/", authenticateToken, async (req, res) => {
  const { links } = req.body;
  if (!Array.isArray(links)) {
    return res.status(400).json({ message: "Invalid request data." });
  }

  try {
    await db.query("BEGIN");

    // 送信されたリンクをすべて upsert する
    for (const link of links) {
      await db.query(
        `INSERT INTO links (id, user_id, title, url, type, custom_icon, order_num)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE 
         SET title = EXCLUDED.title,
             url = EXCLUDED.url,
             type = EXCLUDED.type,
             custom_icon = EXCLUDED.custom_icon,
             order_num = EXCLUDED.order_num`,
        [link.id, req.user.id, link.title, link.url, link.type, link.custom_icon, link.order_num]
      );
    }
    
    // DB にあるリンクの中で、送信されたリンク一覧に含まれていないものを削除する
    if (links.length > 0) {
      const ids = links.map(link => link.id);
      // プレースホルダを動的に作成。例: "$2, $3, ..." （最初のパラメータは user_id）
      const placeholders = ids.map((_, i) => `$${i + 2}`).join(", ");
      await db.query(
        `DELETE FROM links WHERE user_id = $1 AND id NOT IN (${placeholders})`,
        [req.user.id, ...ids]
      );
    } else {
      // もし送信されたリンクが空なら、ユーザーの全リンクを削除
      await db.query("DELETE FROM links WHERE user_id = $1", [req.user.id]);
    }

    await db.query("COMMIT");
    res.status(200).json({ message: "Links saved successfully." });
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error saving links:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// GET /api/links
router.get("/", authenticateToken, async (req, res) => {
  try {
    // デフォルトの並び順を order_num ASC に変更
    // クエリパラメータで order_by=id_desc を指定した場合は id DESC とする
    const orderBy = req.query.order_by === "id_desc" ? "id DESC" : "order_num ASC";

    const { rows } = await db.query(
      `SELECT * FROM links WHERE user_id = $1 ORDER BY ${orderBy}`,
      [req.user.id]
    );
    return res.status(200).json({ links: rows });
  } catch (error) {
    console.error("リンク取得エラー:", error);
    return res.status(500).json({ message: "サーバーエラー" });
  }
});

export default router;