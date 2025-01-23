# 開発時のメモです

## TODO
### Backend
1. ユーザーネーム重複時の例外処理を書く。→現状だとAlertでサーバーエラーと出る。
2. Gmailのメソッドを使って自動でメール送信→パスワードリセット、2FAに使う
3. API実装
Profiles.js→名前、アイコン、bioをSQLに保存するためのAPI
Analytics.js→閲覧数、クリック回数、ip、UserAgentをSQLに保存するためのAPI
SocialLinks.js→インスタ、Twitter、VRCなどのテンプレートを用意しといてそのプロフィールをMySQLに保存するAPI
Themes.js→背景色、テキストカラーをMySQLに保存するAPI
UsersInfo.js→ユーザーのアイコン、作成日、アップロード日などを詳細にMySQLに保存するAPI
4. GoogleOAuth、AppleOAuth実装

### Frontend
1. ヘッダーの右上のAccountにもし、MySQLにアイコンが保存されていたらそれを表示する
2. index、Update、お問い合わせページを作る

## CommamdLine
### docker
docker-compose up -d 解説：バックグラウンドでコンテナ起動
docker-compos down -v 解説：volumesを削除
docker system df -v 解説：利用されているデータを詳細に表示
docker ps -a 解説：コンテナIDを取得できる
docker exec <container-id> bash 解説：MySQL exec
docker exec <container-id> /bin/sh 解説：普通のexec

### MySQL
mysql -uroot -p 解説：ログイン
SHOW DATABASES; 解説：データベース一覧表示 DATABASE'S'なのでそこに注意