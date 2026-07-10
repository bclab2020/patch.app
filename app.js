// 1. Data Store & State
let appState = {
    currentView: 'home',
    mappingTab: 'sports',
    selectedSport: 'sprinting',
    selectedSymptom: 'shoulder_stiff',
    activeDotIndex: 0,
    ringStock: 24,
    prePhotoData: null,
    postPhotoData: null,
    timerInterval: null,
    editMode: false, // Coordinate adjustment mode flag
    historyData: [
        { id: 1, date: '2026-07-01', sport: '陸上 (スプリント)', preRom: 70, postRom: 85, romChange: 21.4, preBal: 12, postBal: 28, balChange: 133.3 },
        { id: 2, date: '2026-07-04', sport: '陸上 (スプリント)', preRom: 72, postRom: 88, romChange: 22.2, preBal: 15, postBal: 35, balChange: 133.3 }
    ],
    cameraStage: null // 'pre' or 'post'
};

// 2. Mapping Data Definitions (16 Sports)
// Enhanced description includes exact finger measurements ("指○本分") for self-finding anatomical locations.
const SPORTS_MAPPING = {
    sprinting: {
        name: "陸上（スプリント・跳躍）",
        desc: "走動作の推進力・ピッチ・接地感覚を最大化するプロトコル",
        points: [
            { x: 81, y: 335, name: "前脛骨筋起始部 (右)", desc: "お皿（膝蓋骨）の外側下縁から指4本分下、すねの骨の外側約1横指のくぼみ。接地時のブレーキを軽減し、足首の滑りを促進。", view: "front" },
            { x: 119, y: 335, name: "前脛骨筋起始部 (左)", desc: "お皿（膝蓋骨）の外側下縁から指4本分下、すねの骨の外側約1横指のくぼみ。接地時のブレーキを軽減し、足首の滑りを促進。", view: "front" },
            { x: 90, y: 160, name: "胸腰椎移行部 T12-L1 (右)", desc: "背骨（脊柱）の中心から左右に指2本分外側、一番下の肋骨（第12肋骨）の先端と同じ高さ。骨盤の前傾制御と体幹の動的安定。", view: "back" },
            { x: 110, y: 160, name: "胸腰椎移行部 T12-L1 (左)", desc: "背骨（脊柱）の中心から左右に指2本分外側、一番下の肋骨（第12肋骨）の先端と同じ高さ。骨盤の前傾制御と体幹の動的安定。", view: "back" },
            { x: 88, y: 220, name: "大殿筋起始部 (右)", desc: "骨盤の後ろの骨の出っ張り（上後腸骨棘）から斜め下外側に指3本分、お尻のふくらみの上縁。股関節伸展パワーを最大化。", view: "back" },
            { x: 112, y: 220, name: "大殿筋起始部 (左)", desc: "骨盤の後ろの骨の出っ張り（上後腸骨棘）から斜め下外側に指3本分、お尻のふくらみの上縁。股関節伸展パワーを最大化。", view: "back" }
        ]
    },
    soccer: {
        name: "サッカー",
        desc: "キック時の軸ブレ防止、急激な切り返し（アジリティ）を強化",
        points: [
            { x: 81, y: 335, name: "前脛骨筋起始部 (右)", desc: "お皿（膝蓋骨）の外側下縁から指4本分下、すねの骨の外側約1横指のくぼみ。切り返し時の足首のブレ抑制と芝への引っかかり防止。", view: "front" },
            { x: 119, y: 335, name: "前脛骨筋起始部 (左)", desc: "お皿（膝蓋骨）の外側下縁から指4本分下、すねの骨の外側約1横指のくぼみ。切り返し時の足首のブレ抑制と芝への引っかかり防止。", view: "front" },
            { x: 82, y: 170, name: "腰方形筋 (QL) 周囲 (右)", desc: "一番下の肋骨と骨盤の骨の縁（腸骨稜）のちょうど中間、背骨から外側に指4本分の脇腹。骨盤の左右ブレを抑え軸を安定。", view: "back" },
            { x: 118, y: 170, name: "腰方形筋 (QL) 周囲 (左)", desc: "一番下の肋骨と骨盤の骨の縁（腸骨稜）のちょうど中間、背骨から外側に指4本分の脇腹。骨盤の左右ブレを抑え軸を安定。", view: "back" },
            { x: 85, y: 205, name: "大腿四頭筋起始部 (右)", desc: "骨盤の前面の出っ張り（上前腸骨棘）から真下に指3本分、太ももの付け根中央。キックのテイクバック可動域を拡大。", view: "front" },
            { x: 115, y: 205, name: "大腿四頭筋起始部 (左)", desc: "骨盤の前面の出っ張り（上前腸骨棘）から真下に指3本分、太ももの付け根中央。キックのテイクバック可動域を拡大。", view: "front" }
        ]
    },
    baseball: {
        name: "野球",
        desc: "投球時の肩甲骨・胸郭連動、バッティング時のスイング軸を安定",
        points: [
            { x: 82, y: 80, name: "鎖骨下周囲 (右)", desc: "鎖骨の外側1/3（肩側の先端近く）のすぐ下にあるくぼみ（中央から指2〜3本分外側）。巻き肩をリセットし、胸郭の開きを拡大。", view: "front" },
            { x: 118, y: 80, name: "鎖骨下周囲 (左)", desc: "鎖骨の外側1/3（肩側の先端近く）のすぐ下にあるくぼみ（中央から指2〜3本分外側）。巻き肩をリセットし、胸郭の開きを拡大。", view: "front" },
            { x: 85, y: 85, name: "棘上筋・棘下筋起始部 (右)", desc: "肩甲骨の斜めに走る出っ張り骨の上側のくぼみ（棘上筋）と、そのすぐ下側の肩甲骨中央（棘下筋）。肩関節の衝突痛を防止し可動域拡大。", view: "back" },
            { x: 115, y: 85, name: "棘上筋・棘下筋起始部 (左)", desc: "肩甲骨の斜めに走る出っ張り骨の上側のくぼみ（棘上筋）と、そのすぐ下側の肩甲骨中央（棘下筋）。肩関節の衝突痛を防止し可動域拡大。", view: "back" },
            { x: 93, y: 200, name: "多裂筋起始部 (右)", desc: "腰の背骨（腰椎）の突起のすぐきわ（指半本分外側）、骨盤中央（仙骨）のすぐ上の高さ。投球・打撃のスイング回旋軸のブレを抑制。", view: "back" },
            { x: 107, y: 200, name: "多裂筋起始部 (左)", desc: "腰の背骨（腰椎）の突起のすぐきわ（指半本分外側）、骨盤中央（仙骨）のすぐ上の高さ. 投球・打撃のスイング回旋軸のブレを抑制。", view: "back" }
        ]
    },
    golf: {
        name: "ゴルフ",
        desc: "アドレス時の重心安定、体幹（スイング軸）の安定を促す",
        points: [
            { x: 90, y: 160, name: "傍脊柱筋 T12周囲 (右)", desc: "一番下の肋骨の高さ（第12胸椎）の背骨のきわから左右に指1.5本分外側。アドレスからフィニッシュまでの前傾角度のキープ。", view: "back" },
            { x: 110, y: 160, name: "傍脊柱筋 T12周囲 (左)", desc: "一番下の肋骨の高さ（第12胸椎）の背骨のきわから左右に指1.5本分外側。アドレスからフィニッシュまでの前傾角度のキープ。", view: "back" },
            { x: 90, y: 190, name: "腸腰筋起始部 (右)", desc: "おへそから左右外側に指3本分、そこからさらに下に指3本分下がったお腹の深部。腰のスウェー（逃げ）を防止。", view: "front" },
            { x: 110, y: 190, name: "腸腰筋起始部 (左)", desc: "おへそから左右外側に指3本分、そこからさらに下に指3本分下がったお腹の深部。腰のスウェー（逃げ）を防止。", view: "front" },
            { x: 50, y: 205, name: "手関節背側 (右)", desc: "手首の甲側のしわの中央から指1本分肘寄り、骨の間のくぼみ。インパクト時の手首のこね（アーリーリリース）を防止。", view: "front" },
            { x: 150, y: 205, name: "手関節背側 (左)", desc: "手首の甲側のしわの中央から指1本分肘寄り、骨の間のくぼみ。インパクト時の手首のこね（アーリーリリース）を防止。", view: "front" }
        ]
    },
    tennis: {
        name: "テニス",
        desc: "リスト・肘の負担軽減とフットワークの敏捷性向上",
        points: [
            { x: 55, y: 140, name: "外側上顆周囲 (右)", desc: "肘の外側の骨の出っ張り（外側上顆）から指1.5本分前腕（手首）寄りの筋肉のふくらみ。テニス肘の予防に効果的。", view: "front" },
            { x: 145, y: 140, name: "外側上顆周囲 (左)", desc: "肘の外側の骨の出っ張り（外側上顆）から指1.5本分前腕（手首）寄りの筋肉のふくらみ。テニス肘の予防に効果的。", view: "front" },
            { x: 82, y: 80, name: "鎖骨下周囲 (右)", desc: "鎖骨の外側1/3のすぐ下にあるくぼみ（中央から指2〜3本分外側）。胸郭の回旋を促し、手打ちを防いで体幹でストローク。", view: "front" },
            { x: 118, y: 80, name: "鎖骨下周囲 (左)", desc: "鎖骨の外側1/3のすぐ下にあるくぼみ（中央から指2〜3本分外側）。胸郭の回旋を促し、手打ちを防いで体幹でストローク。", view: "front" },
            { x: 81, y: 335, name: "前脛骨筋起始部 (右)", desc: "お皿（膝蓋骨）の外側下縁から指4本分下、すねの骨の外側約1横指のくぼみ。スプリットステップからの第一歩の俊敏性向上。", view: "front" },
            { x: 119, y: 335, name: "前脛骨筋起始部 (左)", desc: "お皿（膝蓋骨）の外側下縁から指4本分下、すねの骨の外側約1横指のくぼみ。スプリットステップからの第一歩の俊敏性向上。", view: "front" }
        ]
    },
    basketball: {
        name: "バスケットボール",
        desc: "ジャンプ到達点アップ、着地時の関節保護とクイックネス強化",
        points: [
            { x: 80, y: 310, name: "膝蓋骨周囲 (右)", desc: "お皿（膝蓋骨）の下縁中央から左右外側へ指1本分。ジャンパー膝を防ぎ、着地の内反（ニーイン）を抑える。", view: "front" },
            { x: 120, y: 310, name: "膝蓋骨周囲 (左)", desc: "お皿（膝蓋骨）の下縁中央から左右外側へ指1本分。ジャンパー膝を防ぎ、着地の内反（ニーイン）を抑える。", view: "front" },
            { x: 88, y: 220, name: "大殿筋起始部 (右)", desc: "骨盤の後ろの骨の出っ張り（上後腸骨棘）から斜め下外側に指3本分、お尻のふくらみの上縁。股関節伸展パワーを最大化。", view: "back" },
            { x: 112, y: 220, name: "大殿筋起始部 (左)", desc: "骨盤の後ろの骨の出っ張り（上後腸骨棘）から斜め下外側に指3本分、お尻のふくらみの上縁。股関節伸展パワーを最大化。", view: "back" },
            { x: 81, y: 335, name: "前脛骨筋起始部 (右)", desc: "お皿（膝蓋骨）の外側下縁から指4本分下、すねの骨の外側約1横指のくぼみ。低い姿勢でのディフェンス時の足首のホールド安定。", view: "front" },
            { x: 119, y: 335, name: "前脛骨筋起始部 (左)", desc: "お皿（膝蓋骨）の外側下縁から指4本分下、すねの骨の外側約1横指のくぼみ。低い姿勢でのディフェンス時の足首のホールド安定。", view: "front" }
        ]
    },
    rugby: {
        name: "ラグビー",
        desc: "コンタクト衝撃に耐えるコア（腹圧）と首元の保護",
        points: [
            { x: 88, y: 180, name: "腹横筋起始部 (右)", desc: "骨盤の前の骨の出っ張り（上前腸骨棘）から内側へ指2本分、斜め下へ指1本分入ったところ。インナーユニットを活性化し強い腹圧を構築。", view: "front" },
            { x: 112, y: 180, name: "腹横筋起始部 (左)", desc: "骨盤の前の骨の出っ張り（上前腸骨棘）から内側へ指2本分、斜め下へ指1本分入ったところ。インナーユニットを活性化し強い腹圧を構築。", view: "front" },
            { x: 93, y: 200, name: "脊柱起立筋起始部 (右)", desc: "仙骨（お尻の真ん中の平らな骨）のすぐ上で、背骨の左右外側へ指2本分。タックル・スクラム時に腰椎を支える耐久力向上。", view: "back" },
            { x: 107, y: 200, name: "脊柱起立筋起始部 (左)", desc: "仙骨（お尻の真ん中の平らな骨）のすぐ上で、背骨の左右外側へ指2本分。タックル・スクラム時に腰椎を支える耐久力向上。", view: "back" },
            { x: 85, y: 52, name: "僧帽筋起始部 (右)", desc: "耳の後ろの骨の出っ張り（乳様突起）の下端から後ろへ指2本分進んだ生え際のくぼみ。頭部・頚部のブレを最小限にし脳震盪リスク低減。", view: "back" },
            { x: 115, y: 52, name: "僧帽筋起始部 (左)", desc: "耳の後ろの骨の出っ張り（乳様突起）の下端から後ろへ指2本分進んだ生え際のくぼみ。頭部・頚部のブレを最小限にし脳震盪リスク低減。", view: "back" }
        ]
    },
    swimming: {
        name: "水泳",
        desc: "ストリームライン（一直線姿勢）の維持とストローク効率の向上",
        points: [
            { x: 82, y: 80, name: "鎖骨下周囲 (右)", desc: "鎖骨の外側1/3（肩側の先端近く）のすぐ下にあるくぼみ（中央から指2〜3本分外側）。腕のスムーズな回旋を促す。", view: "front" },
            { x: 118, y: 80, name: "鎖骨下周囲 (左)", desc: "鎖骨の外側1/3（肩側の先端近く）のすぐ下にあるくぼみ（中央から指2〜3本分外側）。腕のスムーズな回旋を促す。", view: "front" },
            { x: 88, y: 180, name: "腹横筋起始部 (右)", desc: "骨盤の前の骨の出っ張り（上前腸骨棘）から内側へ指2本分、斜め下へ指1本分入ったところ。水中での腰の反りを防ぎ一直線キックを維持。", view: "front" },
            { x: 112, y: 180, name: "腹横筋起始部 (左)", desc: "骨盤の前の骨の出っ張り（上前腸骨棘）から内側へ指2本分、斜め下へ指1本分入ったところ。水中での腰の反りを防ぎ一直線キックを維持。", view: "front" },
            { x: 85, y: 85, name: "棘上筋・棘下筋起始部 (右)", desc: "肩甲骨の斜めに走る出っ張り骨の上側のくぼみ（棘上筋）と、そのすぐ下側の肩甲骨中央（棘下筋）。プル動作における肩甲骨の協調性向上。", view: "back" },
            { x: 115, y: 85, name: "棘上筋・棘下筋起始部 (左)", desc: "肩甲骨の斜めに走る出っ張り骨の上側のくぼみ（棘上筋）と、そのすぐ下側の肩甲骨中央（棘下筋）。プル動作における肩甲骨の協調性向上。", view: "back" }
        ]
    },
    volleyball: {
        name: "バレーボール",
        desc: "スパイクスイングスピードの向上と着地によるジャンパー膝予防",
        points: [
            { x: 88, y: 220, name: "大殿筋起始部 (右)", desc: "骨盤の後ろの骨の出っ張り（上後腸骨棘）から斜め下外側に指3本分、お尻のふくらみの上縁。助走から跳躍へ変換する股関節爆発力向上。", view: "back" },
            { x: 112, y: 220, name: "大殿筋起始部 (左)", desc: "骨盤の後ろの骨の出っ張り（上後腸骨棘）から斜め下外側に指3本分、お尻のふくらみの上縁。助走から跳躍へ変換する股関節爆発力向上。", view: "back" },
            { x: 82, y: 80, name: "鎖骨下周囲 (右)", desc: "鎖骨の外側1/3のすぐ下にあるくぼみ（指2〜3本分外側）。スパイクテイクバック時の胸郭のしなりと腕の引き込み。", view: "front" },
            { x: 118, y: 80, name: "鎖骨下周囲 (左)", desc: "鎖骨の外側1/3のすぐ下にあるくぼみ（指2〜3本分外側）。スパイクテイクバック時の胸郭のしなりと腕の引き込み。", view: "front" },
            { x: 80, y: 310, name: "膝蓋骨周囲 (右)", desc: "お皿（膝蓋骨）の下縁中央から左右外側へ指1本分。ジャンパー膝の予防。着地時の急激な膝蓋腱のテンション緩和。", view: "front" },
            { x: 120, y: 310, name: "膝蓋骨周囲 (左)", desc: "お皿（膝蓋骨）の下縁中央から左右外側へ指1本分。ジャンパー膝の予防。着地時の急激な膝蓋腱のテンション緩和。", view: "front" }
        ]
    },
    badminton: {
        name: "バドミントン",
        desc: "フットワークの急ストップ時の安定とリストターンの障害予防",
        points: [
            { x: 81, y: 335, name: "前脛骨筋起始部 (右)", desc: "お皿（膝蓋骨）の外側下縁から指4本分下、すねの骨の外側約1横指のくぼみ。シャトルを拾う最後の一歩の大きな踏み込みと切り返し。", view: "front" },
            { x: 119, y: 335, name: "前脛骨筋起始部 (左)", desc: "お皿（膝蓋骨）の外側下縁から指4本分下、すねの骨の外側約1横指のくぼみ。シャトルを拾う最後の一歩の大きな踏み込みと切り返し。", view: "front" },
            { x: 82, y: 80, name: "鎖骨下周囲 (右)", desc: "鎖骨の外側1/3のすぐ下にあるくぼみ（指2〜3本分外側）。背面のテンションを緩め、高い打点からのスマッシュ胸郭確保。", view: "front" },
            { x: 118, y: 80, name: "鎖骨下周囲 (左)", desc: "鎖骨の外側1/3のすぐ下にあるくぼみ（指2〜3本分外側）。背面のテンションを緩め、高い打点からのスマッシュ胸郭確保。", view: "front" },
            { x: 55, y: 140, name: "外側上顆周囲 (右)", desc: "肘の外側の骨の出っ張り（外側上顆）から指1.5本分前腕（手首）寄りの筋肉のふくらみ。高速フリックによるラケット肘の疲労対策。", view: "front" },
            { x: 145, y: 140, name: "外側上顆周囲 (左)", desc: "肘の外側の骨の出っ張り（外側上顆）から指1.5本分前腕（手首）寄りの筋肉のふくらみ。高速フリックによるラケット肘の疲労対策。", view: "front" }
        ]
    },
    tabletennis: {
        name: "卓球",
        desc: "微小ステップ時の敏捷性と手首のミリ単位コントロール",
        points: [
            { x: 81, y: 335, name: "前脛骨筋起始部 (右)", desc: "お皿（膝蓋骨）の外側下縁から指4本分下、すねの骨の外側約1横指のくぼみ。ラリー中の細かく激しい前後左右の重心移動をアシスト。", view: "front" },
            { x: 119, y: 335, name: "前脛骨筋起始部 (左)", desc: "お皿（膝蓋骨）の外側下縁から指4本分下、すねの骨の外側約1横指のくぼみ。ラリー中の細かく激しい前後左右の重心移動をアシスト。", view: "front" },
            { x: 50, y: 205, name: "手関節背側 (右)", desc: "手首の甲側のしわの中央から指1本分肘寄り、骨の間のくぼみ。手首の精緻なラケット面調整と、チキータ・ドライブ打球精度。", view: "front" },
            { x: 150, y: 205, name: "手関節背側 (左)", desc: "手首の甲側のしわの中央から指1本分肘寄り、骨の間のくぼみ。手首の精緻なラケット面調整と、チキータ・ドライブ打球精度。", view: "front" },
            { x: 90, y: 160, name: "傍脊柱筋 胸腰移行部 (右)", desc: "一番下の肋骨の高さ（第12胸椎）の背骨のきわから左右に指1.5本分外側。低く構える前傾姿勢の維持と腰部痛の緩和。", view: "back" },
            { x: 110, y: 160, name: "傍脊柱筋 胸腰移行部 (左)", desc: "一番下の肋骨の高さ（第12胸椎）の背骨のきわから左右に指1.5本分外側。低く構える前傾姿勢の維持と腰部痛の緩和。", view: "back" }
        ]
    },
    judo: {
        name: "柔道",
        desc: "グラウンディング（踏ん張り）の強化と引き込み握力の維持",
        points: [
            { x: 93, y: 200, name: "多裂筋・傍脊柱筋 (右)", desc: "腰の背骨（腰椎）の突起のきわ（指半本分外側）、仙骨のすぐ上の高さ。相手の引きに耐え、軸を通すための背面コアの強化。", view: "back" },
            { x: 107, y: 200, name: "多裂筋・傍脊柱筋 (左)", desc: "腰の背骨（腰椎）の突起のきわ（指半本分外側）、仙骨のすぐ上の高さ。相手の引きに耐え、軸を通すための背面コアの強化。", view: "back" },
            { x: 91, y: 210, name: "大腿動脈拍動部 (右)", desc: "太ももの付け根（鼠径部）のシワの中央で、脈がドクドクと触れる部分。腰を落とす姿勢での下肢血流低下・疲労の緩和。", view: "front" },
            { x: 109, y: 210, name: "大腿動脈拍動部 (左)", desc: "太も目の付け根（鼠径部）のシワの中央で、脈がドクドクと触れる部分。腰を落とす姿勢での下肢血流低下・疲労の緩和。", view: "front" },
            { x: 52, y: 170, name: "前腕屈筋群 (右)", desc: "肘の内側の骨の出っ張りから指3本分下、前腕の親指側寄りの筋肉のふくらみ。道着を強力にホールドする掴み手の握力持久。", view: "front" },
            { x: 148, y: 170, name: "前腕屈筋群 (左)", desc: "肘の内側の骨の出っ張りから指3本分下、前腕の親指側寄りの筋肉のふくらみ。道着を強力にホールドする掴み手の握力持久。", view: "front" }
        ]
    },
    handball: {
        name: "ハンドボール",
        desc: "空中の接触衝撃に耐える空中バランスとシュート可動域",
        points: [
            { x: 88, y: 180, name: "腹横筋起始部 (右)", desc: "骨盤の前の骨の出っ張り（上前腸骨棘）から内側へ指2本分、斜め下へ指1本分入ったところ。空中シュート時に相手と接触してもブレない軸の確保。", view: "front" },
            { x: 112, y: 180, name: "腹横筋起始部 (左)", desc: "骨盤の前の骨の出っ張り（上前腸骨棘）から内側へ指2本分、斜め下へ指1本分入ったところ。空中シュート時に相手と接触してもブレない軸の確保。", view: "front" },
            { x: 82, y: 80, name: "鎖骨下周囲 (右)", desc: "鎖骨の外側1/3のすぐ下にあるくぼみ（指2〜3本分外側）。キャッチ・シュートにおける肩甲胸郭関節の回旋リリース。", view: "front" },
            { x: 118, y: 80, name: "鎖骨下周囲 (左)", desc: "鎖骨の外側1/3のすぐ下にあるくぼみ（指2〜3本分外側）。キャッチ・シュートにおける肩甲胸郭関節の回旋リリース。", view: "front" },
            { x: 81, y: 335, name: "前脛骨筋起始部 (右)", desc: "お皿（膝蓋骨）の外側下縁から指4本分下、すねの骨の外側約1横指のくぼみ。激しいストップ＆ゴーに対応する足首コントロール。", view: "front" },
            { x: 119, y: 335, name: "前脛骨筋起始部 (左)", desc: "お皿（膝蓋骨）の外側下縁から指4本分下、すねの骨の外側約1横指のくぼみ。激しいストップ＆ゴーに対応する足首コントロール。", view: "front" }
        ]
    },
    figureskating: {
        name: "フィギュアスケート [後半プロトコル]",
        desc: "ジャンプ着氷時の目線のブレ抑制、スピン時の軸の安定",
        points: [
            { x: 100, y: 48, name: "後頚部 (第2-3頚椎間)", desc: "首の後ろの最も出っ張った骨（第7頚椎）から上に指2本分、背骨のすぐ外側のくぼみ。頭部・眼球の協調運動を司る後頭下筋群をリリースし、着氷時の平衡感覚を再起動。", view: "back" },
            { x: 93, y: 200, name: "多裂筋起始部 (右)", desc: "腰の背骨（腰椎）の突起のすぐきわ（指半本分外側）、仙骨のすぐ上。スピンやスパイラル姿勢の維持に必要な深層体幹の極小のコントロール。", view: "back" },
            { x: 107, y: 200, name: "多裂筋起始部 (左)", desc: "腰の背骨（腰椎）の突起のすぐきわ（指半本分外側）、仙骨のすぐ上。スピンやスパイラル姿勢の維持に必要な深層体幹の極小のコントロール。", view: "back" },
            { x: 88, y: 220, name: "大殿筋起始部 (右)", desc: "骨盤の後ろの骨の出っ張り（上後腸骨棘）から斜め下外側に指3本分、お尻のふくらみの上縁。片足滑走（スケーティング）時の骨盤の水平アライメント維持。", view: "back" },
            { x: 112, y: 220, name: "大殿筋起始部 (左)", desc: "骨盤の後ろの骨の出っ張り（上後腸骨棘）から斜め下外側に指3本分、お尻のふくらみの上縁。片足滑走（スケーティング）時の骨盤の水平アライメント維持。", view: "back" }
        ]
    },
    ballet: {
        name: "バレエ [後半プロトコル]",
        desc: "つま先立ち（ルルベ）時の軸ブレ軽減、ターンアウト可動域向上",
        points: [
            { x: 81, y: 335, name: "前脛骨筋起始部 (右)", desc: "お皿（膝蓋骨）の外側下縁から指4本分下、すねの骨の外側約1横指のくぼみ。ポワント・ルルベ時の足関節・足根骨アライメントの安定。", view: "front" },
            { x: 119, y: 335, name: "前脛骨筋起始部 (左)", desc: "お皿（膝蓋骨）の外側下縁から指4本分下、すねの骨の外側約1横指のくぼみ。ポワント・ルルベ時の足関節・足根骨アライメントの安定。", view: "front" },
            { x: 90, y: 190, name: "腸腰筋起始部 (右)", desc: "おへそから左右外側に指3本分、そこからさらに下に指3本分下がったお腹の深部。脚を高くキープする（アラベスクなど）際、腰椎代償反りを防ぐ。", view: "front" },
            { x: 110, y: 190, name: "腸腰筋起始部 (左)", desc: "おへそから左右外側に指3本分、そこからさらに下に指3本分下がったお腹の深部。脚を高くキープする（アラベスクなど）際、腰椎代償反りを防ぐ。", view: "front" },
            { x: 90, y: 160, name: "傍脊柱筋 (右)", desc: "一番下の肋骨の高さ（第12胸椎）の背骨のきわから左右に指1.5本分外側。背中のしなやかな引き上げと、アンオー時の姿勢維持。", view: "back" },
            { x: 110, y: 160, name: "傍脊柱筋 (左)", desc: "一番下の肋骨の高さ（第12胸椎）の背骨のきわから左右に指1.5本分外側。背中のしなやかな引き上げと、アンオー時の姿勢維持。", view: "back" }
        ]
    },
    dance: {
        name: "ダンス [後半プロトコル]",
        desc: "アイソレーション可動域の拡大とフットワークのキレ向上",
        points: [
            { x: 82, y: 80, name: "鎖骨下周囲 (右)", desc: "鎖骨の外側1/3のすぐ下にあるくぼみ（指2〜3本分外側）。胸・肩の独立した動き（アイソレーション）の可動制限解除。", view: "front" },
            { x: 118, y: 80, name: "鎖骨下周囲 (左)", desc: "鎖骨の外側1/3のすぐ下にあるくぼみ（指2〜3本分外側）。胸・肩の独立した動き（アイソレーション）の可動制限解除。", view: "front" },
            { x: 90, y: 160, name: "胸腰椎移行部 T12-L1 (右)", desc: "背骨（脊柱）の中心から左右に指2本分外側、一番下の肋骨（第12肋骨）の先端と同じ高さ。上下の運動連動性を高め、アップ・ダウンステップのバネを出す。", view: "back" },
            { x: 110, y: 160, name: "胸腰椎移行部 T12-L1 (左)", desc: "背骨（脊柱）の中心から左右に指2本分外側、一番下の肋骨（第12肋骨）の先端と同じ高さ。上下の運動連動性を高め、アップ・ダウンステップのバネを出す。", view: "back" },
            { x: 88, y: 220, name: "上殿皮神経周囲 (右)", desc: "腰骨の最上部（腸骨稜）の後ろの出っ張りから斜め下へ指2本分、お尻の上部。骨盤の逃げを防ぎ、フロアワーク時の接地安定感をサポート。", view: "back" },
            { x: 112, y: 220, name: "上殿皮神経周囲 (左)", desc: "腰骨の最上部（腸骨稜）の後ろの出っ張りから斜め下へ指2本分、お尻の上部。骨盤の逃げを防ぎ、フロアワーク時の接地安定感をサポート。", view: "back" }
        ]
    }
};

// 3. Symptoms Mapping Data
const SYMPTOMS_MAPPING = {
    shoulder_stiff: {
        name: "肩こり・首の張り",
        desc: "デスクワークによる巻き肩・頚部交感神経緊張をリリース",
        points: [
            { x: 100, y: 48, name: "後頚部 (C2-C3棘突起間)", desc: "首の後ろの最も出っ張った骨（第7頚椎）から上に指2本分、背骨のすぐ外側のくぼみ。頚部交感神経を抑制し筋緊張緩和。", view: "back" },
            { x: 90, y: 110, name: "肩甲間部 (Th3-Th4レベル) (右)", desc: "背骨の中心と肩甲骨の内側縁のちょうど中間、上から指3本分下がった高さ。肩甲骨の位置アライメントを正常化。", view: "back" },
            { x: 110, y: 110, name: "肩甲間部 (Th3-Th4レベル) (左)", desc: "背骨の中心と肩甲骨の内側縁のちょうど中間、上から指3本分下がった高さ。肩甲骨の位置アライメントを正常化。", view: "back" },
            { x: 85, y: 52, name: "僧帽筋起始部 (右)", desc: "耳の後ろの骨の出っ張り（乳様突起）の下端から後ろへ指2本分進んだ生え際のくぼみ。肩の挙上トーンを引き下げる。", view: "back" },
            { x: 115, y: 52, name: "僧帽筋起始部 (左)", desc: "耳の後ろの骨の出っ張り（乳様突起）の下端から後ろへ指2本分進んだ生え際のくぼみ。肩の挙上トーンを引き下げる。", view: "back" }
        ]
    },
    back_pain: {
        name: "腰痛・腰の張り",
        desc: "体幹深層筋を活性化し、腰背部にかかる不要な代償緊張をリセット",
        points: [
            { x: 90, y: 160, name: "胸腰椎移行部 (右)", desc: "一番下の肋骨の高さ（第12胸椎）の背骨のきわから左右に指1.5本分外側。多裂筋・胸最長筋を活性化し腰部のアライメント修正。", view: "back" },
            { x: 110, y: 160, name: "胸腰椎移行部 (左)", desc: "一番下の肋骨の高さ（第12胸椎）の背骨のきわから左右に指1.5本分外側。多裂筋・胸最長筋を活性化し腰部のアライメント修正。", view: "back" },
            { x: 82, y: 170, name: "腰方形筋 (QL) 周囲 (右)", desc: "一番下の肋骨（第12肋骨）と骨盤の骨の縁（腸骨稜）のちょうど中間、背骨から指4本分外側の脇腹。腰の側屈・回旋時の痛みを緩和。", view: "back" },
            { x: 118, y: 170, name: "腰方形筋 (QL) 周囲 (左)", desc: "一番下の肋骨（第12肋骨）と骨盤の骨の縁（腸骨稜）のちょうど中間、背骨から指4本分外側の脇腹。腰の側屈・回旋時の痛みを緩和。", view: "back" },
            { x: 90, y: 190, name: "腸腰筋起始部 (右)", desc: "おへそから左右外側に指3本分、そこからさらに下に指3本分下がったお腹の深部（ゆっくり息を吐きながら押す）。前屈姿勢を改善。", view: "front" },
            { x: 110, y: 190, name: "腸腰筋起始部 (左)", desc: "おへそから左右外側に指3本分、そこからさらに下に指3本分下がったお腹の深部（ゆっくり息を吐きながら押す）。前屈姿勢を改善。", view: "front" }
        ]
    },
    sciatica: {
        name: "坐骨神経痛様・脚のしびれ",
        desc: "神経絞扼（こうやく）部位周囲へ感覚刺激を送り、滑動性と血行を促進",
        points: [
            { x: 88, y: 220, name: "上殿皮神経・梨状筋部 (右)", desc: "腰骨の最上部（腸骨稜）の後ろの出っ張りから斜め下へ指2本分、お尻の上部。殿部から太ももにかけてのつっぱり感を軽減。", view: "back" },
            { x: 112, y: 220, name: "上殿皮神経・梨状筋部 (左)", desc: "腰骨の最上部（腸骨稜）の後ろの出っ張りから斜め下へ指2本分、お尻の上部。殿部から太ももにかけてのつっぱり感を軽減。", view: "back" },
            { x: 93, y: 170, name: "脊髄神経出口付近 (右)", desc: "背骨（腰椎）の突起から左右に指1.5本分外側、腰の最もくびれる高さ。脊髄神経根の滑りを促し痛みをブロック。", view: "back" },
            { x: 107, y: 170, name: "脊髄神経出口付近 (左)", desc: "背骨（腰椎）の突起から左右に指1.5本分外側、腰の最もくびれる高さ。脊髄神経根の滑りを促し痛みをブロック。", view: "back" },
            { x: 74, y: 310, name: "総腓骨神経走向 (右)", desc: "膝の裏の外側にある硬い腱のすぐ内側、または腓骨頭（外側のすねの骨の出っ張り）のすぐ後ろ下のくぼみ。足首のしびれ・ふらつきを改善。", view: "back" },
            { x: 126, y: 310, name: "総腓骨神経走向 (左)", desc: "膝の裏の外側にある硬い腱のすぐ内側、または腓骨頭（外側のすねの骨の出っ張り）のすぐ後ろ下のくぼみ。足首のしびれ・ふらつきを改善。", view: "back" }
        ]
    }
};

// 4. View Control & Navigation
function switchView(viewId) {
    appState.currentView = viewId;
    
    document.querySelectorAll('.app-view').forEach(view => {
        view.classList.remove('active');
    });
    const targetView = document.getElementById(`view-${viewId}`);
    if (targetView) targetView.classList.add('active');

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    const activeNav = document.getElementById(`nav-${viewId}`);
    if (activeNav) activeNav.classList.add('active');

    if (viewId === 'history') {
        renderHistoryChart();
        renderHistoryList();
    } else if (viewId === 'map') {
        renderMappingSelectorOptions();
        loadSportMapping(appState.selectedSport);
    }
}

// 5. Mapping Guideline Functions
function switchMappingTab(tabName) {
    appState.mappingTab = tabName;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.mapping-tab-content').forEach(cont => cont.classList.remove('active'));

    if (tabName === 'sports') {
        event.target.classList.add('active');
        document.getElementById('mapping-sports-container').classList.add('active');
        loadSportMapping(appState.selectedSport);
    } else {
        event.target.classList.add('active');
        document.getElementById('mapping-symptoms-container').classList.add('active');
        loadSymptomMapping(appState.selectedSymptom);
    }
}

function renderMappingSelectorOptions() {
    const sportSel = document.getElementById('sportSelector');
    sportSel.innerHTML = '';
    for (let key in SPORTS_MAPPING) {
        let opt = document.createElement('option');
        opt.value = key;
        opt.textContent = SPORTS_MAPPING[key].name;
        if (key === appState.selectedSport) opt.selected = true;
        sportSel.appendChild(opt);
    }

    const sympSel = document.getElementById('symptomSelector');
    sympSel.innerHTML = '';
    for (let key in SYMPTOMS_MAPPING) {
        let opt = document.createElement('option');
        opt.value = key;
        opt.textContent = SYMPTOMS_MAPPING[key].name;
        if (key === appState.selectedSymptom) opt.selected = true;
        sympSel.appendChild(opt);
    }
}

function loadSportMapping(sportKey) {
    appState.selectedSport = sportKey;
    appState.activeDotIndex = 0;
    const data = SPORTS_MAPPING[sportKey];
    document.getElementById('mappingTitle').textContent = data.name;
    document.getElementById('mappingDescription').textContent = data.desc;
    renderMappingInteractive(data.points);
}

function loadSymptomMapping(symptomKey) {
    appState.selectedSymptom = symptomKey;
    appState.activeDotIndex = 0;
    const data = SYMPTOMS_MAPPING[symptomKey];
    document.getElementById('mappingTitle').textContent = data.name;
    document.getElementById('mappingDescription').textContent = data.desc;
    renderMappingInteractive(data.points);
}

function renderMappingInteractive(points) {
    const activePt = points[appState.activeDotIndex] || points[0];
    const activeView = (activePt && activePt.view) ? activePt.view : 'front';

    const bodyImg = document.getElementById('bodyOutlineImage');
    const viewIndicator = document.getElementById('bodyViewIndicator');
    if (bodyImg) {
        bodyImg.setAttribute('href', activeView === 'back' ? 'body_back.png' : 'body_front.png');
    }
    if (viewIndicator) {
        viewIndicator.textContent = activeView === 'back' ? '背面 (BACK)' : '前面 (FRONT)';
    }

    // 1. Draw SVG dots (only those matching current active view)
    const svg = document.getElementById('bodySvg');
    document.querySelectorAll('.body-svg .map-dot').forEach(el => el.remove());
    
    points.forEach((pt, index) => {
        if ((pt.view || 'front') === activeView) {
            let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", pt.x);
            circle.setAttribute("cy", pt.y);
            circle.setAttribute("r", "6");
            circle.setAttribute("class", `map-dot dot-${index} ${index === appState.activeDotIndex ? 'active' : ''}`);
            circle.setAttribute("style", appState.editMode ? "cursor: move;" : "cursor: pointer;");
            svg.appendChild(circle);
        }
    });

    // 2. Draw sidebar point list
    const listContainer = document.getElementById('targetPointList');
    listContainer.innerHTML = '';
    
    points.forEach((pt, index) => {
        let card = document.createElement('div');
        card.className = `target-point-item item-${index} ${index === appState.activeDotIndex ? 'active' : ''}`;
        card.setAttribute("onclick", `selectPoint(${index})`);
        const sideLabel = pt.view === 'back' ? '背面' : '前面';
        card.innerHTML = `
            <h4><span class="dot-number">${index + 1}</span> ${pt.name} <span style="font-size: 8px; margin-left: auto; padding: 2px 6px; border-radius: 4px; background: rgba(255,255,255,0.05); color: var(--text-muted);">${sideLabel}</span></h4>
            <p>${pt.desc}</p>
        `;
        listContainer.appendChild(card);
    });

    // 3. Show D-pad & Update status if edit mode is active
    const dpad = document.getElementById('dpadContainer');
    if (dpad) {
        dpad.style.display = appState.editMode ? 'flex' : 'none';
        if (appState.editMode && activePt) {
            updateDpadStatus(activePt);
        }
    }

    if (appState.editMode) {
        updateExportData();
    }
}

function selectPoint(index) {
    appState.activeDotIndex = index;
    
    const tabName = appState.mappingTab;
    const points = tabName === 'sports' 
        ? SPORTS_MAPPING[appState.selectedSport].points 
        : SYMPTOMS_MAPPING[appState.selectedSymptom].points;

    renderMappingInteractive(points);
}

// 5.5 Drag and Drop Coordinate Adjustment Logic
let isDragging = false;
let draggedDotIndex = null;

function initDragAndDrop() {
    const svg = document.getElementById('bodySvg');
    if (!svg) return;
    
    // Mouse events
    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', endDrag);
    
    // Touch events for mobile support
    svg.addEventListener('touchstart', startDrag, { passive: false });
    svg.addEventListener('touchmove', drag, { passive: false });
    window.addEventListener('touchend', endDrag);
}

function startDrag(e) {
    if (!appState.editMode) return;
    const target = e.target;
    if (target.classList.contains('map-dot')) {
        e.preventDefault();
        isDragging = true;
        const dotClass = Array.from(target.classList).find(c => c.startsWith('dot-'));
        if (dotClass) {
            draggedDotIndex = parseInt(dotClass.split('-')[1]);
            selectPoint(draggedDotIndex);
        }
    }
}

function drag(e) {
    if (!isDragging || draggedDotIndex === null) return;
    e.preventDefault();
    
    const svg = document.getElementById('bodySvg');
    const rect = svg.getBoundingClientRect();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const scaleX = 200 / rect.width;
    const scaleY = 400 / rect.height;
    
    let x = Math.round((clientX - rect.left) * scaleX);
    let y = Math.round((clientY - rect.top) * scaleY);
    
    // Clamp inside viewBox limits (200 x 400)
    x = Math.max(0, Math.min(200, x));
    y = Math.max(0, Math.min(400, y));
    
    const tabName = appState.mappingTab;
    const points = tabName === 'sports' 
        ? SPORTS_MAPPING[appState.selectedSport].points 
        : SYMPTOMS_MAPPING[appState.selectedSymptom].points;
        
    if (points[draggedDotIndex]) {
        points[draggedDotIndex].x = x;
        points[draggedDotIndex].y = y;
        
        // Update SVG circle dynamically
        const circle = svg.querySelector(`.dot-${draggedDotIndex}`);
        if (circle) {
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
        }
        
        updateExportData();
    }
}

function endDrag() {
    if (isDragging) {
        isDragging = false;
        draggedDotIndex = null;
        saveCustomCoordinates();
    }
}

function toggleEditMode() {
    appState.editMode = !appState.editMode;
    const btn = document.getElementById('editModeBtn');
    const dashboard = document.querySelector('.mapping-dashboard');
    
    if (appState.editMode) {
        btn.classList.add('active');
        btn.innerHTML = `<i class="fa-solid fa-check"></i> 調整終了`;
        if (dashboard) dashboard.classList.add('edit-active');
        showToast("座標調整モード開始。ドットをドラッグして位置を調整してください。");
    } else {
        btn.classList.remove('active');
        btn.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> 座標調整`;
        if (dashboard) dashboard.classList.remove('edit-active');
        showToast("座標の調整を終了しました。右上の「一括コード出力」からコードを取得できます。");
    }
    
    // Re-render dots to update cursor style
    const tabName = appState.mappingTab;
    const points = tabName === 'sports' 
        ? SPORTS_MAPPING[appState.selectedSport].points 
        : SYMPTOMS_MAPPING[appState.selectedSymptom].points;
    renderMappingInteractive(points);
}

function moveActivePoint(dx, dy) {
    const tabName = appState.mappingTab;
    const points = tabName === 'sports' 
        ? SPORTS_MAPPING[appState.selectedSport].points 
        : SYMPTOMS_MAPPING[appState.selectedSymptom].points;
        
    const pt = points[appState.activeDotIndex];
    if (pt) {
        pt.x = Math.max(0, Math.min(200, pt.x + dx));
        pt.y = Math.max(0, Math.min(400, pt.y + dy));
        
        // Update SVG circle coordinates
        const circle = document.querySelector(`#bodySvg .dot-${appState.activeDotIndex}`);
        if (circle) {
            circle.setAttribute('cx', pt.x);
            circle.setAttribute('cy', pt.y);
        }
        
        updateDpadStatus(pt);
        saveCustomCoordinates();
    }
}

function updateDpadStatus(pt) {
    const nameEl = document.getElementById('dpadActivePointName');
    const valX = document.getElementById('dpadValX');
    const valY = document.getElementById('dpadValY');
    
    if (pt) {
        if (nameEl) nameEl.textContent = `${appState.activeDotIndex + 1}. ${pt.name}`;
        if (valX) valX.textContent = pt.x;
        if (valY) valY.textContent = pt.y;
    }
}

function openExportModal() {
    const modal = document.getElementById('exportModal');
    if (modal) {
        updateExportData();
        modal.style.display = 'flex';
    }
}

function closeExportModal() {
    const modal = document.getElementById('exportModal');
    if (modal) {
        modal.style.display = 'none';
    }
}


function updateExportData() {
    const area = document.getElementById('coordExportArea');
    if (!area) return;
    
    const exportObj = {
        sports: SPORTS_MAPPING,
        symptoms: SYMPTOMS_MAPPING
    };
    
    // Formatted JS export
    let codeStr = `// 貼り付け用カスタム座標データ（このコードをAIアシスタントに送信してください）\n`;
    codeStr += `const CUSTOM_SPORTS_MAPPING = ${JSON.stringify(SPORTS_MAPPING, null, 4)};\n\n`;
    codeStr += `const CUSTOM_SYMPTOMS_MAPPING = ${JSON.stringify(SYMPTOMS_MAPPING, null, 4)};`;
    
    area.value = codeStr;
}

function copyExportedCode() {
    const area = document.getElementById('coordExportArea');
    if (!area) return;
    
    navigator.clipboard.writeText(area.value)
        .then(() => {
            showToast("プログラムコードをコピーしました！AIアシスタントのチャットに貼り付けて送信してください。");
        })
        .catch(err => {
            console.error("Copy failed:", err);
            showToast("コピーに失敗しました。テキストエリアを直接選択してコピーしてください。");
        });
}

function saveCustomCoordinates() {
    localStorage.setItem('bc_lab_custom_coords', JSON.stringify({
        sports: SPORTS_MAPPING,
        symptoms: SYMPTOMS_MAPPING
    }));
}

function resetCustomCoordinates() {
    if (confirm("座標設定を初期状態（デフォルト）にリセットしますか？")) {
        localStorage.removeItem('bc_lab_custom_coords');
        showToast("座標設定をリセットしました。ページを再読み込みします。");
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

function loadCustomCoordinates() {
    const stored = localStorage.getItem('bc_lab_custom_coords');
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (parsed.sports) {
                for (let key in parsed.sports) {
                    if (SPORTS_MAPPING[key]) {
                        SPORTS_MAPPING[key].points.forEach((pt, idx) => {
                            if (parsed.sports[key].points[idx]) {
                                pt.x = parsed.sports[key].points[idx].x;
                                pt.y = parsed.sports[key].points[idx].y;
                            }
                        });
                    }
                }
            }
            if (parsed.symptoms) {
                for (let key in parsed.symptoms) {
                    if (SYMPTOMS_MAPPING[key]) {
                        SYMPTOMS_MAPPING[key].points.forEach((pt, idx) => {
                            if (parsed.symptoms[key].points[idx]) {
                                pt.x = parsed.symptoms[key].points[idx].x;
                                pt.y = parsed.symptoms[key].points[idx].y;
                            }
                        });
                    }
                }
            }
        } catch (e) {
            console.error("Failed to parse custom coordinates:", e);
        }
    }
}

// 6. Pre/Post Evaluation Wizard
function nextWizardStep(stepNum) {
    document.querySelectorAll('.wizard-step').forEach(step => step.classList.remove('active'));
    document.getElementById(`step-${stepNum}`).classList.add('active');
}

function runTimer(stage) {
    const textEl = document.getElementById(`${stage}TimerText`);
    const btnEl = document.getElementById(`${stage}TimerBtn`);
    
    if (appState.timerInterval) {
        clearInterval(appState.timerInterval);
        appState.timerInterval = null;
        textEl.textContent = "00:30";
        btnEl.innerHTML = `<i class="fa-solid fa-stopwatch"></i> 計測タイマー開始 (30秒)`;
        return;
    }

    let timeLeft = 30;
    btnEl.innerHTML = `<i class="fa-solid fa-square-stop"></i> タイマー停止`;
    
    appState.timerInterval = setInterval(() => {
        timeLeft--;
        let displaySec = timeLeft < 10 ? `0${timeLeft}` : timeLeft;
        textEl.textContent = `00:${displaySec}`;
        
        if (timeLeft <= 0) {
            clearInterval(appState.timerInterval);
            appState.timerInterval = null;
            textEl.textContent = "終了！";
            btnEl.innerHTML = `<i class="fa-solid fa-stopwatch"></i> 計測タイマー開始 (30秒)`;
            showToast("テスト時間30秒が経過しました！保持時間を入力してください。");
        }
    }, 1000);
}

function calculateResults() {
    const preRom = parseFloat(document.getElementById('preRom').value) || 70;
    const postRom = parseFloat(document.getElementById('postRom').value) || 85;
    const preBal = parseFloat(document.getElementById('preBalance').value) || 15;
    const postBal = parseFloat(document.getElementById('postBalance').value) || 40;

    const romChange = (((postRom - preRom) / preRom) * 100).toFixed(1);
    const balChange = (((postBal - preBal) / preBal) * 100).toFixed(1);

    document.getElementById('resPreRom').textContent = `${preRom}°`;
    document.getElementById('resPostRom').textContent = `${postRom}°`;
    document.getElementById('resRomChange').textContent = `${romChange > 0 ? '+' : ''}${romChange}%`;
    
    document.getElementById('resPreBal').textContent = `${preBal}秒`;
    document.getElementById('resPostBal').textContent = `${postBal}秒`;
    document.getElementById('resBalChange').textContent = `${balChange > 0 ? '+' : ''}${balChange}%`;

    const usedRings = 6;
    deductRings(usedRings);

    const today = new Date().toISOString().split('T')[0];
    const sportName = SPORTS_MAPPING[appState.selectedSport].name;
    const newRecord = {
        id: Date.now(),
        date: today,
        sport: sportName,
        preRom: preRom,
        postRom: postRom,
        romChange: parseFloat(romChange),
        preBal: preBal,
        postBal: postBal,
        balChange: parseFloat(balChange)
    };
    appState.historyData.push(newRecord);
    saveStateToLocalStorage();

    nextWizardStep(3);
    showToast("神経促通の測定結果が保存されました！");
}

function resetWizard() {
    document.getElementById('preRom').value = '';
    document.getElementById('postRom').value = '';
    document.getElementById('preBalance').value = '';
    document.getElementById('postBalance').value = '';
    appState.prePhotoData = null;
    appState.postPhotoData = null;
    
    document.getElementById('prePhotoPreview').innerHTML = `<span class="placeholder-text"><i class="fa-solid fa-image"></i> 写真未撮影</span>`;
    document.getElementById('postPhotoPreview').innerHTML = `<span class="placeholder-text"><i class="fa-solid fa-image"></i> 写真未撮影</span>`;
    
    nextWizardStep(1);
}

// 7. Stock adhesive rings counter
function deductRings(qty) {
    appState.ringStock = Math.max(0, appState.ringStock - qty);
    saveStateToLocalStorage();
    updateStockUI(qty);
    
    if (appState.ringStock <= 6) {
        showToast("警告: シールの残数が少なくなっています。追加購入を検討してください。");
    }
}

function replenishRings(qty) {
    appState.ringStock = qty;
    saveStateToLocalStorage();
    updateStockUI(0);
    showToast(`貼付用シールを${qty}枚にリセット・補充しました。`);
}

function updateStockUI(usedQty) {
    document.getElementById('globalRingCount').textContent = appState.ringStock;
    
    const usedText = document.getElementById('usedCountDisplay');
    const stockText = document.getElementById('stockCountDisplay');
    const fillEl = document.getElementById('ringProgressBar');
    
    if (usedText && stockText && fillEl) {
        usedText.textContent = usedQty;
        stockText.textContent = appState.ringStock;
        
        let pct = (appState.ringStock / 24) * 100;
        fillEl.style.width = `${pct}%`;
        
        if (pct <= 25) fillEl.style.backgroundColor = 'var(--accent)';
        else fillEl.style.backgroundColor = 'var(--secondary)';
    }
}

function simulatePurchase() {
    replenishRings(24);
    showToast("シールのご注文ありがとうございます！残数を24枚にリセットしました。");
}

// 8. Photo Camera Overlay & Comparison
function startCamera(stage) {
    appState.cameraStage = stage;
    const modal = document.getElementById('cameraModal');
    const webcam = document.getElementById('webcam');
    const overlayImg = document.getElementById('transparencyOverlayImg');
    const transControl = document.getElementById('transparencyControl');
    const titleEl = document.getElementById('cameraTitle');
    
    titleEl.textContent = stage === 'pre' ? 'プレテスト（貼る前）前屈の撮影' : 'ポストテスト（貼った後）重ね合わせ撮影';
    modal.style.display = 'flex';

    if (stage === 'post' && appState.prePhotoData) {
        overlayImg.src = appState.prePhotoData;
        overlayImg.style.display = 'block';
        transControl.style.display = 'flex';
        adjustOverlayTransparency(50);
    } else {
        overlayImg.style.display = 'none';
        transControl.style.display = 'none';
    }

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
            webcam.srcObject = stream;
        })
        .catch(err => {
            console.error("Webcam error:", err);
            showToast("カメラが見つかりません。デモ用プレースホルダー写真をロードします。");
            simulateCameraSnapshotFallback(stage);
        });
}

function closeCamera() {
    const modal = document.getElementById('cameraModal');
    const webcam = document.getElementById('webcam');
    
    if (webcam.srcObject) {
        webcam.srcObject.getTracks().forEach(track => track.stop());
    }
    
    modal.style.display = 'none';
}

function takeSnapshot() {
    const webcam = document.getElementById('webcam');
    const canvas = document.getElementById('photoCanvas');
    const context = canvas.getContext('2d');
    
    if (webcam.srcObject) {
        canvas.width = webcam.videoWidth;
        canvas.height = webcam.videoHeight;
        context.drawImage(webcam, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/png');
        saveCapturedPhoto(appState.cameraStage, dataUrl);
    } else {
        simulateCameraSnapshotFallback(appState.cameraStage);
    }
    
    closeCamera();
}

function simulateCameraSnapshotFallback(stage) {
    const dataUrl = stage === 'pre' 
        ? "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='120' viewBox='0 0 160 120'><rect width='100%' height='100%' fill='%231e293b'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='11'>Pre 前屈 65°</text></svg>"
        : "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='120' viewBox='0 0 160 120'><rect width='100%' height='100%' fill='%230f172a'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%2339ff14' font-size='11'>Post 前屈 85°</text></svg>";
    saveCapturedPhoto(stage, dataUrl);
}

function saveCapturedPhoto(stage, dataUrl) {
    if (stage === 'pre') {
        appState.prePhotoData = dataUrl;
        document.getElementById('prePhotoPreview').innerHTML = `<img src="${dataUrl}" alt="Pre Photo">`;
        showToast("貼る前の姿勢写真を記録しました！");
    } else {
        appState.postPhotoData = dataUrl;
        document.getElementById('postPhotoPreview').innerHTML = `<img src="${dataUrl}" alt="Post Photo">`;
        showToast("貼付後の比較写真を作成しました！");
    }
}

function adjustOverlayTransparency(value) {
    const overlayImg = document.getElementById('transparencyOverlayImg');
    if (overlayImg) {
        overlayImg.style.opacity = value / 100;
    }
}

// 9. Chart.js History Graph Rendering
let historyChartInstance = null;

function renderHistoryChart() {
    const ctx = document.getElementById('historyChart').getContext('2d');
    
    if (historyChartInstance) {
        historyChartInstance.destroy();
    }

    const labels = appState.historyData.map((item, index) => `#${index+1} (${item.date})`);
    const romData = appState.historyData.map(item => item.romChange);
    const balData = appState.historyData.map(item => item.balChange);

    historyChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'ROM改善率 (%)',
                    data: romData,
                    borderColor: '#39ff14',
                    backgroundColor: 'rgba(57, 255, 20, 0.05)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'バランス改善率 (%)',
                    data: balData,
                    borderColor: '#00f0ff',
                    backgroundColor: 'rgba(0, 240, 255, 0.05)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#94a3b8', font: { family: 'Outfit' } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8', font: { family: 'Outfit' } }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#f8fafc', font: { family: 'Outfit', size: 10 } }
                }
            }
        }
    });
}

function renderHistoryList() {
    const listEl = document.getElementById('historyList');
    listEl.innerHTML = '';
    
    if (appState.historyData.length === 0) {
        listEl.innerHTML = `<p style="text-align:center; color:var(--text-muted); font-size:12px; margin-top:20px;">過去の計測履歴はまだありません。</p>`;
        return;
    }

    const sorted = [...appState.historyData].reverse();
    
    sorted.forEach(item => {
        let row = document.createElement('div');
        row.className = 'history-list-item';
        row.innerHTML = `
            <div class="history-item-meta">
                <span class="history-item-title">${item.sport}</span>
                <span class="history-item-date">${item.date}</span>
            </div>
            <div class="history-item-stats">
                <div class="history-stat-box">
                    <span class="history-stat-label">ROM</span>
                    <span class="history-stat-val highlight-green">+${item.romChange}%</span>
                </div>
                <div class="history-stat-box">
                    <span class="history-stat-label">バランス</span>
                    <span class="history-stat-val highlight-blue">+${item.balChange}%</span>
                </div>
            </div>
        `;
        listEl.appendChild(row);
    });
}

// 10. Helper Utilities
function showToast(message) {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toastMessage');
    msgEl.textContent = message;
    
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function saveStateToLocalStorage() {
    localStorage.setItem('bc_lab_portal_state', JSON.stringify({
        ringStock: appState.ringStock,
        historyData: appState.historyData
    }));
}

function loadStateFromLocalStorage() {
    const stored = localStorage.getItem('bc_lab_portal_state');
    if (stored) {
        try {
            const data = JSON.parse(stored);
            appState.ringStock = data.ringStock !== undefined ? data.ringStock : 24;
            appState.historyData = data.historyData || [];
        } catch (e) {
            console.error("Local storage load error:", e);
        }
    }
}

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
    loadStateFromLocalStorage();
    loadCustomCoordinates(); // Restores drag-and-dropped coordinates
    updateStockUI(0);
    switchView('home');
    initDragAndDrop(); // Attaches mouse/touch events to body SVG
});
