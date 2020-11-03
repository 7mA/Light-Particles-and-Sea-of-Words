# 光粒子とコトバの海 | Light Particles and Sea of Words

初音ミク「マジカルミライ 2020」プログラミング・コンテスト応募作品

デブリに見えるほどの無数の光粒子とグリーンライツを放つ流星をイメージにした物語。

やがてコトバたちがキミの命になってゆく。

TextAlive ホストと接続するか、アプリURLにクエリパラメータを指定すれば（詳細は下記）曲が選べます。

TextAlive ホストと接続された状態をテストするには [TextAlive App Debugger](https://developer.textalive.jp/app/run) のページにアクセスしてください。

- API IF: https://developer.textalive.jp/app/
- App URL: https://textalivejp.github.io/textalive-app-basic/


## 開発

[Node.js](https://nodejs.org/) をインストールしている環境で以下のコマンドを実行すると、開発用サーバが起動します。

```sh
npm install
npm run dev
```

## ビルド

以下のコマンドで `docs` 以下にビルド済みファイルが生成されます。

```sh
npm run build
```

## TextAlive App API

![TextAlive](https://i.gyazo.com/thumb/1000/5301e6f642d255c5cfff98e049b6d1f3-png.png)

TextAlive App API は、音楽に合わせてタイミングよく歌詞が動くWebアプリケーション（リリックアプリ）を開発できるJavaScript用のライブラリです。

TextAlive App API について詳しくはWebサイト [TextAlive for Developers](https://developer.textalive.jp/) をご覧ください。

---
https://github.com/7mA/Light-Particles-and-Sea-of-Words
