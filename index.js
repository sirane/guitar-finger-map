
// フォーカスされている音名indexを格納する。
let focusNoteIndex = 7;
const inner_html_for_degree_index = [
  "<note-root>R</note-root>",
  "<note-9th>m9</note-9th>",
  "<note-9th>M9</note-9th>",
  "<note-3rd>m3</note-3rd>",
  "<note-3rd>M3</note-3rd>",
  "<note-11th></note-11th>",
  "<note-11th>♭5</note-11th>",
  "<note-5th>5</note-5th>",
  "<note-13th>13</note-13th>",
  "<note-13th></note-13th>",
  "<note-7th>m7</note-7th>",
  "<note-7th>M7</note-7th>",
];
// 12音名をAからGまで配列に格納する。
const inner_html_for_note_index = [
  "A",
  "A#",
  "B",
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#"
];
// 12音名ごとの色を配列に格納する。シャープやフレットは真っ白で、他の色はそれぞれ違った薄い色を採用する。
const sound_colors = [
  "#ffffff", // 1
  "#ffffff", // 1s
  "#ffffff", // 2
  "#ffffff", // 3
  "#ffffff",
  "#ffffff", //  4
  "#ffffff",
  "#ffffff", // 5
  "#ffffff", // 6
  "#ffffff",
  "#ffffff", // 7
  "#ffffff",
];
// 各種スケールの設定
const scales = [
  {"indices":[0, 2, 4, 5, 7, 9, 11], "penta": [0, 2, 4, 7, 9] ,"label":"Ionian(Maj)", "bgcolor":"#000"},
  {"indices":[0, 2, 3, 5, 7, 8, 10], "penta": [0, 3, 5, 7, 10] ,"label":"Aeolian(Min)", "bgcolor":"#000"},
  {"indices":[0, 2, 3, 5, 7, 9, 10], "penta": [0, 3, 5, 7, 10] ,"label":"Dorian", "bgcolor":"#000"},
  {"indices":[0, 1, 3, 5, 7, 8, 10], "penta": [0, 3, 5, 7, 10] ,"label":"Phrygian", "bgcolor":"#000"},
  {"indices":[0, 2, 4, 6, 7, 9, 11], "penta": [0, 2, 4, 7, 9] ,"label":"Lydian", "bgcolor":"#000"},
  {"indices":[0, 2, 4, 5, 7, 9, 10], "penta": [0, 2, 4, 7, 9] ,"label":"Mixolydian", "bgcolor":"#000"},
  {"indices":[0, 1, 3, 5, 6, 8, 10], "penta": [0, 3, 5, 6, 10] ,"label":"Locrian", "bgcolor":"#000"},
  {"indices":[0, 1, 3, 4, 6, 8, 10], "penta": [0, 3, 4, 7, 10] ,"label":"Altered", "bgcolor":"#000"}, 
  {"indices":[0, 2, 3, 5, 7, 9, 11], "penta": [0, 3, 5, 7, 9] ,"label":"Melodic Min", "bgcolor":"#000"},
]

// 現在のスケール名を格納する
let currentScaleIndex = 0;
let currentScale = scales[currentScaleIndex];

// currentScaleを次のものに変更する
function switchScaleToNext(){
  currentScaleIndex = (currentScaleIndex + 1) % scales.length;
  currentScale = scales[currentScaleIndex];
  return currentScale
}
function switchScaleToPrev(){
  currentScaleIndex = (currentScaleIndex - 1 + scales.length) % scales.length;
  currentScale = scales[currentScaleIndex];
  return currentScale
}
function update_control_appearance() {
  let scale_name_bgcolor = currentScale["bgcolor"];
  let scale_name_inner_html = currentScale["label"];
  scale_name_inner_html = ` ${inner_html_for_note_index[focusNoteIndex]} ${scale_name_inner_html}`;
  document.getElementById("button-change-scale").style.backgroundColor =
    scale_name_bgcolor;
  document.getElementById("button-change-scale").innerHTML =
    scale_name_inner_html;
  document.getElementById("scale-index").innerHTML = `${currentScaleIndex+1}/${scales.length}`;
  console.debug("scale_name_inner_html", scale_name_inner_html);
}

const CSS_FRET_BORDER_WEIGHT = "5px";
const CSS_FRET_BORDER_COLOR_FOCUSED = "#88d";
// 0fretの音名(EBGDAE) をnotesのindexで配列に格納する。
const openStrings = [7, 2, 10, 5, 0, 7];
const focusDots = [3,5,7,9,15,17,19,21];
const focusDoubleDots = [12];
let is_display_degree_name = true;
const DISPLAY_MODE_CODE = "code";
const DISPLAY_MODE_PENTA = "penta";
let display_mode = DISPLAY_MODE_CODE;

function generateFretBoard() {
  // すべてのfretを削除する。
  document.getElementById("fretboard").innerHTML = "";
  // radio group "code-info" のvalueを取得して変数に設定
  let degree_appearance_mode = document.querySelector(
    'input[name="code-info"]:checked'
  ).value;
  display_mode = document.querySelector(
    'input[name="display-mode"]:checked'
  ).value;
  is_display_degree_name = degree_appearance_mode === "degree-name";
  // ボタンの表記を更新する。
  update_control_appearance();

  // Create 22 frets。 これらの要素は横に並ぶが、中身は縦に並ぶ。
  for (let i = 0; i < 22; i++) {
    create_new_fret(i);
  }

  function create_new_fret(i) {
    let fret = document.createElement("div");
    fret.id = "fret" + i;
    fret.className = "fret";
    // 縦に並ぶ 6弦分の div 要素を作成する。
    for (let j = 0; j < 6; j++) {
      create_new_cell(j, i, fret);
    }
    // フレットごとの処理
    if ( focusDots.includes(i) ) {
      let dot = document.createElement("div");
      dot.className = "dot";
      fret.appendChild(dot);
    } else if (focusDoubleDots.includes(i)) {
      let dot = document.createElement("div");
      dot.className = "double-dot";
      fret.appendChild(dot);
    } else {
      let dot = document.createElement("div");
      fret.appendChild(dot);
      dot.style.visibility = "hidden";
    }
  }

  function create_new_cell(j, i, fret) {
    let string = document.createElement("div");
    string.id = "string" + j;
    string.className = "string";

    // まずセル属性を計上する --------------------------------------------
    // 6弦から1弦までの"j"fretの音名をnotesのindexで配列に格納する
    let note_index = (openStrings[j] + i) % inner_html_for_note_index.length;
    // focusNoteIndexからの相対度数を計算する。
    let relativeNoteIndex =
      (note_index - focusNoteIndex + inner_html_for_note_index.length) % inner_html_for_note_index.length;
    // scaleごとのセル属性を決定
    let is_penta = false;
    let is_in_scale = false;
    let is_in_scale_not_penta = false;
    if(currentScale){
      is_penta = currentScale.penta.includes(relativeNoteIndex);
      is_in_scale = currentScale.indices.includes(relativeNoteIndex);
      is_in_scale_not_penta = is_in_scale && !is_penta;
    }

    // 属性算出は完了。
    // 以下より、表示制御を行う。------------------------------------------------

    // 背景色を設定
    if (display_mode === DISPLAY_MODE_CODE) {
      // string.style.backgroundColor = sound_colors[note_index];
      string.style.backgroundColor = sound_colors[relativeNoteIndex];
    } else if (display_mode === DISPLAY_MODE_PENTA) {
      string.style.backgroundColor =
        relativeNoteIndex == 0 ? "#ccddff" :
          is_penta ? "#bbeeff" :
            is_in_scale_not_penta ? "#ffffff" :
              "#dddddd";
    }

    // 内容テキストを設定
    // focusNoteIndexからの相対度数を表示する。短3度,長三度,完全4度,増4度,完全5度,短7度,長7度にはm3,M3,P4,A4,P5,m7,M7を表示する
    note = "";
    if (is_display_degree_name) {
      note = inner_html_for_degree_index[relativeNoteIndex%12];
      // ただし、j=5の場合はrelativeNoteIndex=0以外は表示しない。
      // if (j === 5 && relativeNoteIndex !== 0) {
      //   note = "";
      // }
    }else{
      note = inner_html_for_note_index[note_index%12]
      // ルート音の場合は強調
      if ( relativeNoteIndex == 0) {
        note = `<note-root>${note}</note-root>`;
      }else if (relativeNoteIndex == 3){
        note = `<note-3rd>${note}</note-3rd>`;
      }else if (relativeNoteIndex == 4){
        note = `<note-3rd>${note}</note-3rd>`;
      }else if (relativeNoteIndex == 7){
        note = `<note-5th>${note}</note-5th>`;
      }
    }
    
    string.innerHTML = note;

    // ボーダーラインを設定
    if (is_penta) {
      string.style.borderRight = `${CSS_FRET_BORDER_WEIGHT} solid ${CSS_FRET_BORDER_COLOR_FOCUSED}`;
    } else if (is_in_scale_not_penta) {
      string.style.borderRight = `${CSS_FRET_BORDER_WEIGHT} dotted ${CSS_FRET_BORDER_COLOR_FOCUSED}`;
    }

    document.getElementById("fretboard").appendChild(fret);
    fret.appendChild(string);
    // クリックイベントを追加する。
    string.addEventListener("click", function () {
      // クリックされた音名indexをfocusNoteIndexに格納する。
      focusNoteIndex = note_index;
      // すべてのfretを削除する。
      document.getElementById("fretboard").innerHTML = "";
      // fretを再生成する。
      generateFretBoard();
    });
  }

  // Function to highlight frets
  function highlightFrets() {
    // Change the range as per your requirement
    for (let i = 5; i < 10; i++) {
      document.getElementById("fret" + i).classList.add("highlight");
    }
  }
}

window.onload = function () {
  generateFretBoard();
};
