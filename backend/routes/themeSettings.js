import express from "express";
import db from "../config/db.js";
import { authenticateToken } from "../utils/jwt.js";

const router = express.Router();

// POST /api/theme-settings
router.post("/", authenticateToken, async (req, res) => {
  const {
    displayUsername,  // ユーザーが入力した表示用の名前
    is_gradient,
    primary_color,
    secondary_color,
    username_font_color,
    url_font_color,
    profile_image,
    background_image,
    is_link_background_transparent,
    link_background_color,
    link_background_secondary_color,
    link_background_opacity,
    is_link_background_gradient,
  } = req.body;

  if (!displayUsername) {
    return res.status(400).json({ message: "表示用ユーザー名 (displayUsername) は必須です" });
  }

  try {
    const userId = req.user.id;
    // 既存のテーマ設定を削除（user_idで紐づけ）
    await db.query("DELETE FROM theme_settings WHERE user_id = $1", [userId]);

    // INSERT文に背景透明度を追加
    const insertQuery = `
      INSERT INTO theme_settings 
        (user_id, display_username, is_gradient, primary_color, secondary_color, username_font_color, url_font_color, profile_image, background_image, is_link_background_transparent, link_background_color, link_background_secondary_color, link_background_opacity, is_link_background_gradient)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    `;
    await db.query(insertQuery, [
      userId,
      displayUsername,
      is_gradient,
      primary_color,
      secondary_color,
      username_font_color,
      url_font_color,
      profile_image,
      background_image,
      is_link_background_transparent,
      link_background_color,
      link_background_secondary_color,
      link_background_opacity,
      is_link_background_gradient,
    ]);
    res.status(200).json({ message: "Theme settings updated successfully." });
  } catch (error) {
    console.error("Error updating theme settings:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// GET /api/theme-settings - 認証済みユーザーのテーマ設定を取得する
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { rows } = await db.query("SELECT * FROM theme_settings WHERE user_id = $1", [userId]);
    if (rows.length === 0) {
      return res.status(200).json({ settings: {} });
    }
    return res.status(200).json({ settings: rows[0] });
  } catch (error) {
    console.error("テーマ設定取得エラー:", error);
    return res.status(500).json({ message: "サーバーエラー" });
  }
});

export default router;