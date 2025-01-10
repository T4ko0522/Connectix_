ALTER USER `root`@`%` IDENTIFIED WITH mysql_native_password BY 'password';
ALTER USER `root`@`localhost` IDENTIFIED WITH mysql_native_password BY 'password';

ALTER USER `Admin`@`%` IDENTIFIED WITH mysql_native_password BY '55n3ioesdgREGH46hjo';

-- 設定を適用
FLUSH PRIVILEGES;
