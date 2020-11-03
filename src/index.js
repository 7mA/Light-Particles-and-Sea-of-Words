/**
 * 光粒子とコトバの海
 * https://github.com/7mA/Light-Particles-and-Sea-of-Words
 *
 * デブリに見えるほどの無数の光粒子とグリーンライツを放つ流星をイメージにした物語。
 * やがてコトバたちがキミの命になってゆく。
 * TextAlive ホストと接続するか、アプリURLにクエリパラメータを指定すれば（詳細はREADME.md）曲が選べます。
 * https://developer.textalive.jp/app/run/
 * APP URL： https://7ma.github.io/Light-Particles-and-Sea-of-Words/ (審査後公開)
 */

import { Player, Ease } from "textalive-app-api";
import Lottie from "lottie-web";
import P5 from "p5";
import Sans from './assets/NotoSansJP-Regular.otf';
import Mplus from './assets/MPLUS1p-Bold.ttf';
import Splash0 from './assets/lottie_splash_0.json'
import Splash1 from './assets/lottie_splash_1.json'
import Splash2 from './assets/lottie_splash_2.json'
import Splash3 from './assets/lottie_splash_3.json'
import Splash4 from './assets/lottie_splash_4.json'
import Splash5 from './assets/lottie_splash_5.json'
import Loader from './assets/futur-loader.json'
import Star from './assets/lottie_star.json'
import Butterfly0 from './assets/butterfly_0.png'
import Butterfly1 from './assets/butterfly_1.png'
import Butterfly2 from './assets/butterfly_2.png'
import Butterfly3 from './assets/butterfly_3.png'
import Butterfly4 from './assets/butterfly_4.png'
import Butterfly5 from './assets/butterfly_5.png'
import Character0 from './assets/mikuv4x.png'
import Character1 from './assets/lenv4x.png'
import Character2 from './assets/rinv4x.png'
import Character3 from './assets/lukav4x.png'
import Character4 from './assets/meikov3.png'
import Character5 from './assets/kaitov3.png'

const playBtn = document.querySelector("#play");
const rewindBtn = document.querySelector("#rewind");
const positionEl = document.querySelector("#position strong");
const closeDescriptionBtn = document.querySelector("#close-description");
const openSettingsBtn = document.querySelector("#open-settings");
const closeSettingsBtn = document.querySelector("#close-settings");

const themeColorSelector = document.querySelector("#themeColor");
const keyboardModeSelector = document.querySelector("#keyboardMode");
const keyboardModeHelp = document.querySelector("#keyboardModeHelp");
const frameRateCheckbox = document.querySelector("#frameRate");
const licenseBtn = document.querySelector("#license");

const lottieSplashContainer = document.querySelector("#lottie-splash");
const lottieLoaderContainer = document.querySelector("#lottie-loader");
const lottieStarContainer = document.querySelector("#lottie-star");

let video;
let isValenceArousalValid = true;
let chorusFlag = false;
let criticalBeatIndex = -1;
let maxBallRadius = 1;
let meteorRadius = 2;
let ballSpeed = 40;
let maxVocalAmplitude = 100000;
let lyricStartTime;
let sphereCompleteTime;
let titleStartTime;
let titleEndTime;
let title;
let artist;
let currentSplashIndex = 0;
let outroFlag = false;
let outroStartTime = 0;
let beamStartTime = 0;
let beamEndTime = 0;
let loadStartTime = 0;
let loadEndTime = 0;
let loadTime = 0;
let loadFlag = false;
let phraseCount;
let songEndTime;
let phraseBeamCount;
let collectionVocalAmplitudeArray = [];
let phraseBeamArray = [];

let themeColor = 0;
let manualMode = false;
let fpsFlag = true;

let keyPressedFlags = [false, false, false, false, false, false, false, false, false, false, false, false, false];

let subSatelliteRevolutionRedius = 200;
let maxMainSatelitteRevolutionRedius = subSatelliteRevolutionRedius * 1.618;

let lottieSplashAnimation = Lottie.loadAnimation({
  container: lottieSplashContainer,
  renderer: "svg",
  loop: false,
  autoplay: false,
  animationData: Splash0,
  rendererSettings: {
    id: 'splash'
  },
});
lottieSplashAnimation.goToAndStop();

let lottieLoaderAnimation = Lottie.loadAnimation({
  container: lottieLoaderContainer,
  renderer: "svg",
  loop: true,
  autoplay: false,
  animationData: Loader,
  rendererSettings: {
    id: 'loader'
  },
});
lottieLoaderAnimation.goToAndStop();

let lottieStarAnimation = Lottie.loadAnimation({
  container: lottieStarContainer,
  renderer: "svg",
  loop: false,
  autoplay: false,
  animationData: Star,
  rendererSettings: {
    id: 'star'
  },
})
lottieStarAnimation.goToAndStop();
lottieStarAnimation.onComplete = () => {
  lottieStarAnimation.goToAndStop();
}

let butterfly = Butterfly0;
let character = Character0;

let coordinateMatrix = [
  [-234, 150, -219, 150, -434, 310, -474, 310], // B
  [-194, 150, -179, 150, -349, 310, -394, 310], // C
  [-136, 130, -122, 130, -239, 270, -274, 270], // C#
  [-116, 150, -96, 150, -189, 310, -239, 310], // D
  [-64, 130, -49, 130, -96, 270, -134, 270], // D#
  [-34, 150, -14, 150, -24, 310, -69, 310], // E
  [6, 150, 26, 150, 58, 310, 10, 310], // F
  [41, 130, 58, 130, 120, 270, 80, 270], // F#
  [86, 150, 106, 150, 216, 310, 176, 310], // G
  [111, 130, 126, 130, 256, 270, 220, 270], // G#
  [164, 150, 184, 150, 376, 310, 336, 310], // A
  [181, 130, 196, 130, 401, 270, 368, 270], // A#
  [246, 150, 266, 150, 541, 310, 506, 310] // B
]

let chordNameMatrix = [
  [], // B
  ["C", "C7", "Cm", "Cm7", "CM7", "CmM7", "Csus4", "C7sus4", "Cdim", "Cm7-5", "Caug", "Cadd9", "C6", "Cm6",
    "C#M7", "C#mM7",
    "D7", "Dm7", "D7sus4", "Dm7-5",
    "D#dim", "D#6", "D#m6",
    "Eaug",
    "F", "F7", "Fm", "Fm7", "FM7", "FmM7", "Fsus4", "F7sus4", "Fadd9", "F6", "Fm6",
    "F#dim", "F#m7-5",
    "Gsus4", "G7sus4",
    "G#", "G#7", "G#M7", "G#aug", "G#6", "G#M9",
    "Am", "Am7", "AmM7", "Adim", "Am7-5", "Am6",
    "A#add9"], // C
  ["C#", "C#7", "C#m", "C#m7", "C#M7", "C#mM7", "C#sus4", "C#7sus4", "C#dim", "C#m7-5", "C#aug", "C#add9", "C#6", "C#m6", "C#sus2",
    "DM7", "DmM7",
    "D#7", "D#m7", "D#7sus4", "D#m7-5",
    "Edim", "E6", "Em6",
    "Faug",
    "F#", "F#7", "F#m", "F#m7", "F#M7", "F#mM7", "F#sus4", "F#7sus4", "F#add9", "F#6", "F#m6",
    "Gdim", "Gm7-5",
    "G#sus4", "G#7sus4",
    "A", "A7", "AM7", "Aaug", "A6",
    "A#m", "A#m7", "A#mM7", "A#dim", "A#m7-5", "A#m6",
    "Badd9"], // C#
  ["Cadd9",
    "D", "D7", "Dm", "Dm7", "DM7", "DmM7", "Dsus4", "D7sus4", "Ddim", "Dm7-5", "Daug", "Dadd9", "D6", "Dm6",
    "D#M7", "D#mM7",
    "E7", "Em7", "E7sus4", "Em7-5",
    "Fdim", "F6", "Fm6",
    "F#aug",
    "G", "G7", "Gm", "Gm7", "GM7", "GmM7", "Gsus4", "G7sus4", "Gadd9", "G6", "Gm6",
    "G#dim", "G#m7-5",
    "Asus4", "A7sus4",
    "A#", "A#7", "A#M7", "A#aug", "A#6",
    "Bm", "Bm7", "BmM7", "Bdim", "Bm7-5", "Bm6"], // D
  ["Cm", "Cm7", "CmM7", "Cdim", "Cm7-5", "Cm6",
    "C#add9", "C#sus2",
    "D#", "D#7", "D#m", "D#m7", "D#M7", "D#mM7", "D#sus4", "D#7sus4", "D#dim", "D#m7-5", "D#aug", "D#add9", "D#6", "D#m6", "D#sus2",
    "EM7", "EmM7",
    "F7", "Fm7", "F7sus4", "Fm7-5",
    "F#dim", "F#6", "F#m6",
    "Gaug",
    "G#", "G#7", "G#m", "G#m7", "G#M7", "G#mM7", "G#sus4", "G#7sus4", "G#add9", "G#6", "G#m6", "G#M9",
    "Adim", "Am7-5",
    "A#sus4", "A#7sus4",
    "B", "B7", "BM7", "Baug", "B6"], // D#
  ["C", "C7", "CM7", "Caug", "C6",
    "C#m", "C#m7", "C#mM7", "C#dim", "C#m7-5", "C#m6",
    "Dadd9",
    "E", "E7", "Em", "Em7", "EM7", "EmM7", "Esus4", "E7sus4", "Edim", "Em7-5", "Eaug", "Eadd9", "E6", "Em6",
    "FM7", "FmM7",
    "F#7", "F#m7", "F#7sus4", "F#m7-5",
    "Gdim", "G6", "Gm6",
    "G#aug",
    "A", "A7", "Am", "Am7", "AM7", "AmM7", "Asus4", "A7sus4", "Aadd9", "A6", "Am6",
    "A#dim", "A#m7-5",
    "Bsus4", "B7sus4"], // E
  ["Csus4", "C7sus4",
    "C#", "C#7", "C#M7", "C#aug", "C#6",
    "Dm", "Dm7", "DmM7", "Ddim", "Dm7-5", "Dm6",
    "D#add9", "D#sus2",
    "F", "F7", "Fm", "Fm7", "FM7", "FmM7", "Fsus4", "F7sus4", "Fdim", "Fm7-5", "Faug", "Fadd9", "F6", "Fm6",
    "F#M7", "F#mM7",
    "G7", "Gm7", "G7sus4", "Gm7-5",
    "G#dim", "G#6", "G#m6",
    "Aaug",
    "A#", "A#7", "A#m", "A#m7", "A#M7", "A#mM7", "A#sus4", "A#7sus4", "A#add9", "A#6", "A#m6",
    "Bdim", "Bm7-5"], // F
  ["Cdim", "Cm7-5",
    "C#sus4", "C#7sus4",
    "D", "D7", "DM7", "Daug", "D6",
    "D#m", "D#m7", "D#mM7", "D#dim", "D#m7-5", "D#m6",
    "Eadd9",
    "F#", "F#7", "F#m", "F#m7", "F#M7", "F#mM7", "F#sus4", "F#7sus4", "F#dim", "F#m7-5", "F#aug", "F#add9", "F#6", "F#m6",
    "GM7", "GmM7",
    "G#7", "G#m7", "G#7sus4", "G#m7-5",
    "Adim", "A6", "Am6",
    "A#aug",
    "B", "B7", "Bm", "Bm7", "BM7", "BmM7", "Bsus4", "B7sus4", "Badd9", "B6", "Bm6"], // F#
  ["C", "C7", "Cm", "Cm7", "CM7", "CmM7", "Csus4", "C7sus4", "Cadd9", "C6", "Cm6",
    "C#dim", "C#m7-5",
    "Dsus4", "D7sus4",
    "D#", "D#7", "D#M7", "D#aug", "D#6",
    "Em", "Em7", "EmM7", "Edim", "Em7-5", "Em6",
    "Fadd9",
    "G", "G7", "Gm", "Gm7", "GM7", "GmM7", "Gsus4", "G7sus4", "Gdim", "Gm7-5", "Gaug", "Gadd9", "G6", "Gm6",
    "G#M7", "G#mM7", "G#M9",
    "A7", "Am7", "A7sus4", "Am7-5",
    "A#dim", "A#6", "A#m6",
    "Baug"], // G
  ["Caug",
    "C#", "C#7", "C#m", "C#m7", "C#M7", "C#mM7", "C#sus4", "C#7sus4", "C#add9", "C#6", "C#m6", "C#sus2",
    "Ddim", "Dm7-5",
    "D#sus4", "D#7sus4",
    "E", "E7", "EM7", "Eaug", "E6",
    "Fm", "Fm7", "FmM7", "Fdim", "Fm7-5", "Fm6",
    "F#add9",
    "G#", "G#7", "G#m", "G#m7", "G#M7", "G#mM7", "G#sus4", "G#7sus4", "G#dim", "G#m7-5", "G#aug", "G#add9", "G#6", "G#m6", "G#M9",
    "AM7", "AmM7",
    "A#7", "A#m7", "A#7sus4", "A#m7-5",
    "Bdim", "B6", "Bm6"], //G#
  ["Cdim", "C6", "Cm6",
    "C#aug",
    "D", "D7", "Dm", "Dm7", "DM7", "DmM7", "Dsus4", "D7sus4", "Dadd9", "D6", "Dm6",
    "D#dim", "D#m7-5",
    "Esus4", "E7sus4",
    "F", "F7", "FM7", "Faug", "F6",
    "F#m", "F#m7", "F#mM7", "F#dim", "F#m7-5", "F#m6",
    "Gadd9",
    "A", "A7", "Am", "Am7", "AM7", "AmM7", "Asus4", "A7sus4", "Adim", "Am7-5", "Aaug", "Aadd9", "A6", "Am6",
    "A#M7", "A#mM7",
    "B7", "Bm7", "B7sus4", "Bm7-5"], // A
  ["C7", "Cm7", "C7sus4", "Cm7-5",
    "C#dim", "C#6", "C#m6",
    "Daug",
    "D#", "D#7", "D#m", "D#m7", "D#M7", "D#mM7", "D#sus4", "D#7sus4", "D#add9", "D#6", "D#m6", "D#sus2",
    "Edim", "Em7-5",
    "Fsus4", "F7sus4",
    "F#", "F#7", "F#M7", "F#aug", "F#6",
    "Gm", "Gm7", "GmM7", "Gdim", "Gm7-5", "Gm6",
    "G#add9", "G#M9",
    "A#", "A#7", "A#m", "A#m7", "A#M7", "A#mM7", "A#sus4", "A#7sus4", "A#dim", "A#m7-5", "A#aug", "A#add9", "A#6", "A#m6",
    "BM7", "BmM7"], // A#
  ["CM7", "CmM7",
    "C#7", "C#m7", "C#7sus4", "C#m7-5",
    "Ddim", "D6", "Dm6",
    "D#aug",
    "E", "E7", "Em", "Em7", "EM7", "EmM7", "Esus4", "E7sus4", "Eadd9", "E6", "Em6",
    "Fdim", "Fm7-5",
    "F#sus4", "F#7sus4",
    "G", "G7", "GM7", "Gaug", "G6",
    "G#m", "G#m7", "G#mM7", "G#dim", "G#m7-5", "G#m6",
    "Aadd9",
    "B", "B7", "Bm", "Bm7", "BM7", "BmM7", "Bsus4", "B7sus4", "Bdim", "Bm7-5", "Baug", "Badd9", "B6", "Bm6"] // B
]

// Miku, Len, Rin, Luka, Meiko, Kaito
const lightColorGradientArray = ["#8fd3f4", "#fafcc2", "#fff8cd", "#ffd5cd", "#fd7b5f", "#04befe"];
const heavyColorGradientArray = ["#84fab0", "#ccf6c8", "#ffe05d", "#fff8cd", "#c4486b", "#a3d2ca"];
const colorGradientArray = [
  ["#84fab0", "#00f2fe", "#8fd3f4", "#4facfe", "#8ec5fc", "#e0c3fc"],
  ["#ccf6c8", "#e3f6c8", "#fafcc2", "#fcf4c2", "#fceac2", "#fccdc2"],
  ["#ffe05d", "#ffe577", "#fff8cd", "#feffcd", "#f2ffcd", "#ffdacd"],
  ["#fff8cd", "#fff0cd", "#ffd5cd", "#ffcdcd", "#ffcdda", "#f2cdff"],
  ["#c4486b", "#c4484c", "#fd7b5f", "#fd6646", "#fd8546", "#fde146"],
  ["#a3d2ca", "#a3d2d2", "#04befe", "#37cbfe", "#37ecfe", "#37fede"],
]
// 流星、Satellite、波形用色
const satelliteColorArray = ["#7fecad", "#edf492", "#ffe277", "#fab7b7", "#f56a79", "#88e1f2"];
// 流星、Satellite、波形用色(RGBモード）
const satelliteColorRgbArray = [
  [127, 236, 173],
  [237, 244, 146],
  [255, 226, 119],
  [250, 183, 183],
  [245, 106, 121],
  [136, 225, 242]
];
// Chorus歌詞用色
const chorusLyricsColorArray = ["#ccffcc", "#ffffcc", "#ffed77", "#ffcce5", "#f99aa4", "#9fe7f5"]
// Chorus歌詞用色（RGBモード）
const chorusLyricsColorRgbArray = [
  [204, 255, 204],
  [255, 255, 204],
  [255, 237, 119],
  [255, 204, 229],
  [249, 154, 164],
  [159, 231, 245],
]
// Chorus以外歌詞用色
const nonChorusLyricsColorArray = ["#CCFFFF", "#e5ffcc", "#f2ffe6", "#fff3cc", "#ffe6cc", "#ccf3ff"];
// Chorus以外歌詞用色(RGBモード)
const nonChorusLyricsColorRgbArray = [
  [204, 255, 255],
  [229, 255, 204],
  [242, 255, 230],
  [255, 243, 204],
  [255, 230, 204],
  [204, 243, 255]
]

window.onblur = function() {
  keyPressedFlags = [false, false, false, false, false, false, false, false, false, false, false, false, false];
}

// TextAlive Player を作る
const player = new Player({
  app: {
    appAuthor: "Kaku",
    appName: "Light Particles and Sea of Words",
    parameters: [
        {
          title: "テーマカラー",
          name: "themeColor",
          className: "Select",
          params: [
            [0, "初音ミク"],
            [1, "鏡音レン"],
            [2, "鏡音リン"],
            [3, "巡音ルカ"],
            [4, "MEIKO"],
            [5, "KAITO"],
          ],
          initialValue: 0,
        },
        {
          title: "キーボードモード(キーボードが表示される場合のみ有効)",
          name: "keyboardMode",
          className: "Select",
          params: [
            [0, "コードモード(キーボードが曲のコード進行に従って自動に演出するモード)"],
            [1, "マニュアルモード(PC入力でキーボードの演出をカスタマイズできるモード)"]
          ],
          initialValue: 0,
        },
        {
          title: "フレームレート表示",
          name: "fpsFlag",
          className: "Check",
          initialValue: true,
        },
      ]
  },
  mediaElement: document.querySelector("#media"),
  valenceArousalEnabled: true,
  vocalAmplitudeEnabled: true,
});

// TextAlive Player のイベントリスナを登録する
player.addListener({
  onAppReady,
  onVideoReady,
  onTimerReady,
  onPlay,
  onValenceArousalLoad,
  onSeek,
  onAppParameterUpdate
});

/**
 * TextAlive App が初期化されたときに呼ばれる
 *
 * @param {IPlayerApp} app - https://developer.textalive.jp/packages/textalive-app-api/interfaces/iplayerapp.html
 */
function onAppReady(app) {
  closeDescriptionBtn.addEventListener(
    "click",
    () => {
      document.querySelector("#help").scrollTop = 0;
      document.querySelector("#help").style.display = "none";
      document.querySelector("#lottie-splash").style.display = "block";
      document.querySelector("#lottie-loader").style.display = "block";
      document.querySelector("#lottie-star").style.display = "block";
    }
  )

  // TextAlive ホストと接続されていなければ再生コントロールを表示する
  if (!app.managed) {
    document.querySelector("#control").style.display = "block";

    // 再生/一時停止ボタン
    playBtn.addEventListener("click", () => {
      if(player.isPlaying){
        player.video && player.requestPause();
      } else {
        player.video && player.requestPlay();
      }
    });

    // 巻き戻しボタン
    rewindBtn.addEventListener(
      "click",
      () => player.video && player.requestMediaSeek(0)
    );

    // 詳細設定を開く/閉じるボタン
    openSettingsBtn.addEventListener(
      "click",
      () => {
        if(document.querySelector("#settings").style.display == "block"){
          document.querySelector("#settings").style.display = "none";
          openSettingsBtn.innerHTML = "⏫詳細設定";
        } else if(document.querySelector("#settings").style.display == "none"){
          document.querySelector("#settings").style.display = "block";
          openSettingsBtn.innerHTML = "⏬詳細設定";
        }
      }
    )

    // テーマカラーセレクタ
    themeColorSelector.addEventListener(
      "change",
      (e) => {
        changeThemeColor(e.target.value);
      }
    )

    // キーボードモードセレクタ
    keyboardModeSelector.addEventListener(
      "change",
      (e) => {
        manualMode = (e.target.value === "1");
      }
    )

    // キーボードモードヘルプ
    keyboardModeHelp.addEventListener(
      "mouseover",
      () => {
        document.querySelector("#keyboardModeHelpContent").style.display = "block";
      }
    )
    keyboardModeHelp.addEventListener(
      "mouseout",
      () => {
        document.querySelector("#keyboardModeHelpContent").style.display = "none";
      }
    )

    // フレームレート表示チェックボックス
    frameRateCheckbox.addEventListener(
      "change",
      () => {
        fpsFlag = frameRateCheckbox.checked;
      }
    )

    // ライセンス情報表示
    licenseBtn.addEventListener(
      "click",
      () => {
        document.querySelector("#help").style.display = "block";
        document.querySelector("#description").style.display = "none";
        document.querySelector("#licenseInfo").style.display = "block";

      }
    )

    // グリーンライツ・セレナーデ / Omoi feat. 初音ミク
    // - 初音ミク「マジカルミライ 2018」テーマソング
    // - 楽曲: http://www.youtube.com/watch?v=XSLhsjepelI
    // - 歌詞: https://piapro.jp/t/61Y2
    player.createFromSongUrl("http://www.youtube.com/watch?v=XSLhsjepelI", {
      video: {
        // 音楽地図訂正履歴: https://songle.jp/songs/1249410/history
        beatId: 3818919,
        chordId: 1207328,
        repetitiveSegmentId: 1942131,
        // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/www.youtube.com%2Fwatch%3Fv%3DXSLhsjepelI
        lyricId: 50145,
        lyricDiffId: 3168
      }
    });

    // ブレス・ユア・ブレス / 和田たけあき feat. 初音ミク
    // - 初音ミク「マジカルミライ 2019」テーマソング
    // - 楽曲: http://www.youtube.com/watch?v=a-Nf3QUFkOU
    // - 歌詞: https://piapro.jp/t/Ytwu
    // player.createFromSongUrl("http://www.youtube.com/watch?v=a-Nf3QUFkOU", {
    //   video: {
    //     // 音楽地図訂正履歴: https://songle.jp/songs/1688650/history
    //     beatId: 3818481,
    //     chordId: 1546157,
    //     repetitiveSegmentId: 1942135,
    //     // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/www.youtube.com%2Fwatch%3Fv=a-Nf3QUFkOU
    //     lyricId: 50146,
    //     lyricDiffId: 3143
    //   }
    // });

    // 愛されなくても君がいる / ピノキオピー feat. 初音ミク
    // - 初音ミク「マジカルミライ 2020」テーマソング
    // - 楽曲: http://www.youtube.com/watch?v=ygY2qObZv24
    // - 歌詞: https://piapro.jp/t/PLR7
    // player.createFromSongUrl("http://www.youtube.com/watch?v=ygY2qObZv24", {
    //   video: {
    //     // 音楽地図訂正履歴: https://songle.jp/songs/1977449/history
    //     beatId: 3818852,
    //     chordId: 1955797,
    //     repetitiveSegmentId: 1942043,
    //     // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/www.youtube.com%2Fwatch%3Fv=ygY2qObZv24
    //     lyricId: 50150,
    //     lyricDiffId: 3158
    //   }
    // }

    //　ピアプロメディア例（METEOR ／ 初音ミク）
    // player.createFromSongUrl("https://piapro.jp/t/C0lr/20180328201242");

    // ニコニコ動画メディア例（四角い地球を丸くする / TOKOTOKO（西沢さんP））
    // player.createFromSongUrl("http://www.nicovideo.jp/watch/sm32459303");
  }

  let isValenceArousalValid = true;
}

/**
 * 動画オブジェクトの準備が整ったとき（楽曲に関する情報を読み込み終わったとき）に呼ばれる
 *
 * @param {IVideo} v - https://developer.textalive.jp/packages/textalive-app-api/interfaces/ivideo.html
 */
function onVideoReady(v) {
  title = player.data.song.name;
  artist = player.data.song.artist.name;

  video = v;

  maxVocalAmplitude = player.getMaxVocalAmplitude();
  const medianValenceArousal = player.getMedianValenceArousal();

  let medianArousal = 0;

  if(medianValenceArousal){
    medianArousal = medianValenceArousal.a;
  }

  ballSpeed = 40 * (1 - medianArousal);

  lyricStartTime = video.firstChar.startTime;
  sphereCompleteTime = lyricStartTime / 4;
  titleStartTime = lyricStartTime / 2;
  titleEndTime = lyricStartTime * 3 / 4;
  songEndTime = video.duration;

  outroFlag = false;
  outroStartTime = 0;
  beamStartTime = 0;
  beamEndTime = 0;
  loadStartTime = 0;
  loadEndTime = 0;
  loadTime = 0;
  loadFlag = false;
  phraseCount = 0;
  phraseBeamCount = 0;
  phraseBeamArray = [];
  let obj = document.querySelector("#loader");
  obj.style.opacity = 0;
}

/**
 * 音源の再生準備が完了した時に呼ばれる
 *
 * @param {Timer} t - https://developer.textalive.jp/packages/textalive-app-api/interfaces/timer.html
 */
function onTimerReady(t) {
  // ボタンを有効化する
  document
    .querySelectorAll("button")
    .forEach((btn) => (btn.disabled = false));

  closeDescriptionBtn.innerHTML = "閉じる";
}

// 再生が始まったら説明文を非表示に
function onPlay() {
  if(document.querySelector("#description").style.display !== "none"){
    document.querySelector("#help").scrollTop = 0;
    document.querySelector("#help").style.display = "none";
  }
  document.querySelector("#lottie-splash").style.display = "block";
  document.querySelector("#lottie-loader").style.display = "block";
  document.querySelector("#lottie-star").style.display = "block";
}

function onValenceArousalLoad(valenceArousal, reason) {
  if (reason) {
    isValenceArousalValid = false;
  }
  if(!valenceArousal.seq){
    isValenceArousalValid = false;
  }
}

function onSeek(){
  let obj = document.querySelector("#loader");
  obj.style.opacity = 0;
}

/**
 * カスタマイズパラメータ変更イベント
 *
 * @param {String} name
 * @param {Object} value
 */
function onAppParameterUpdate(name, value){
  if(name === "themeColor"){
    changeThemeColor(value);
  } else if(name === "keyboardMode"){
    manualMode = (value === 1);
  } else if(name === "fpsFlag"){
    fpsFlag = value;
  }
}

function splashOnPos(index, offsetX, offsetY) {
  if(currentSplashIndex == index) return;
  currentSplashIndex = index;

  let obj = document.querySelector("#splash");
  lottieSplashAnimation.setSpeed(1);
  lottieSplashAnimation.goToAndPlay(0);
  obj.style.marginLeft = offsetX;
  obj.style.marginTop = offsetY;
}

function starOnPos(offsetX, offsetY){
  let obj = document.querySelector("#star");
  lottieStarAnimation.setSpeed(1);
  lottieStarAnimation.goToAndPlay(0);
  obj.style.marginLeft = offsetX;
  obj.style.marginTop = offsetY;
}

function changeThemeColor(value){
  themeColor = parseInt(value);
  let splashAnimation;
  switch (themeColor) {
    case 0:
      splashAnimation = Splash0
      break;
    case 1:
      splashAnimation = Splash1
      break;
    case 2:
      splashAnimation = Splash2
      break;
    case 3:
      splashAnimation = Splash3
      break;
    case 4:
      splashAnimation = Splash4
      break;
    case 5:
      splashAnimation = Splash5
      break;
    default:
      break;
  }
  lottieSplashContainer.innerHTML = "";
  lottieSplashAnimation = Lottie.loadAnimation({
    container: lottieSplashContainer,
    renderer: "svg",
    loop: false,
    autoplay: false,
    animationData: splashAnimation,
    rendererSettings: {
      id: 'splash'
    },
  });
  lottieSplashAnimation.goToAndStop();
}

// p5.js を初期化
new P5((p5) => {
  // キャンバスの大きさなどを計算
  var originWidth = 1618;
  var originHeight = 1000;
  var width = window.innerWidth;
  var height = window.innerHeight;

  var widthProportion = width / originWidth;
  var heightProportion = height / originHeight;

  var balls = new Array(Math.round(500 * widthProportion));
  var r = width / 2;

  subSatelliteRevolutionRedius *= heightProportion;
  maxMainSatelitteRevolutionRedius *= widthProportion;

  let typeOffsetX = 0;
  let nextTypeOffsetX = 0;
  let currentTypePhraseIndex = 0;

  let currentPhraseIndex = 0;
  let nextPhrase;
  let nextIndex;
  let nextChorusAtStart;
  let nextChorusAtEnd;

  p5.disableFriendlyErrors = true;

  let charCollectionArray = [];
  let charCollectionArrayLength;
  let startPointArray = [];
  let maxCollectionVocalAmplitudeCount = 0;

  let sans;
  let mplus;
  let splash;
  let butterflyPic;
  let butterflySize;
  let butterflyPos;
  let characterPic;
  let characterName;
  let characterAspectRatio;

  let butterflyPic0;
  let butterflyPic1;
  let butterflyPic2;
  let butterflyPic3;
  let butterflyPic4;
  let butterflyPic5;

  let characterPic0;
  let characterPic1;
  let characterPic2;
  let characterPic3;
  let characterPic4;
  let characterPic5;

  let chordKeyboardFlag = true;
  if(height * 0.382 < 310 || width / 2 < 541) chordKeyboardFlag = false;

  // キャンバスを作成
  p5.setup = () => {
    p5.createCanvas(width, height, p5.WEBGL);

    sans = p5.loadFont(Sans);
    mplus = p5.loadFont(Mplus);
    p5.frameRate(48);

    butterflySize = 35;
    butterflyPos = p5.createVector(0,0);

    butterflyPic0 = p5.loadImage(Butterfly0);
    butterflyPic1 = p5.loadImage(Butterfly1);
    butterflyPic2 = p5.loadImage(Butterfly2);
    butterflyPic3 = p5.loadImage(Butterfly3);
    butterflyPic4 = p5.loadImage(Butterfly4);
    butterflyPic5 = p5.loadImage(Butterfly5);

    characterPic0 = p5.loadImage(Character0);
    characterPic1 = p5.loadImage(Character1);
    characterPic2 = p5.loadImage(Character2);
    characterPic3 = p5.loadImage(Character3);
    characterPic4 = p5.loadImage(Character4);
    characterPic5 = p5.loadImage(Character5);

    for(let i = 0; i < balls.length; i++){
      var s1 = p5.random(r);
      var s2 = p5.TWO_PI/360 * p5.random(360);
      var s3 = p5.TWO_PI/360 * p5.random(360);
      balls[i] = [s1 * p5.cos(s2), s1 * p5.sin(s2), s3, s1];
    }
  };

  p5.draw = () => {
    // プレイヤーが準備できていなかったら何もしない
    if (!player || !video) {
      return;
    }
    const position = player.timer.position;

    switch (themeColor) {
      case 0:
        butterflyPic = butterflyPic0;
        characterPic = characterPic0;
        characterName = "初音ミク";
        characterAspectRatio = 1.4;
        break;
      case 1:
        butterflyPic = butterflyPic1;
        characterPic = characterPic1;
        characterName = "鏡音レン";
        characterAspectRatio = 1.6;
        break;
      case 2:
        butterflyPic = butterflyPic2;
        characterPic = characterPic2;
        characterName = "鏡音リン";
        characterAspectRatio = 1.65;
        break;
      case 3:
        butterflyPic = butterflyPic3;
        characterPic = characterPic3;
        characterName = "巡音ルカ";
        characterAspectRatio = 1.43;
        break;
      case 4:
        butterflyPic = butterflyPic4;
        characterPic = characterPic4;
        characterName = "MEIKO";
        characterAspectRatio = 1.35;
        break;
      case 5:
        butterflyPic = butterflyPic5;
        characterPic = characterPic5;
        characterName = "KAITO";
        characterAspectRatio = 1.42;
        break;
      default:
        break;
    }

    const beat = player.findBeat(position);
    const chord = player.findChord(position);
    const segment = player.findChorus(position);
    const vocalAmplitude = player.getVocalAmplitude(position);
    const valenceArousal = player.getValenceArousal(position);

    const satelliteThemeColorRgb = satelliteColorRgbArray[themeColor];

    let beatIndex;
    let beatProgress;
    let chordName;
    let chorusIndex;

    if (beat) {
      beatIndex = beat.index
      beatProgress = beat.progress(position);
    }

    if(chord){
      chordName = player.findChord(position).name
    }

    if(segment){
       chorusIndex = (player.findChorus(position) == null) ? "" : player.findChorus(position).index;
    } else {
      chorusIndex = "";
    }

    if(valenceArousal){
      maxBallRadius = 1 + valenceArousal.v;
      meteorRadius = 2 * maxBallRadius;
    }

    p5.translate(-width / 2, -height / 2);
    p5.noStroke();
    p5.textFont(sans);
    p5.textAlign(p5.CENTER, p5.CENTER);

    // Sphere
    p5.background('#161823');
    p5.push();
    p5.noStroke();
    p5.fill("#f0fcff");
    p5.translate(width / 2, height * 0.382);
    let frameCount = p5.frameCount
    let ballsLength = balls.length
    var dAngle = p5.TWO_PI/360 * 23.5
    var dcos = p5.cos(dAngle);
    var dsin = p5.sin(dAngle);
    for(let i = 0; i < ballsLength; i++){
      let ball = balls[i];
      let angle = frameCount / ballSpeed + ball[2]
      let ballRadius;
      let cosAngle = p5.cos(angle);
      var x = ball[0] * p5.sin(angle);
      var y = ball[1];
      var z = p5.sqrt(x * x + y * y);
      var cos = x / z;
      var sin = y / z;
      var newcos = dcos * cos + dsin * sin;
      var newsin = sin * dcos - cos * dsin;
      var newx = z * newcos;
      var newy = z * newsin;
      if(position < sphereCompleteTime){
        let inter = 0.05 + 0.95 * Ease.quadIn(position / sphereCompleteTime);
        ballRadius = maxBallRadius * inter;
      } else {
        ballRadius = maxBallRadius;
      }
      p5.ellipse(newx, newy, ballRadius - 0.25 * cosAngle * ball[0] / p5.abs(ball[0]));
    }

    // 流星になるぞ！
    if(chorusIndex !== "" && chorusFlag){
      p5.fill(satelliteColorArray[themeColor]);
      for(let j = 0; j < balls.length / 20; j++){
        let ball = balls[j];
        let currentX = ball[0] * p5.sin(frameCount / ballSpeed + ball[2]);
        let beforeX = ball[0] * p5.sin((frameCount - 1) / ballSpeed + ball[2]);
        if(beforeX > currentX){
          for(let i = 0; i < 10; i++){
            var x;
            if(i == 0){
              x = currentX;
            } else if(i == 1){
              x = beforeX;
            } else {
              x = ball[0] * p5.sin((frameCount - i) / ballSpeed + ball[2]);
            }
            var y = ball[1];
            var z = p5.sqrt(x * x + y * y);
            var cos = x / z;
            var sin = y / z;
            var newcos = p5.cos(dAngle) * cos + p5.sin(dAngle) * sin;
            var newsin = sin * p5.cos(dAngle) - cos * p5.sin(dAngle);
            var newy = z * newsin;
            var newx = z * newcos;
            p5.ellipse(newx, newy, meteorRadius);
          }
        }
      }
    }
    p5.pop();

    // Satellite
    p5.push();
    p5.noStroke();
    p5.translate(width / 2, height * 0.382);
    let mainSatelitteRevolutionRedius = maxMainSatelitteRevolutionRedius;
    let maxSatelitteRedius;
    let mainSatelitteRedius;
    if(beatIndex % 2 == 0){
      maxSatelitteRedius = 25 - 5 * p5.abs(beatProgress - 0.5);
      for(let i = 0; i < 15; i++){
        if(beatProgress - 0.005 * i < 0) break;
        mainSatelitteRedius = maxSatelitteRedius - i * 1.33;
        if(position < sphereCompleteTime){
          mainSatelitteRedius = mainSatelitteRedius * (0.05 + 0.95 * Ease.quadIn(position / sphereCompleteTime));
        }
        let x = mainSatelitteRevolutionRedius * dcos - 2 * mainSatelitteRevolutionRedius * dcos * (beatProgress - 0.005 * i);
        let y = - mainSatelitteRevolutionRedius * dsin + 2 * mainSatelitteRevolutionRedius * dsin * Ease.cubicOut(beatProgress - i * 0.005)
        p5.push();
        p5.translate(0, 0, p5.abs(beatProgress - 0.5));
        p5.fill(satelliteThemeColorRgb[0], satelliteThemeColorRgb[1], satelliteThemeColorRgb[2], 255 - 10 * i);
        p5.ellipse(x, y, mainSatelitteRedius);
        p5.pop();
      }
    } else {
      maxSatelitteRedius = 15 + 5 * p5.abs(beatProgress - 0.5);
      for(let i = 0; i < 15; i++){
        if(beatProgress - 0.003 * i < 0) break;
        mainSatelitteRedius = maxSatelitteRedius - i;
        if(position < sphereCompleteTime){
          mainSatelitteRedius = mainSatelitteRedius * (0.05 + 0.95 * Ease.quadIn(position / sphereCompleteTime));
        }
        let x = - mainSatelitteRevolutionRedius * p5.cos(dAngle) + 2 * mainSatelitteRevolutionRedius * p5.cos(dAngle) * Ease.cubicIn(beatProgress - 0.003 * i);
        let y = mainSatelitteRevolutionRedius * p5.sin(dAngle) - 2 * mainSatelitteRevolutionRedius * p5.sin(dAngle) * (beatProgress - 0.003 * i);
        p5.push();
        p5.translate(0, 0, -p5.abs(beatProgress - 0.5));
        p5.fill(satelliteThemeColorRgb[0], satelliteThemeColorRgb[1], satelliteThemeColorRgb[2], 255 - 10 * i);
        p5.ellipse(x, y, mainSatelitteRedius);
        p5.pop();
      }
    }
    p5.pop();

    // 補助線
    // p5.push();
    // p5.stroke(255, 50);
    // p5.strokeWeight(1);
    // for(let i = -width * 10; i < 11 * width;i+= 100){
    //   p5.line(i, height, width / 2, height * 0.613);
    // }
    // var k = 5;
    // for(let j = height * 0.618; j < height;j += k){
    //   p5.line(0, j, width, j);
    //   k += 3;
    // }

    // p5.line(width / 2, 0, width / 2, height);
    // p5.line(0, height * 0.382, width, height * 0.382);
    // p5.line(0, height * 0.618, width, height * 0.618);

    // p5.translate(0, 0, -(height/2.0) / p5.tan(p5.TWO_PI * 60.0/360.0));
    // p5.line(0, 0, 0, height);
    // p5.line(0, height, width, height);
    // p5.line(width, height, width, 0);
    // p5.line(width, 0, 0, 0);
    // p5.pop();

    // Chord
    if(chordKeyboardFlag){
      p5.push();
      p5.translate(width / 2, height * 0.618);
      // 分数コードのビジュアライゼーションを簡素化（分母を無視）
      if(chordName != null) chordName = chordName.substr(0, (chordName.indexOf('/') != -1) ? chordName.indexOf('/') : chordName.length);
      // フラットとシャープを統合
      if(chordName != null){
        chordName = chordName.replace('Db', 'C#');
        chordName = chordName.replace('Eb', 'D#');
        chordName = chordName.replace('Gb', 'F#');
        chordName = chordName.replace('Ab', 'G#');
        chordName = chordName.replace('Bb', 'A#');
      }
      // i: 0 ~ 12 -> B, C, C#, ..., A, A#, B
      for(let i = 0; i < 13; i++){
        p5.chordKeyboardRender(i, chordName, chorusIndex, beatIndex, beatProgress, vocalAmplitude);
      }
      p5.pop();
    }

    // Chorus
    p5.push();
    p5.noStroke();
    p5.fill(satelliteColorArray[themeColor]);
    let overlayZIndexOffset = -(height/2.0) / p5.tan(p5.TWO_PI * 60.0/360.0)
    if(chorusIndex !== ""){
      if(chorusFlag == false){
        if(criticalBeatIndex == -1){
          criticalBeatIndex = beatIndex;
        }
        if(criticalBeatIndex != beatIndex){
          criticalBeatIndex = -1;
          chorusFlag = true;
        } else {
          if(beatIndex % 2 == 1){
            // 下方からSatellite追加
            for(let i = 0; i < 15; i++){
              let x =  (width / 2 - 100) + (width * 2.5 - (width / 2 - 100)) * (1 - (beatProgress - 0.001 * i));
              let y =  height * 0.382 + (height * 2.5 - height * 0.382) * (1 - (beatProgress - i * 0.001));
              p5.push();
              p5.translate(0, 0, 500 * (1 - beatProgress));
              if(x > 0 && y > 0){
                p5.fill(satelliteThemeColorRgb[0], satelliteThemeColorRgb[1], satelliteThemeColorRgb[2], 255 - 10 * i);
                p5.ellipse(x, y, 25 + (200 - 25) * (1 - beatProgress) - i);
              }
              p5.pop();
            }
            // 下方からChorus開始Overlay
            if(beatProgress > 0.5){
              p5.push();
              p5.translate(0, 500, overlayZIndexOffset);
              for(let i = 0; i < height + 500; i += 20){
                p5.strokeWeight(0);
                p5.noStroke();
                p5.fill(227, 249, 253, (i / 20) * p5.map(beatProgress, 0.5, 1, 0, 1));
                p5.quad(-500, i, width + 500 * widthProportion, i, width + 500 * widthProportion, i + 20, -500, i + 20);
              }
              p5.pop();
            }
          } else {
            // 上方からSatellite追加
            for(let i = 0; i < 15; i++){
              let x =  (width / 2 + 100) + (-width * 0.5 - (width / 2 + 100)) * (1 - (beatProgress - 0.001 * i));
              let y =  - height * 1.5 + (height * 0.382 + height * 1.5) * (beatProgress - i * 0.001);
              p5.push();
              p5.translate(0, 0, 500 * (1 - beatProgress));
              if(x > 0 && y > 0){
                p5.fill(satelliteThemeColorRgb[0], satelliteThemeColorRgb[1], satelliteThemeColorRgb[2], 255 - 10 * i);
                p5.ellipse(x, y, 15 + (200 - 15) * (1 - beatProgress) - i);
              }
              p5.pop();
            }
            // 上方からChorus開始Overlay
            if(beatProgress > 0.5){
              p5.push();
              p5.translate(0, -500, overlayZIndexOffset);
              for(let i = 0; i < height + 500; i += 20){
                p5.strokeWeight(0);
                p5.noStroke();
                p5.fill(227, 249, 253, ((height + 500) / 20 - i / 20) * p5.map(beatProgress, 0.5, 1, 0, 1));
                p5.quad(-500, i, width + 500 * widthProportion, i, width + 500 * widthProportion, i + 20, -500, i + 20);
              }
              p5.pop();
            }
          }
        }
      } else {
        // 追加Satelitte回転
        p5.push();
        p5.noStroke();
        p5.translate(width / 2, height * 0.382);
        let x, y, newx, newy;
        if(beatIndex % 2 == 0){
          for(let i = 0; i < 15; i++){
            if(beatProgress < 0.5){
              x = subSatelliteRevolutionRedius * p5.cos(dAngle) - 2 * subSatelliteRevolutionRedius * p5.cos(dAngle) * (0.5 + beatProgress - 0.005 * i);
              y = - subSatelliteRevolutionRedius * p5.sin(dAngle) + 2 * subSatelliteRevolutionRedius * p5.sin(dAngle) * Ease.cubicOut(0.5 + beatProgress - i * 0.005)

              newx = -y;
              newy = x;
            } else {
              if(beatProgress - 0.003 * i - 0.5 < 0) break;

              let x = - subSatelliteRevolutionRedius * p5.cos(dAngle) + 2 * subSatelliteRevolutionRedius * p5.cos(dAngle) * Ease.cubicIn(beatProgress - 0.003 * i - 0.5);
              let y = subSatelliteRevolutionRedius * p5.sin(dAngle) - 2 * subSatelliteRevolutionRedius * p5.sin(dAngle) * (beatProgress - 0.003 * i - 0.5);

              newx = -y;
              newy = x;
            }
            p5.push();
            p5.fill(satelliteThemeColorRgb[0], satelliteThemeColorRgb[1], satelliteThemeColorRgb[2], 255 - 10 * i);
            p5.ellipse(newx, newy, 25 - 5 * beatProgress - i * 1.33);
            p5.pop();
          }
        } else {
          for(let i = 0; i < 15; i++){
            if(beatProgress < 0.5){
              x = - subSatelliteRevolutionRedius * p5.cos(dAngle) + 2 * subSatelliteRevolutionRedius * p5.cos(dAngle) * Ease.cubicIn(0.5 + beatProgress - 0.003 * i);
              y = subSatelliteRevolutionRedius * p5.sin(dAngle) - 2 * subSatelliteRevolutionRedius * p5.sin(dAngle) * (0.5 + beatProgress - 0.003 * i);

              newx = -y;
              newy = x;
            } else {
              if(beatProgress - 0.005 * i - 0.5 < 0) break;

              x = subSatelliteRevolutionRedius * p5.cos(dAngle) - 2 * subSatelliteRevolutionRedius * p5.cos(dAngle) * (beatProgress - 0.005 * i - 0.5);
              y = - subSatelliteRevolutionRedius * p5.sin(dAngle) + 2 * subSatelliteRevolutionRedius * p5.sin(dAngle) * Ease.cubicOut(beatProgress - i * 0.005 - 0.5)

              newx = -y;
              newy = x;
            }
            p5.push();
            p5.fill(satelliteThemeColorRgb[0], satelliteThemeColorRgb[1], satelliteThemeColorRgb[2], 255 - 10 * i);
            p5.ellipse(newx, newy, 15 + 5 * beatProgress - i);
            p5.pop();
          }
        }
        p5.pop();

      }

      // 両脇の白ビーツ
      if(beatIndex % 2 == 0 && beatProgress < 0.5){
        p5.push();
        p5.strokeWeight(0);
        p5.noStroke();
        p5.translate(width / 2, height / 2, overlayZIndexOffset);
        p5.scale(1, 1, 0.5);
        for(let i = 0; i < 200; i += 20){
          p5.fill(227, 249, 253, (200 - i) / 2 * (0.5 - beatProgress));
          let x = -width / 2 + i - 0.17 * width;
          let y = -height / 2 - 500;
          p5.quad(x, y, x, -y, x + 20, -y, x + 20, y);
          p5.quad(-x, y, -x, -y, -x - 20, -y, -x - 20, y);
        }
        p5.pop();
      }
    } else {
      if(chorusFlag == true){
        if(criticalBeatIndex == -1){
          criticalBeatIndex = beatIndex;
        }
        if(criticalBeatIndex != beatIndex){
          criticalBeatIndex = -1;
          chorusFlag = false;
        } else if(criticalBeatIndex === undefined || beatIndex === undefined){
          // スキップ
        } else {
          if(beatIndex % 2 == 0){
            // 上方へ追加分Satellite退場
            for(let i = 0; i < 15; i++){
              let x =  (width / 2 - 100) - ((width / 2 - 100) + width * 0.5) * (beatProgress - 0.001 * i);
              let y =  height * 0.382 - (height * 0.382 + height * 1.5) * (beatProgress - i * 0.001);
              p5.push();
              p5.translate(0, 0, 500 * beatProgress);
              if(x > 0 && y > 0){
                p5.fill(satelliteThemeColorRgb[0], satelliteThemeColorRgb[1], satelliteThemeColorRgb[2], 255 - 10 * i);
                p5.ellipse(x, y, 25 + (200 - 25) * beatProgress - i);
              }
              p5.pop();
            }
            // 上方からChorus終了Overlay
            p5.push();
            p5.translate(0, -500, overlayZIndexOffset);
            for(let i = 0; i < height + 500; i += 20){
              p5.strokeWeight(0);
              p5.noStroke();
              p5.fill(227, 249, 253, ((height + 500) / 20 - i / 20) * (1 - beatProgress));
              p5.quad(-500, i, width + 500 * widthProportion, i, width + 500 * widthProportion, i + 20, -500, i + 20);
            }
            p5.pop();
          } else {
            // 下方へ追加分Satellite退場
            for(let i = 0; i < 15; i++){
              let x =  (width / 2 + 100) - ((width / 2 + 100) - width * 2.5) * (beatProgress - 0.001 * i);
              let y =  height * 0.382 + (height * 2.5 - height * 0.382) * (beatProgress - i * 0.001);
              p5.push();
              p5.translate(0, 0, 500 * beatProgress);
              if(x > 0 && y > 0){
                p5.fill(satelliteThemeColorRgb[0], satelliteThemeColorRgb[1], satelliteThemeColorRgb[2], 255 - 10 * i);
                p5.ellipse(x, y, 15 + (200 - 15) * beatProgress - i);
              }
              p5.pop();
            }
            // 下方からChorus終了Overlay
            p5.push();
            p5.translate(0, 500, overlayZIndexOffset);
            for(let i = 0; i < height + 500; i += 20){
              p5.strokeWeight(0);
              p5.noStroke();
              p5.fill(227, 249, 253, (i / 20) * (1 - beatProgress));
              p5.quad(-500, i, width + 500 * widthProportion, i, width + 500 * widthProportion, i + 20, -500, i + 20);
            }
            p5.pop();
          }
        }
      }
    }

    // タイトルと作曲者
    p5.push();
    p5.textFont(mplus);
    let rightOffset = width / 2 + 30;
    let leftOffset = width / 2 - 30;
    let headTime = 100;
    let tailTime = 100;
    let chorusLyricsThemeColorRgb = chorusLyricsColorRgbArray[themeColor];
    let nonChorusLyricsThemeColorRgb = nonChorusLyricsColorRgbArray[themeColor];
    if(position > titleStartTime - headTime && position < titleStartTime){
      let progress = (titleStartTime - position) / headTime;
      p5.fill(chorusLyricsThemeColorRgb[0], chorusLyricsThemeColorRgb[1], chorusLyricsThemeColorRgb[2], 255 * Ease.quintOut(1 - progress));
      p5.textSize(40);
      p5.text(title, rightOffset + (width - rightOffset) * Ease.circIn((titleStartTime - position) / headTime), height * 0.618);
      p5.textSize(30);
      p5.text(artist, leftOffset - (leftOffset) * Ease.circIn((titleStartTime - position) / headTime), height * 0.618 + 60);
    }
    if(position > titleStartTime && position < titleEndTime){
      p5.fill("#F0FFF0");
      p5.textSize(40);
      p5.text(title, width / 2 - 60 * (position - (titleEndTime + titleStartTime) / 2) / (titleEndTime - titleStartTime), height * 0.618);
      p5.textSize(30);
      p5.text(artist, width / 2 + 60 * (position - (titleEndTime + titleStartTime) / 2) / (titleEndTime - titleStartTime), height * 0.618 + 60);
    }
    if(position > titleEndTime && position < titleEndTime + tailTime){
      let progress = (position - titleEndTime) / tailTime;
      p5.fill(chorusLyricsThemeColorRgb[0], chorusLyricsThemeColorRgb[1], chorusLyricsThemeColorRgb[2], 255 * Ease.quintOut(1 - progress));
      p5.textSize(40);
      p5.text(title, leftOffset - leftOffset * Ease.circIn((position - titleEndTime) / tailTime), height * 0.618);
      p5.textSize(30);
      p5.text(artist, rightOffset + (width - rightOffset) * Ease.circIn((position - titleEndTime) / tailTime), height * 0.618 + 60);
    }
    p5.pop();

    // 歌詞 & Outro
    p5.push();
    p5.textFont(mplus);
    p5.translate(width / 2, height * 0.618);
    headTime = 300;
    tailTime = 300;
    let outroBeamTime = tailTime * 2;
    let phrase = video.findPhrase(position - tailTime, { loose: true });
    let obj = document.querySelector("#loader");
    //　歌詞
    if (phrase) {
      let chorusAtStart = player.findChorus(phrase.startTime);
      let chorusAtEnd = player.findChorus(phrase.endTime);
      let startTime = phrase.startTime;
      let endTime = phrase.endTime;
      let text = phrase.text;
      let maxOffsetX = 0;
      let minCharOffsetX = 0;
      let index = video.findIndex(phrase);

      // Chorus
      if(chorusAtStart != null || chorusAtEnd != null){

        if(currentPhraseIndex != index){
          nextPhrase = null;
          currentPhraseIndex = index;
        }

        if(position > startTime - headTime && position < endTime + tailTime){
          p5.textSize(35);
          let phraseWidth = p5.textWidth(phrase.text);
          let char = phrase.firstChar;
          maxOffsetX = - phraseWidth / 2;

          if(position < endTime){
            for(let i = 0; i < phrase.charCount; i++){
              let progress = (position - startTime) / (endTime - startTime);
              let offsetX = maxOffsetX - maxOffsetX * (1 - progress);

              // 入場
              if(position > char.startTime - headTime && position < char.startTime){
                let charStartProgress = (char.startTime - position) / headTime;
                if(chorusIndex !== "" && chorusFlag){
                  p5.fill(chorusLyricsThemeColorRgb[0], chorusLyricsThemeColorRgb[1], chorusLyricsThemeColorRgb[2], 255 * Ease.quintOut(1 - charStartProgress));
                } else {
                  p5.fill(nonChorusLyricsThemeColorRgb[0], nonChorusLyricsThemeColorRgb[1], nonChorusLyricsThemeColorRgb[2], 255 * Ease.quintOut(1 - charStartProgress));
                }
                let charOffsetX = minCharOffsetX + offsetX + width * Ease.cubicIn(charStartProgress);
                let angle = p5.TWO_PI/360 * (45 - 0.3 * i) * Ease.cubicIn(charStartProgress)
                p5.rotateY(angle);
                if(index % 2 == 0){
                  p5.text(char.text, charOffsetX, 0);
                } else {
                  p5.translate(0, 60, 0)
                  p5.text(char.text, charOffsetX, 0);
                  p5.translate(0, -60, 0)
                }
                p5.rotateY(-angle);
              } else if (position >= char.startTime) {　// Show Time
                let charProgress = (position - char.startTime) / (char.endTime - char.startTime);
                if(chorusIndex !== "" && chorusFlag){
                  p5.fill("#F0FFF0");
                } else {
                  p5.fill("#f0fcff");
                }
                if(index % 2 == 0){
                  p5.text(char.text, minCharOffsetX + offsetX, 0);
                  if(position < char.endTime){
                    let pos = char.parent.pos;
                    let charIndex = video.findIndex(char);
                    if(pos === "N" || pos === "PN"){
                      splashOnPos(charIndex, minCharOffsetX + offsetX + width / 2 - 150, height * 0.618 - 150);
                    }
                  }
                } else {
                  p5.text(char.text, minCharOffsetX + offsetX, 60);
                  if(position < char.endTime){
                    let pos = char.parent.pos;
                    let charIndex = video.findIndex(char);
                    if(pos === "N" || pos === "PN"){
                      splashOnPos(charIndex, minCharOffsetX + offsetX + width / 2 - 150, height * 0.618 - 150 + 60);
                    }
                  }
                }
              }
              minCharOffsetX += p5.textWidth(char.text);
              char = char.next;
            }
          }
          // 退場
          if (position >= endTime) {
            char = phrase.firstChar;
            minCharOffsetX = 0;
            var afterProgress = (position - endTime) / tailTime;
            if(chorusIndex !== "" && chorusFlag){
              p5.fill(chorusLyricsThemeColorRgb[0], chorusLyricsThemeColorRgb[1], chorusLyricsThemeColorRgb[2], 255 * Ease.quintOut(1 - afterProgress));
            } else {
              p5.fill(nonChorusLyricsThemeColorRgb[0], nonChorusLyricsThemeColorRgb[1], nonChorusLyricsThemeColorRgb[2], 255 * Ease.quintOut(1 - afterProgress));
            }
            for(let i = 0; i < phrase.charCount; i++){
              let angle = -p5.TWO_PI/360 * (45 - i) * Ease.cubicIn(afterProgress);
              p5.rotateY(angle);
              if(index % 2 == 0){
                p5.text(char.text, minCharOffsetX + maxOffsetX - (maxOffsetX + width) * Ease.cubicIn(afterProgress), 0);
              } else {
                p5.translate(0, 60, 0)
                p5.text(char.text, minCharOffsetX + maxOffsetX - (maxOffsetX + width) * Ease.cubicIn(afterProgress), 0);
                p5.translate(0, -60, 0)
              }
              p5.rotateY(-angle);
              minCharOffsetX += p5.textWidth(char.text);
              char = char.next;
            }
          }
        }
      } else { // Chorus以外
        if(currentTypePhraseIndex != index){
          typeOffsetX = nextTypeOffsetX;
          currentTypePhraseIndex = index;
        }
        // 入場　＆　Show Time
        if(position > startTime - headTime && position < endTime + tailTime){
          p5.textSize(35);
          let char = phrase.firstChar;
          minCharOffsetX = 0;
          if(position < endTime){
            for(let i = 0; i < phrase.charCount; i++){
              if (position > char.startTime) {
                if(position < char.endTime){
                  let pos = char.parent.pos;
                  p5.fill(nonChorusLyricsColorArray[themeColor]);
                  let wordIndex = video.findIndex(char.parent);
                  if(pos === "N" || pos === "PN"){
                    splashOnPos(wordIndex, minCharOffsetX + typeOffsetX + width / 2 - 150, height * 0.618 + 60 - 150);
                  }
                } else {
                  p5.fill("#f0fcff");
                }
                p5.text(char.text, minCharOffsetX + typeOffsetX, 60);

              } else if(position < char.startTime) {
                typeOffsetX = -minCharOffsetX / 2;
                break;
              }

              if(i == phrase.charCount - 1){
                typeOffsetX = -minCharOffsetX / 2;
              }

              minCharOffsetX += p5.textWidth(char.text);
              char = char.next;
            }
            if(frameCount % 15 < 8){
              p5.fill(nonChorusLyricsColorArray[themeColor]);
              p5.text("_", minCharOffsetX + typeOffsetX, 60);
            }
          }
          // 退場
          if (position > endTime) {
            char = phrase.firstChar;
            minCharOffsetX = 0;
            let phraseOffset = -p5.textWidth(phrase.text) / 2;
            if(p5.abs(typeOffsetX - phraseOffset) > 20){
              typeOffsetX = phraseOffset;
            }
            // 退場ステップ1（Enterキーエフェクト）
            if(position < endTime + 100){
              for(let i = 0; i < phrase.charCount; i++){
                let upliftProgress = (position - endTime) / 100;
                p5.textSize(35);
                p5.fill(nonChorusLyricsColorArray[themeColor]);
                p5.text(char.text, minCharOffsetX + typeOffsetX, 60 * (1 - Ease.cubicInOut(upliftProgress)));

                minCharOffsetX += p5.textWidth(char.text);
                char = char.next;
              }
            } else { // 退場ステップ2（通常退場）
              var afterProgress = (position - 100 - endTime) / (tailTime - 100);
              p5.fill(nonChorusLyricsThemeColorRgb[0], nonChorusLyricsThemeColorRgb[1], nonChorusLyricsThemeColorRgb[2], 255 * Ease.quintOut(1 - afterProgress));
              for(let i = 0; i < phrase.charCount; i++){

                let angle = -p5.TWO_PI/360 * (45 - i) * Ease.cubicIn(afterProgress);
                p5.rotateY(angle);

                p5.text(char.text, minCharOffsetX + typeOffsetX - (typeOffsetX + width) * Ease.cubicIn(afterProgress), 0);

                p5.rotateY(-angle);

                minCharOffsetX += p5.textWidth(char.text);
                char = char.next;
              }
            }
          }
        }
      }

      //　次のPhraseを予行レンダリング
      if(nextPhrase == null){
        nextPhrase = video.findPhrase(position + headTime, { loose: true });
        nextIndex = video.findIndex(nextPhrase);
      }
      if(nextPhrase && (nextIndex != index)){
        nextChorusAtStart = player.findChorus(nextPhrase.startTime);
        nextChorusAtEnd = player.findChorus(nextPhrase.endTime);
        let nextStartTime = nextPhrase.startTime;
        let nextEndTime = nextPhrase.endTime;
        let nextText = nextPhrase.text;
        let nextMaxOffsetX = 0;
        let nextMinCharOffsetX = 0;

        let nextPhraseWidth = p5.textWidth(nextPhrase.text);
        let char = nextPhrase.firstChar;
        nextMaxOffsetX = - nextPhraseWidth / 2;
        p5.textSize(35);

        if(nextChorusAtStart != null || nextChorusAtEnd != null){
          if(position > nextStartTime - headTime){

            // 入場
            for(let i = 0; i < nextPhrase.charCount; i++){
              let progress = (position - nextStartTime) / (nextEndTime - nextStartTime);
              let nextOffsetX = nextMaxOffsetX - nextMaxOffsetX * (1 - progress);

              if(position > char.startTime - headTime && position < char.startTime){

                let charProgress = (char.startTime - position) / headTime;
                if(chorusIndex !== "" && chorusFlag){
                  p5.fill(chorusLyricsThemeColorRgb[0], chorusLyricsThemeColorRgb[1], chorusLyricsThemeColorRgb[2], 255 * Ease.quintOut(1 - charProgress));
                } else {
                  p5.fill(nonChorusLyricsThemeColorRgb[0], nonChorusLyricsThemeColorRgb[1], nonChorusLyricsThemeColorRgb[2], 255 * Ease.quintOut(1 - charProgress));
                }
                let nextCharOffsetX = nextMinCharOffsetX + nextOffsetX + width * Ease.cubicIn(charProgress);
                let angle = p5.TWO_PI/360 * (45 - 0.3 * i) * Ease.cubicIn(charProgress)
                p5.rotateY(angle);
                if(nextIndex % 2 == 0){
                  p5.text(char.text, nextCharOffsetX, 0);
                } else {
                  p5.translate(0, 60, 0)
                  p5.text(char.text, nextCharOffsetX, 0);
                  p5.translate(0, -60, 0)
                }
                p5.rotateY(-angle);
              } else if(position >= char.startTime){　// Show Time
                if(chorusIndex !== "" && chorusFlag){
                  p5.fill("#F0FFF0");
                } else {
                  p5.fill("#f0fcff");
                }
                if(nextIndex % 2 == 0){
                  p5.text(char.text, nextMinCharOffsetX + nextOffsetX, 0);
                  if(position < char.endTime){
                    let pos = char.parent.pos;
                    let charIndex = video.findIndex(char);
                    if(pos === "N" || pos === "PN"){
                      splashOnPos(charIndex, nextMinCharOffsetX + nextOffsetX + width / 2 - 150, height * 0.618 - 150);
                    }
                  }
                } else {
                  p5.text(char.text, nextMinCharOffsetX + nextOffsetX, 60);
                  if(position < char.endTime){
                    let pos = char.parent.pos;
                    let charIndex = video.findIndex(char);
                    if(pos === "N" || pos === "PN"){
                      splashOnPos(charIndex, nextMinCharOffsetX + nextOffsetX + width / 2 - 150, height * 0.618 + 60 - 150);
                    }
                  }
                }
              }
              nextMinCharOffsetX += p5.textWidth(char.text);
              char = char.next;
            }
          }
        } else {
          if(position > nextStartTime - headTime && position < nextEndTime){

            // 入場　＆　Show Time
            for(let i = 0; i < nextPhrase.charCount; i++){
              if (position > char.startTime) {
                p5.textSize(35);
                if(position < char.endTime){
                  let pos = char.parent.pos;
                  p5.fill(nonChorusLyricsColorArray[themeColor]);
                  let wordIndex = video.findIndex(char.parent);
                  if(pos === "N" || pos === "PN"){
                    splashOnPos(wordIndex, nextMinCharOffsetX + nextTypeOffsetX + width / 2 - 150, height * 0.618 + 60 - 150);
                  }
                } else {
                  p5.fill("#f0fcff");
                }
                p5.text(char.text, nextMinCharOffsetX + nextTypeOffsetX, 60);
              } else if(position < char.startTime) {
                nextTypeOffsetX = -nextMinCharOffsetX / 2;
                break;
              }

              nextMinCharOffsetX += p5.textWidth(char.text);
              char = char.next;
            }
            if(position > endTime + 100 && frameCount % 15 < 8){
              p5.strokeWeight(2);
              p5.text("_", nextMinCharOffsetX + nextTypeOffsetX, 60);
            }
          }
        }
      } else {
        nextPhrase = null;
      }

      // 間奏の声量波形
      if(position < startTime - headTime && index > 0){
        p5.stroke(satelliteColorArray[themeColor]);
        p5.strokeWeight(2);

        let previousPhrase = phrase.previous;
        let previousEndTime = previousPhrase.endTime;

        let waveformStartTime = previousEndTime + 500;
        let waveformEndTime = startTime - 500;

        if(position > waveformStartTime && position < waveformEndTime){
          if(position < waveformStartTime + 100){
            p5.line(-400 + (100 - (position - waveformStartTime)) * 12, 0, 400 + (100 - (position - waveformStartTime)) * 12, 0);
          }
          if(position > waveformStartTime + 100 && position < waveformEndTime - 100){
            p5.line(-400, 0, -300, 0);
            for(let i = 0; i < 600; i += 20){
              let dy = p5.random(0, vocalAmplitude / maxVocalAmplitude * 200)
              p5.line(-300 + i + 6, 0 + dy, -300 + i + 6, 0 - dy);
              p5.line(-300 + i + 12, 0, -300 + i + 20, 0);
            }
            p5.line(300, 0, 400, 0);
          }
          if(position > waveformEndTime - 100){
            p5.line(-400 - (waveformEndTime - position) * 12, 0, 400 - (waveformEndTime - position) * 12, 0);
          }
        }
      }
    }
    else {　// Outro
      if(!outroFlag && position < songEndTime){
        outroStartTime = player.video.lastPhrase.endTime + tailTime;
        phraseCount = video.phraseCount;
        phraseBeamCount = (songEndTime - outroStartTime) * 0.3 / outroBeamTime;
        beamStartTime = outroStartTime;
        beamEndTime = outroStartTime + (songEndTime - outroStartTime) * 0.3;
        loadStartTime = outroStartTime + (songEndTime - outroStartTime) * 0.3;
        loadEndTime = outroStartTime + (songEndTime - outroStartTime) * 0.6;
        for(let i = 0; i < phraseBeamCount; i++){
          let index = Math.round(p5.random(phraseCount));
          while(phraseBeamArray.indexOf(index) != -1) index = Math.round(p5.random(phraseCount));
          if(video.getPhrase(index) === null) index = Math.round(p5.random(phraseCount));
          phraseBeamArray.push(index);
        }

        maxCollectionVocalAmplitudeCount = Math.round(width * 0.9 / 15);

        outroFlag = true;
      }

      // 下方からBeam Time開始Overlay
      if(position > beamStartTime && position < beamStartTime + tailTime){
        let progress = (position - beamStartTime) / tailTime;
        p5.push();
        p5.translate(-width / 2, -height * 0.618);
        p5.translate(0, 500,  overlayZIndexOffset);
        p5.strokeWeight(0);
        p5.noStroke();
        for(let i = 0; i < height + 500; i += 20){
          p5.fill(227, 249, 253, (i / 20) * (1 - progress));
          p5.quad(-500, i, width + 500 * widthProportion, i, width + 500 * widthProportion, i + 20, -500, i + 20);
        }
        p5.pop();
      }

      // Outro歌詞ビーム
      if(position > beamStartTime && position < beamEndTime){
        let currentPhraseBeamIndex = Math.floor((position - beamStartTime) / outroBeamTime);
        let currentPhraseBeamStartTime = beamStartTime + currentPhraseBeamIndex * outroBeamTime;
        if(currentPhraseBeamStartTime + outroBeamTime < beamEndTime){
          if(currentPhraseBeamIndex % 2 == 0){
            if((position - beamStartTime) % outroBeamTime < tailTime){
              let beamProgress = (position - currentPhraseBeamStartTime) / tailTime;
              let phrase = video.getPhrase(phraseBeamArray[currentPhraseBeamIndex]);

              p5.fill(chorusLyricsThemeColorRgb[0], chorusLyricsThemeColorRgb[1], chorusLyricsThemeColorRgb[2], 255 * Ease.quintOut(beamProgress));
              p5.textSize(35);
              let maxOffsetX = -p5.textWidth(phrase.text) / 2;

              let char = phrase.firstChar;
              let minCharOffsetX = 0;
              for(let i = 0; i < phrase.charCount; i++){

                let angle = -p5.TWO_PI/360 * (45 - i) * Ease.cubicIn(1 - beamProgress);
                p5.rotateY(angle);

                p5.text(char.text, minCharOffsetX + maxOffsetX - (maxOffsetX + width) * Ease.cubicIn(1 - beamProgress), 0);

                p5.rotateY(-angle);

                minCharOffsetX += p5.textWidth(char.text);
                char = char.next;
              }
            } else {
              let beamProgress = (position - currentPhraseBeamStartTime - tailTime) / tailTime;
              let phrase = video.getPhrase(phraseBeamArray[currentPhraseBeamIndex]);

              p5.fill(chorusLyricsColorArray[themeColor]);
              p5.textSize(35);
              let maxOffsetX = -p5.textWidth(phrase.text) / 2;

              let char = phrase.firstChar;
              let minCharOffsetX = 0;
              for(let i = 0; i < phrase.charCount; i++){

                let angle = -p5.TWO_PI/360 * (110 + i) * Ease.cubicIn(beamProgress);
                p5.rotateY(angle);

                p5.text(char.text, minCharOffsetX + maxOffsetX - (maxOffsetX - width) * Ease.cubicIn(beamProgress), 0);

                p5.rotateY(-angle);

                minCharOffsetX += p5.textWidth(char.text);
                char = char.next;
              }
            }
          } else {
            if((position - beamStartTime) % outroBeamTime < tailTime){
              let beamProgress = (position - currentPhraseBeamStartTime) / tailTime;
              let phrase = video.getPhrase(phraseBeamArray[currentPhraseBeamIndex]);

              p5.fill(chorusLyricsThemeColorRgb[0], chorusLyricsThemeColorRgb[1], chorusLyricsThemeColorRgb[2], 255 * Ease.quintOut(beamProgress));
              p5.textSize(35);
              let maxOffsetX = -p5.textWidth(phrase.text) / 2;

              let char = phrase.firstChar;
              let minCharOffsetX = 0;
              for(let i = 0; i < phrase.charCount; i++){

                let angle = p5.TWO_PI/360 * (35 + i) * Ease.cubicIn(1 - beamProgress);
                p5.rotateY(angle);

                p5.text(char.text, minCharOffsetX + maxOffsetX - (maxOffsetX - width) * Ease.cubicIn(1 - beamProgress), 0);

                p5.rotateY(-angle);

                minCharOffsetX += p5.textWidth(char.text);
                char = char.next;
              }
            } else {
              let beamProgress = (position - currentPhraseBeamStartTime - tailTime) / tailTime;
              let phrase = video.getPhrase(phraseBeamArray[currentPhraseBeamIndex]);

              p5.fill(chorusLyricsColorArray[themeColor]);
              p5.textSize(35);
              let maxOffsetX = -p5.textWidth(phrase.text) / 2;

              let char = phrase.firstChar;
              let minCharOffsetX = 0;
              for(let i = 0; i < phrase.charCount; i++){

                let angle = p5.TWO_PI/360 * (120 - i) * Ease.cubicIn(beamProgress);
                p5.rotateY(angle);

                p5.text(char.text, minCharOffsetX + maxOffsetX - (maxOffsetX + width) * Ease.cubicIn(beamProgress), 0);

                p5.rotateY(-angle);

                minCharOffsetX += p5.textWidth(char.text);
                char = char.next;
              }
            }
          }
        }

        // Collection波形
        p5.push();
        p5.translate(-width / 2, -height * 0.618);
        p5.fill(chorusLyricsColorArray[themeColor]);
        if(position < beamStartTime + tailTime * 2){
          let progress = (position - beamStartTime) / (tailTime * 2);
          p5.strokeWeight(progress);
          p5.textSize(20);
          p5.text("Collecting...", width * 0.1 * progress, height * 0.1 + 50);
        } else if(position > beamEndTime - tailTime) {
          let progress = (position - (beamEndTime - tailTime)) / tailTime;
          p5.strokeWeight(1 - progress);
          p5.textSize(20);
          p5.text("Collecting...", width * 0.1 * (1 - progress), height * 0.1 + 50);
        } else {
          p5.strokeWeight(1)
          p5.textSize(20);
          p5.text("Collecting...", width * 0.1, height * 0.1 + 50);
        }
        p5.stroke(satelliteColorArray[themeColor]);
        collectionVocalAmplitudeArray.push(vocalAmplitude);
        let length = collectionVocalAmplitudeArray.length
        let startX = width * 0.05;
        let originY = height * 0.1;
        if(length < maxCollectionVocalAmplitudeCount){
          let muteCount = maxCollectionVocalAmplitudeCount - length;
          for(let i = 0; i < muteCount; i++){
            let x = startX + i * 15;
            p5.line(x, originY - 1, x, originY + 1);
          }
          for(let i = 0; i < length; i++){
            let x = startX + (i + muteCount) * 15;
            let dy = (collectionVocalAmplitudeArray[i] / maxVocalAmplitude) * 50
            p5.line(x, originY - dy, x, originY + dy);
          }
        } else {
          collectionVocalAmplitudeArray.shift();
          for(let i = 0; i < length; i++){
            let x = startX + i * 15;
            let dy = (collectionVocalAmplitudeArray[i] / maxVocalAmplitude) * 50
            p5.line(x, originY - dy, x, originY + dy);
          }
        }
        p5.pop();
      }

      // Outroローディング
      if(position > loadStartTime && position < loadEndTime){
        let charFlightTime = 1000;
        if(!loadFlag && position < songEndTime){
          lottieLoaderAnimation.setSpeed(1);
          lottieLoaderAnimation.goToAndPlay(0);
          obj.style.marginLeft = width / 2 - 100;
          obj.style.marginTop = height * 0.382 - 100;

          loadTime = loadEndTime - loadStartTime;
          charCollectionArrayLength = Math.floor(loadTime - charFlightTime) / headTime;
          for(let i = 0; i < charCollectionArrayLength; i++){
            let phraseIndex = Math.floor(p5.random(phraseBeamCount));
            let phrase = video.getPhrase(phraseBeamArray[phraseIndex]);
            let wordIndex = Math.floor(p5.random(phrase.wordCount));
            let word = phrase.children[wordIndex];
            let charIndex = Math.floor(p5.random(word.charCount));
            let char = word.children[charIndex];
            while(charCollectionArray.indexOf(char.text) != -1){
              phraseIndex = Math.floor(p5.random(phraseBeamCount));
              phrase = video.getPhrase(phraseBeamArray[phraseIndex]);
              wordIndex = Math.floor(p5.random(phrase.wordCount));
              word = phrase.children[wordIndex];
              charIndex = Math.floor(p5.random(word.charCount));
              char = word.children[charIndex];
            }
            charCollectionArray.push(char.text);

            let startPoint = [p5.random(-200, 200), p5.random(-200, 200)];
            startPointArray.push(startPoint);
          }

          loadFlag = true;
        }

        // 言葉、蝶々
        p5.push();
        p5.translate(0, -height * (0.618 - 0.382));
        p5.textSize(20);
        obj.style.marginLeft = width / 2 - 100;
        obj.style.marginTop = height * 0.382 - 100;
        if(position > loadStartTime && position < loadEndTime){
          let progress;
          for(let i = 3; i >= 0; i--){
            if(position - i * headTime > loadStartTime){
              let charIndex = Math.floor((position - loadStartTime) / headTime - i);
              progress = (position - loadStartTime - charIndex * headTime) / charFlightTime;
              if(progress < 1 && charIndex < charCollectionArrayLength){
                p5.push();
                p5.translate(0, 0, 1000 * Ease.quintIn(1 - progress));
                p5.fill(chorusLyricsThemeColorRgb[0], chorusLyricsThemeColorRgb[1], chorusLyricsThemeColorRgb[2], 255 * Ease.quintOut(1 - progress));
                p5.text(charCollectionArray[charIndex], startPointArray[charIndex][0] * (1 - progress), startPointArray[charIndex][1] * (1 - progress));

                p5.push();
                p5.translate(0, 0, -1000 * Ease.quintIn(1 - progress));
                for(let j = 0; j < 50; j++){
                  if(progress - 0.01 - j * 0.005 > 0){
                    p5.push();
                    let tailProgress = 1 - (progress - 0.01 - j * 0.005);
                    p5.translate(0, 0, 1000 * Ease.quintIn(tailProgress));
                    p5.ellipse(startPointArray[charIndex][0] * tailProgress, startPointArray[charIndex][1] * tailProgressx, 1);
                    p5.pop();
                  }
                }
                p5.pop();

                if(charIndex % 3 == 0){
                  p5.translate(startPointArray[charIndex / 3 + 1][0] * (1 - progress), startPointArray[charIndex / 3 + 1][1] * (1 - progress));
                  p5.rotateX(p5.TWO_PI * 60 / 360);

                  p5.push();
                  p5.rotateY(p5.radians(85 * p5.sin(p5.radians(p5.millis() / 3))));
                  p5.tint(255, 255 * Ease.quintOut(1 - progress));
                  p5.image(butterflyPic, butterflyPos.x, butterflyPos.y - butterflySize / 2, butterflySize / 2, butterflySize);
                  p5.pop();

                  p5.push();
                  p5.scale(-1, 1);
                  p5.rotateY(p5.radians(85 * p5.sin(p5.radians(p5.millis() / 3))));
                  p5.tint(255, 255 * Ease.quintOut(1 - progress));
                  p5.image(butterflyPic, butterflyPos.x, butterflyPos.y - butterflySize / 2, butterflySize / 2, butterflySize);
                  p5.pop();
                }
                p5.pop();
              }
            }
          }
        }
        p5.pop();
      }

      //Outroキャラ輪郭画像
      if(position > loadEndTime && outroFlag && position < songEndTime - headTime){
        p5.push();
        p5.translate(0, -height * (0.618 - 0.382));
        if(position < loadEndTime + headTime){
          let progress = (position - loadEndTime) / headTime;
          p5.image(characterPic, -mainSatelitteRevolutionRedius / 2 * Ease.backOut(progress), -3, mainSatelitteRevolutionRedius * Ease.backOut(progress), 6);
        } else if(position < loadEndTime + headTime * 2){
          let progress = (position - loadEndTime - headTime) / headTime;
          p5.image(characterPic, -mainSatelitteRevolutionRedius / 2, -3 + (-mainSatelitteRevolutionRedius * characterAspectRatio / 2 + 3) * Ease.backOut(progress), mainSatelitteRevolutionRedius, 6 + (mainSatelitteRevolutionRedius * characterAspectRatio - 6) * Ease.backOut(progress));
        } else if(position > songEndTime - headTime * 2){
          let progress = (songEndTime - position - headTime) / headTime;
          p5.image(characterPic, -mainSatelitteRevolutionRedius / 2, -3 + (-mainSatelitteRevolutionRedius * characterAspectRatio / 2 + 3) * Ease.backOut(progress), mainSatelitteRevolutionRedius, 6 + (mainSatelitteRevolutionRedius * characterAspectRatio - 6) * Ease.backOut(progress));
        } else {
          p5.image(characterPic, -mainSatelitteRevolutionRedius / 2, -mainSatelitteRevolutionRedius * characterAspectRatio / 2, mainSatelitteRevolutionRedius, mainSatelitteRevolutionRedius * characterAspectRatio);
        }
        p5.pop();
        p5.fill(255);
        p5.textSize(10 * heightProportion);
        p5.textFont(sans);
        p5.text("「" + characterName + "」はクリプトン・フューチャー・メディア株式会社の著作物です。Crypton Future Media, INC. www.piapro.net", 0, height * 0.350)
        p5.text("Namir Mostafa, Natalie Yeh, Heo Yeonjin@LottieFiles", 0, height * 0.365);
      }
    }
    if(loadStartTime > 0){
      if(position > loadStartTime && position < loadStartTime + headTime){
        let progress = (position - loadStartTime) / headTime;
        obj.style.opacity = progress;
      } else if(position < loadEndTime && position > loadEndTime - tailTime){
        let progress = (loadEndTime - position) / tailTime;
        if(progress < 0.2) {
          obj.style.opacity = 0;
        } else {
          obj.style.opacity = progress;
        }
      } else if(position > loadStartTime + headTime && position < loadEndTime - tailTime){
        obj.style.opacity = 1;
      } else if(obj.style.opacity != 0) {
        obj.style.opacity = 0;
      }
    }

    p5.pop();

    // キャンバス左下にFPSを描画(小数点以下２桁を四捨五入)
    if(fpsFlag){
      let fps = p5.frameRate();
      if(fps < 24){
        p5.fill("#ff0844");
      } else {
        p5.fill(255);
      }
      p5.text("FPS: " + fps.toFixed(2), 40, height - 10);
    }
  };

  // i: 0 ~ 12 -> B, C, C#, ..., A, A#, B
  p5.chordKeyboardRender = (i, chordName, chorusIndex, beatIndex, beatProgress, vocalAmplitude) => {
    let coordinateArray = coordinateMatrix[i];
    let x1 = coordinateArray[0];
    let y1 = coordinateArray[1];
    let x2 = coordinateArray[2];
    let y2 = coordinateArray[3];
    let x3 = coordinateArray[4];
    let y3 = coordinateArray[5];
    let x4 = coordinateArray[6];
    let y4 = coordinateArray[7];
    let themeColorGradientArray = colorGradientArray[themeColor];
    let gradientStartColor = beatIndex ? p5.color(themeColorGradientArray[(beatIndex - 1) % 6]) : "";
    let gradientMiddleColor =  beatIndex ? p5.color(themeColorGradientArray[beatIndex % 6]) : "";
    let gradientEndColor = beatIndex ? p5.color(themeColorGradientArray[(beatIndex + 1) % 6]) : "";
    let characterLightColor = p5.color(lightColorGradientArray[themeColor]);
    let characterHeavyColor = p5.color(heavyColorGradientArray[themeColor]);
    if((!manualMode && chordNameMatrix[i].indexOf(chordName) == -1) || (manualMode && !keyPressedFlags[i])){
      if(chorusIndex === "" || !chorusFlag){
        p5.fill("#758a99");
        p5.stroke("#e0f0e9");
        p5.strokeWeight(2);
        p5.quad(x1, y1, x2, y2, x3, y3, x4, y4)
      } else {
        for (let j = y1; j < y3; j += 20) {
          let inter = p5.map(j, y1, y3, 0, 1);
          let nextInter = p5.map(j + 20, y1, y3, 0, 1);
          let startColor = p5.lerpColor(gradientStartColor, gradientMiddleColor, 1 - beatProgress);
          let endColor = p5.lerpColor(gradientMiddleColor, gradientEndColor, beatProgress);
          let c = p5.lerpColor(startColor, endColor, inter);
          p5.noStroke();
          p5.fill(c);
          p5.quad(x1 - (x1 - x4) * inter, j, x2 - (x2 - x3) * inter, j, x2 - (x2 - x3) * nextInter, j + 20, x1 - (x1 - x4) * nextInter, j + 20);
        }
      }
    } else{
      if(chorusIndex === "" || !chorusFlag){
        if(!beatProgress) {
          p5.fill("#758a99");
          p5.stroke("#e0f0e9");
          p5.strokeWeight(2);
          p5.quad(x1, y1, x2, y2, x3, y3, x4, y4)
        } else {
          for (let j = y1; j < y3 ; j += 10) {
            let beforeInter = p5.map(j - 10, y1, y3, 0, 1);
            let inter = p5.map(j, y1, y3, 0, 1);
            let startColor = p5.lerpColor(characterLightColor, characterHeavyColor, 1 - beatProgress);
            let endColor = p5.lerpColor(characterHeavyColor, characterLightColor, beatProgress);
            let c = p5.lerpColor(startColor, endColor, inter);
            p5.stroke(c);
            p5.fill(c);
            p5.quad(x1 - (x1 - x4) * beforeInter, j - 10, x2 - (x2 - x3) * beforeInter, j - 10, x2 - (x2 - x3) * inter, j, x1 - (x1 - x4) * inter, j);
          }
        }
      } else {
        for (let j = y1 + 10; j < y3 ; j += 10) {
          let beforeInter = p5.map(j - 10, y1, y3, 0, 1);
          let inter = p5.map(j, y1, y3, 0, 1);
          let startColor = p5.color('#f0fcff');
          let endColor = p5.lerpColor(characterHeavyColor, characterLightColor, beatProgress);
          let c = p5.lerpColor(startColor, endColor, inter);
          p5.stroke(c);
          p5.fill(c);
          p5.quad(x1 - (x1 - x4) * beforeInter, j - 10, x2 - (x2 - x3) * beforeInter, j - 10, x2 - (x2 - x3) * inter, j, x1 - (x1 - x4) * inter, j);
        }

        let endPointY = y1 - (y1 + 5) * vocalAmplitude / maxVocalAmplitude ;
        let endPointX1 = x1 - x1 * vocalAmplitude / maxVocalAmplitude ;
        let endPointX2 = x2 - x2 * vocalAmplitude / maxVocalAmplitude ;
        for(let k = y1; k > endPointY; k -= 10){
          let inter = p5.map(k, y1, endPointY, 0, 1);
          let nextInter = p5.map(k - 10, y1, endPointY, 0, 1);
          p5.strokeWeight(0);
          p5.fill(227, 249, 253, 255 * (1 - Ease.cubicIn(inter)));
          if(x2 < 0){
            p5.quad(x1 + (endPointX1 - x1) * inter, k, x2 + (endPointX2 - x2) * inter, k, x2 + (endPointX2 - x2) * nextInter, k - 10, x1 + (endPointX1 - x1) * nextInter, k - 10)
          } else if (x1 > 0){
            p5.quad(x1 - (x1 - endPointX1) * inter, k, x2 - (x2 - endPointX2) * inter, k,  x2 - (x2 - endPointX2) * nextInter, k - 10, x1 - (x1 - endPointX1) * nextInter, k - 10)
          }
        }
      }
    }
    if(manualMode){
      let keyName;
      switch (i) {
        case 0:
          keyName = "Z"
          break;
        case 1:
          keyName = "X"
          break;
        case 2:
          keyName = "D";
          break;
        case 3:
          keyName = "C";
          break;
        case 4:
          keyName = "F";
          break;
        case 5:
          keyName = "V";
          break;
        case 6:
          keyName = "B";
          break;
        case 7:
          keyName = "H";
          break;
        case 8:
          keyName = "N";
          break;
        case 9:
          keyName = "J";
          break;
        case 10:
          keyName = "M";
          break;
        case 11:
          keyName = "K";
          break;
        case 12:
          keyName = ",";
          break;
        default:
          break;
      }
      p5.push();
      if(keyPressedFlags[i]){
        p5.fill(chorusLyricsColorArray[themeColor])
        p5.textSize(30);
      } else {
        p5.fill(255);
        p5.textSize(25);
      }
      p5.textFont(mplus);
      p5.text(keyName, (x3 + x4) / 2, y3 + 30);
      p5.pop();
    }
  }

  // キーボードマニュアルモード
  p5.keyTyped = (k) => {
    if(!chordKeyboardFlag || !manualMode) return;
    let keyCode = k.code;
    switch (keyCode) {
      case "KeyZ":
        keyPressedFlags[0] = true;
        starOnPos((coordinateMatrix[0][0] + coordinateMatrix[0][2]) / 2 - 100 + width / 2, (coordinateMatrix[0][1] + coordinateMatrix[0][3]) / 2 - 100 + height * 0.618)
        break;
      case "KeyX":
        keyPressedFlags[1] = true;
        starOnPos((coordinateMatrix[1][0] + coordinateMatrix[1][2]) / 2 - 100 + width / 2, (coordinateMatrix[1][1] + coordinateMatrix[1][3]) / 2 - 100 + height * 0.618)
        break;
      case "KeyD":
        keyPressedFlags[2] = true;
        starOnPos((coordinateMatrix[2][0] + coordinateMatrix[2][2]) / 2 - 100 + width / 2, (coordinateMatrix[2][1] + coordinateMatrix[2][3]) / 2 - 100 + height * 0.618)
        break;
      case "KeyC":
        keyPressedFlags[3] = true;
        starOnPos((coordinateMatrix[3][0] + coordinateMatrix[3][2]) / 2 - 100 + width / 2, (coordinateMatrix[3][1] + coordinateMatrix[3][3]) / 2 - 100 + height * 0.618)
        break;
      case "KeyF":
        keyPressedFlags[4] = true;
        starOnPos((coordinateMatrix[4][0] + coordinateMatrix[4][2]) / 2 - 100 + width / 2, (coordinateMatrix[4][1] + coordinateMatrix[4][3]) / 2 - 100 + height * 0.618)
        break;
      case "KeyV":
        keyPressedFlags[5] = true;
        starOnPos((coordinateMatrix[5][0] + coordinateMatrix[5][2]) / 2 - 100 + width / 2, (coordinateMatrix[5][1] + coordinateMatrix[5][3]) / 2 - 100 + height * 0.618)
        break;
      case "KeyB":
        keyPressedFlags[6] = true;
        starOnPos((coordinateMatrix[6][0] + coordinateMatrix[6][2]) / 2 - 100 + width / 2, (coordinateMatrix[6][1] + coordinateMatrix[6][3]) / 2 - 100 + height * 0.618)
        break;
      case "KeyH":
        keyPressedFlags[7] = true;
        starOnPos((coordinateMatrix[7][0] + coordinateMatrix[7][2]) / 2 - 100 + width / 2, (coordinateMatrix[7][1] + coordinateMatrix[7][3]) / 2 - 100 + height * 0.618)
        break;
      case "KeyN":
        keyPressedFlags[8] = true;
        starOnPos((coordinateMatrix[8][0] + coordinateMatrix[8][2]) / 2 - 100 + width / 2, (coordinateMatrix[8][1] + coordinateMatrix[8][3]) / 2 - 100 + height * 0.618)
        break;
      case "KeyJ":
        keyPressedFlags[9] = true;
        starOnPos((coordinateMatrix[9][0] + coordinateMatrix[9][2]) / 2 - 100 + width / 2, (coordinateMatrix[9][1] + coordinateMatrix[9][3]) / 2 - 100 + height * 0.618)
        break;
      case "KeyM":
        keyPressedFlags[10] = true;
        starOnPos((coordinateMatrix[10][0] + coordinateMatrix[10][2]) / 2 - 100 + width / 2, (coordinateMatrix[10][1] + coordinateMatrix[10][3]) / 2 - 100 + height * 0.618)
        break;
      case "KeyK":
        keyPressedFlags[11] = true;
        starOnPos((coordinateMatrix[11][0] + coordinateMatrix[11][2]) / 2 - 100 + width / 2, (coordinateMatrix[11][1] + coordinateMatrix[11][3]) / 2 - 100 + height * 0.618)
        break;
      case "Comma":
        keyPressedFlags[12] = true;
        starOnPos((coordinateMatrix[12][0] + coordinateMatrix[12][2]) / 2 - 100 + width / 2, (coordinateMatrix[12][1] + coordinateMatrix[12][3]) / 2 - 100 + height * 0.618)
        break;
      default:
        break;
    }

    return false;
  }

  p5.keyReleased = (k) => {
    if(!chordKeyboardFlag && !manualMode) return;
    let keyCode = k.code;
    switch (keyCode) {
      case "KeyZ":
        keyPressedFlags[0] = false;
        break;
      case "KeyX":
        keyPressedFlags[1] = false;
        break;
      case "KeyD":
        keyPressedFlags[2] = false;
        break;
      case "KeyC":
        keyPressedFlags[3] = false;
        break;
      case "KeyF":
        keyPressedFlags[4] = false;
        break;
      case "KeyV":
        keyPressedFlags[5] = false;
        break;
      case "KeyB":
        keyPressedFlags[6] = false;
        break;
      case "KeyH":
        keyPressedFlags[7] = false;
        break;
      case "KeyN":
        keyPressedFlags[8] = false;
        break;
      case "KeyJ":
        keyPressedFlags[9] = false;
        break;
      case "KeyM":
        keyPressedFlags[10] = false;
        break;
      case "KeyK":
        keyPressedFlags[11] = false;
        break;
      case "Comma":
        keyPressedFlags[12] = false;
        break;
      default:
        break;
    }
    return false;
  }

  p5.windowResized = () => {
    width = window.innerWidth;
    height = window.innerHeight;

    widthProportion = width / originWidth;
    heightProportion = height / originHeight;

    balls = new Array(Math.round(500 * widthProportion));
    r = width / 2;

    subSatelliteRevolutionRedius = 200;
    maxMainSatelitteRevolutionRedius = subSatelliteRevolutionRedius * 1.618;

    subSatelliteRevolutionRedius *= heightProportion;
    maxMainSatelitteRevolutionRedius *= widthProportion;

    chordKeyboardFlag = true;
    if(height * 0.382 < 310 || width / 2 < 541){
      chordKeyboardFlag = false;
    }

    p5.resizeCanvas(width, height, p5.WEBGL);

    for(let i = 0; i < balls.length; i++){
      var s1 = p5.random(r);
      var s2 = p5.TWO_PI/360 * p5.random(360);
      var s3 = p5.TWO_PI/360 * p5.random(360);
      balls[i] = [s1 * p5.cos(s2), s1 * p5.sin(s2), s3, s1];
    }

    maxCollectionVocalAmplitudeCount = Math.round(width * 0.9 / 15);
  }

});
