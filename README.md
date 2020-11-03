# 光粒子とコトバの海 | Light Particles and Sea of Words

![イメージ図](https://i.gyazo.com/eb21f6a5b8c8e6cb54ea6fef9bbceee0.gif)

初音ミク「マジカルミライ 2020」プログラミング・コンテスト応募作品

デブリに見えるほどの無数の光粒子とグリーンライツを放つ流星をイメージにした物語。

やがてコトバたちがキミの命になってゆく。

TextAlive ホストと接続するか、アプリURLにクエリパラメータを指定すれば曲が選べます。

TextAlive ホストと接続された状態をテストするには [TextAlive App Debugger](https://developer.textalive.jp/app/run) のページにアクセスしてください。

- API IF: https://developer.textalive.jp/app/

## プログラムならではの演出互換性

プログラムの優秀な互換性を生かし、どんな曲でもふさわしい映像演出ができます。

```JavaScript
// YouTube
player.createFromSongUrl("http://www.youtube.com/watch?v=XSLhsjepelI");

// Piapro
player.createFromSongUrl("https://piapro.jp/t/C0lr/20180328201242");

// Niconico
player.createFromSongUrl("http://www.nicovideo.jp/watch/sm32459303");
```

## 楽曲の中にある秘密を掘り出す

聞こえる音声以外には、楽曲に隠れる情報をよく掘り出して、ビジュアライズします。

### ビートに合わせて回転し続ける光の球、発声タイミングと一緒に出てくる歌詞
![ビート、歌詞](https://i.gyazo.com/5d957de292b97e43754ae07fe91b4e16.gif)

### コード進行に従うバーチャルキーボード、さらにサビと一緒に盛り上がる
![キーボード](https://i.gyazo.com/293280dccd4bc98fa33c55584b097aca.gif)

### 間奏でも音量で曲の熱意を伝える
![音量](https://i.gyazo.com/49c19aa493987873732312bd1a944eee.gif)

## 自分で演出をカスタマイズしよう

「詳細設定」ではさらにカスタマイズができます。
ピアプロキャラクターのイメージ色に合わせて、曲の映像も変えます。
![](https://i.gyazo.com/6258bb73246c93c4b559a1e3db7fcfa2.gif)

キーボードがあるのに、弾けないともったいない！
「マニュアルモード」では、PCのキーボードでも映像演出をカスタマイズできます。
![](https://i.gyazo.com/2eba20ebe73e0e7a81cbcdf4bf406ecc.gif)

## やがて言葉がキミになってゆく

目の前にある言葉たちを集め、その声の果てまで見渡そう。

![](https://i.gyazo.com/5dfb04a4bf5570b3957da5dee6ce4d1f.gif)
![](https://i.gyazo.com/f62943e436708330b51ff30bdec7cd9c.gif)

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
