import PropTypes from 'prop-types';
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail(props) {
    const { triggerAlert } = props;
    const navigate = useNavigate();

    useEffect(() => {
        const verifyUser = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get("token");

            if (!token) {
                triggerAlert('error','failed','認証トークンが見つかりません。');
                navigate("/sign-in");
                return;
            }

            try {
                const response = await fetch(`http://localhost:3522/verify/verify_email?token=${token}`);

                const result = await response.json();

                if (!response.ok) {
                    alert(result.message || "メール認証に失敗しました。");
                    navigate("/sign-in");
                    return;
                }

                triggerAlert('success','成功','メール認証が完了しました！');

                // ✅ 認証後、自動ログイン
                localStorage.setItem("jwt_token", result.token);
                navigate("/");

            } catch (error) {
                console.error("認証エラー:", error);
                triggerAlert('error','failed','サーバーエラーが発生しました。');
                navigate("/sign-in");
            }
        }

        verifyUser();
    }, [navigate]);

    return <p>認証中</p>;
}

VerifyEmail.propTypes = {
  triggerAlert: PropTypes.func.isRequired,
};