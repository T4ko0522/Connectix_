import express from "express";
import db from "../config/db.js";

const router = express.Router();

// GET /api/public-profile/:username
// 指定された username（ユーザーアカウントのusername）に基づいて、
// 対応する theme_settings と links を取得して返す
router.get("/:username", async (req, res) => {
  const { username } = req.params;
  try {
    // usersテーブルから該当のユーザーを取得
    const { rows: userRows } = await db.query(
      "SELECT id, username FROM users WHERE username = $1",
      [username]
    );
    if (userRows.length === 0) {
      return res.status(404).json({ message: "ユーザーが見つかりません" });
    }
    const user = userRows[0];

    // theme_settings テーブルは user_id に紐付けて保存しているので、user.id を使って取得
    const { rows: themeRows } = await db.query(
      "SELECT * FROM theme_settings WHERE user_id = $1",
      [user.id]
    );

    // links テーブルも同様に、ユーザーのアカウントusername（あるいは user.id で管理している場合はそれ）を利用
    // ここでは、links テーブルはユーザーのアカウントのusernameで保存している前提とする
    const { rows: linkRows } = await db.query(
      "SELECT * FROM links WHERE username = $1 ORDER BY id",
      [user.username]
    );

    res.status(200).json({
      themeSettings: themeRows.length > 0 ? themeRows[0] : null,
      links: linkRows
    });
  } catch (error) {
    console.error("Error fetching public profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;