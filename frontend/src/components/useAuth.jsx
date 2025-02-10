import { useEffect, useState } from "react";

const useAuth = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("jwt_token");

            if (!token) {
                setUser(null);
                return;
            }

            try {
                // const response = await fetch('http://localhost:3522/auth/user', {
                const response = await fetch('https://connectix-server.vercel.app/auth/user', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const result = await response.json();

                if (response.ok) {
                    setUser(result);
                } else {
                    localStorage.removeItem("jwt_token");
                    setUser(null);
                }
            } catch (error) {
                console.error("ユーザー取得エラー:", error);
                setUser(null);
            }
        };

        fetchUser();
    }, []);

    return user;
};

export default useAuth;