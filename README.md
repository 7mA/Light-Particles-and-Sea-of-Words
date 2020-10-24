# 光粒子とコトバの海 | Light Particles and Sea of Words

初音ミク「マジカルミライ 2020」プログラミング・コンテスト応募作品

デブリに見えるほどの無数の光粒子とグリーンライツを放つ流星をイメージにした物語。

やがてコトバたちがキミの命になってゆく。

TextAlive ホストと接続するか、アプリURLにクエリパラメータを指定すれば（詳細は下記）曲が選べます。

TextAlive ホストと接続された状態をテストするには [TextAlive App Debugger](https://developer.textalive.jp/app/run/?ta_app_url=[app URL]&ta_song_url=[song URL]) のページにアクセスしてください。

- API IF: https://developer.textalive.jp/app/
- App URL: https://textalivejp.github.io/textalive-app-basic/

## 違う楽曲で試すには

TextAlive App API で開発されたWebアプリケーションは、（特定の楽曲向けに作り込んでいない限り）URLのクエリパラメタで `ta_song_url={楽曲のURL}` を指定すると異なる楽曲で演出を試せます。

- [ブレス・ユア・ブレス by 和田たけあき feat. 初音ミク](https://[app URL]/?ta_song_url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Da-Nf3QUFkOU)
- [グリーンライツ・セレナーデ by Omoi feat. 初音ミク](https://[app URL]/?ta_song_url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DXSLhsjepelI)

## 開発

[Node.js](https://nodejs.org/) をインストールしている環境で以下のコマンドを実行すると、開発用サーバが起動します。

```sh
npm install
npm run dev
```

## ビルド

以下のコマンドで `docs` 以下にビルド済みファイルが生成されます。 [サンプルコードのデモページ](https://[app URL]) は [GitHub Pages](https://pages.github.com/) で、このリポジトリの `docs` 以下のファイルが提供されています。

```sh
npm run build
```

## TextAlive App API

![TextAlive](https://i.gyazo.com/thumb/1000/5301e6f642d255c5cfff98e049b6d1f3-png.png)

TextAlive App API は、音楽に合わせてタイミングよく歌詞が動くWebアプリケーション（リリックアプリ）を開発できるJavaScript用のライブラリです。

TextAlive App API について詳しくはWebサイト [TextAlive for Developers](https://developer.textalive.jp/) をご覧ください。

---
[github URL]
