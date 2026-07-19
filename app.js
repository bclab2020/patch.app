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
    isAdmin: false, // Admin privileges flag
    historyData: [
        { id: 1, date: '2026-07-01', sport: '陸上 (スプリント)', preRom: 70, postRom: 85, romChange: 21.4, preBal: 12, postBal: 28, balChange: 133.3 },
        { id: 2, date: '2026-07-04', sport: '陸上 (スプリント)', preRom: 72, postRom: 88, romChange: 22.2, preBal: 15, postBal: 35, balChange: 133.3 }
    ],
    cameraStage: null // 'pre' or 'post'
};

// 2. Mapping Data Definitions (16 Sports)
// Enhanced description includes exact finger measurements ("指○本分") for self-finding anatomical locations.
const SPORTS_MAPPING = {
    "sprinting": {
        "name": "陸上（スプリント・跳躍）",
        "desc": "走動作の推進力・ピッチ・接地感覚を最大化するプロトコール",
        "points": [
            {
                "x": 72,
                "y": 304,
                "name": "前脛骨筋起始部 (右)",
                "desc": "お皿（膝蓋骨）の外側下縁から指4本分下、すねの骨の外側約1横指のくぼみ。接地時のブレーキを軽減し、足首の滑りを促進。",
                "view": "front"
            },
            {
                "x": 131,
                "y": 304,
                "name": "前脛骨筋起始部 (左)",
                "desc": "お皿（膝蓋骨）の外側下縁から指4本分下、すねの骨の外側約1横指のくぼみ。接地時のブレーキを軽減し、足首の滑りを促進。",
                "view": "front"
            },
            {
                "x": 92,
                "y": 132,
                "name": "胸腰椎移行部 T12-L1 (右)",
                "desc": "背骨（脊柱）の中心から左右に指2本分外側、一番下の肋骨（第12肋骨）の先端と同じ高さ。骨盤の前傾制御と体幹の動的安定。",
                "view": "back"
            },
            {
                "x": 114,
                "y": 133,
                "name": "胸腰椎移行部 T12-L1 (左)",
                "desc": "背骨（脊柱）の中心から左右に指2本分外側、一番下の肋骨（第12肋骨）の先端と同じ高さ。骨盤の前傾制御と体幹の動的安定。",
                "view": "back"
            },
            {
                "x": 84,
                "y": 192,
                "name": "大殿筋起始部 (右)",
                "desc": "骨盤の後ろの骨の出っ張り（上後腸骨棘）から斜め下外側に指3本分、お尻のふくらみの上縁。股関節伸展パワーを最大化。",
                "view": "back"
            },
            {
                "x": 122,
                "y": 194,
                "name": "大殿筋起始部 (左)",
                "desc": "骨盤の後ろの骨の出っ張り（上後腸骨棘）から斜め下外側に指3本分、お尻のふくらみの上縁. 股関節伸展パワーを最大化。",
                "view": "back"
            }
        ]
    },
    "soccer": {
        "name": "サッカー",
        "desc": "キック時の軸ブレ防止、急激な切り返し（アジリティ）を強化",
        "points": [
            {
                "x": 73,
                "y": 309,
                "name": "前脛骨筋起始部 (右)",
                "desc": "お皿（膝蓋骨）の外側下縁から指4本分下、すねの骨の外側約1横指のくぼみ。切り返し時の足首のブレ抑制と芝への引っかかり防止。",
                "view": "front"
            },
            {
                "x": 131,
                "y": 309,
                "name": "前脛骨筋起始部 (左)",
                "desc": "お皿（膝蓋骨）の外側下縁から指4本分下、すねの骨の外側約1横指のくぼみ。切り返し時の足首のブレ抑制と芝への引っかかり防止。",
                "view": "front"
            },
            {
                "x": 84,
                "y": 168,
                "name": "腰方形筋 (QL) 周囲 (右)",
                "desc": "一番下の肋骨と骨盤 of 骨の縁（腸骨稜）のちょうど中間、背骨から外側に指4本分の脇腹。骨盤の左右ブレを抑え軸を安定。",
                "view": "back"
            },
            {
                "x": 120,
                "y": 168,
                "name": "腰方形筋 (QL) 周囲 (左)",
                "desc": "一番下の肋骨と骨盤 of 骨の縁（腸骨稜）のちょうど中間、背骨から外側に指4本分の脇腹. 骨盤の左右ブレを抑え軸を安定。",
                "view": "back"
            },
            {
                "x": 81,
                "y": 199,
                "name": "大腿四頭筋起始部 (右)",
                "desc": "骨盤 of 前面の出っ張り（上前腸骨棘）から真下に指3本分、太も目の付け根中央。キック of テイクバック可動域を拡大。",
                "view": "front"
            },
            {
                "x": 122,
                "y": 200,
                "name": "大腿四頭筋起始部 (左)",
                "desc": "骨盤 of 前面の出っ張り（上前腸骨棘）から真下に指3本分、太も目の付け根中央. キック of テイクバック可動域を拡大。",
                "view": "front"
            }
        ]
    },
    "baseball": {
        "name": "野球",
        "desc": "投球時の肩甲骨・胸郭連動、バッティング時のスイング軸を安定",
        "points": [
            {
                "x": 82,
                "y": 80,
                "name": "鎖骨下周囲 (右)",
                "desc": "鎖骨 of 外側1/3（肩側の先端近く）のすぐ下にあるくぼみ（中央から指2〜3本分外側）。巻き肩をリセットし、胸郭の開きを拡大。",
                "view": "front"
            },
            {
                "x": 118,
                "y": 80,
                "name": "鎖骨下周囲 (左)",
                "desc": "鎖骨 of 外側1/3（肩側の先端近く）のすぐ下にあるくぼみ（中央から指2〜3本分外側）。巻き肩をリセットし、胸郭の開きを拡大。",
                "view": "front"
            },
            {
                "x": 88,
                "y": 84,
                "name": "棘上筋・棘下筋起始部 (右)",
                "desc": "肩甲骨 of 斜めに走る出っ張り骨の上側のくぼみ（棘上筋）と、そのすぐ下側の肩甲骨中央（棘下筋）。肩関節 of 衝突痛を防止し可動域拡大。",
                "view": "back"
            },
            {
                "x": 115,
                "y": 85,
                "name": "棘上筋・棘下筋起始部 (左)",
                "desc": "肩甲骨 of 斜めに走る出っ張り骨の上側のくぼみ（棘上筋）と、そのすぐ下側の肩甲骨中央（棘下筋）。肩関節 of 衝突痛を防止し可動域拡大。",
                "view": "back"
            },
            {
                "x": 89,
                "y": 178,
                "name": "多裂筋起始部 (右)",
                "desc": "腰 of 背骨（腰椎）の突起のすぐきわ（指半本分外側）、骨盤中央（仙骨）のすぐ上の高さ。投球・打撃のスイング回旋軸のブレを抑制。",
                "view": "back"
            },
            {
                "x": 113,
                "y": 178,
                "name": "多裂筋起始部 (左)",
                "desc": "腰 of 背骨（腰椎）の突起のすぐきわ（指半本分外側）、骨盤中央（仙骨）のすぐ上の高さ. 投球・打撃のスイング回旋軸のブレを抑制。",
                "view": "back"
            }
        ]
    },
    "golf": {
        "name": "ゴルフ",
        "desc": "アドレス時の重心安定、体幹（スイング軸）の安定を促す",
        "points": [
            {
                "x": 86,
                "y": 146,
                "name": "傍脊柱筋 T12周囲 (右)",
                "desc": "一番下の肋骨の高さ（第12胸椎）の背骨のきわから左右に指1.5本分外側。アドレスからフィニッシュまでの前傾角度のキープ。",
                "view": "back"
            },
            {
                "x": 116,
                "y": 146,
                "name": "傍脊柱筋 T12周囲 (左)",
                "desc": "一番下の肋骨の高さ（第12胸椎）の背骨のきわから左右に指1.5本分外側。アドレスからフィニッシュまでの前傾角度のキープ。",
                "view": "back"
            },
            {
                "x": 90,
                "y": 170,
                "name": "腸腰筋起始部 (右)",
                "desc": "おへそから左右外側に指3本分、そこからさらに下に指3本分下がったお腹の深部. 腰のスウェー（逃げ）を防止。",
                "view": "front"
            },
            {
                "x": 116,
                "y": 170,
                "name": "腸腰筋起始部 (左)",
                "desc": "おへそから左右外側に指3本分、そこからさらに下に指3本分下がったお腹の深部. 腰のスウェー（逃げ）を防止。",
                "view": "front"
            },
            {
                "x": 42,
                "y": 183,
                "name": "手関節背側 (右)",
                "desc": "手首 of 甲側のしわの中央から指1.5本分肘寄り、骨の間のくぼみ。インパクト時の手首のこね（アーリーリリース）を防止。",
                "view": "front"
            },
            {
                "x": 164,
                "y": 183,
                "name": "手関節背側 (左)",
                "desc": "手首 of 甲側のしわの中央から指1.5本分肘寄り、骨の間のくぼみ. インパクト時の手首のこね（アーリーリリース）を防止。",
                "view": "front"
            }
        ]
    },
    "tennis": {
        "name": "テニス",
        "desc": "リスト・肘の負担軽減とフットワークの敏捷性向上",
        "points": [
            {
                "x": 47,
                "y": 140,
                "name": "外側上顆周囲 (右)",
                "desc": "肘 of 外側の骨の出っ張り（外側上顆）から指1.5本分前腕（手首）寄りの筋肉 of ふくらみ。テニス肘の予防に効果的。",
                "view": "front"
            },
            {
                "x": 155,
                "y": 140,
                "name": "外側上顆周囲 (左)",
                "desc": "肘 of 外側の骨の出っ張り（外側上顆）から指1.5本分前腕（手首）寄りの筋肉 of ふくらみ。テニス肘の予防に効果的。",
                "view": "front"
            },
            {
                "x": 82,
                "y": 80,
                "name": "鎖骨下周囲 (右)",
                "desc": "鎖骨 of 外側1/3のすぐ下にあるくぼみ（中央から指2〜3本分外側）。胸郭の回旋を促し、手打ちを防いで体幹でストローク。",
                "view": "front"
            },
            {
                "x": 118,
                "y": 80,
                "name": "鎖骨下周囲 (左)",
                "desc": "鎖骨 of 外側1/3のすぐ下にあるくぼみ（中央から指2〜3本分外側）。胸郭の回旋を促し、手打ちを防いで体幹でストローク。",
                "view": "front"
            },
            {
                "x": 75,
                "y": 301,
                "name": "前脛骨筋起始部 (右)",
                "desc": "お皿（膝蓋骨）の外側下縁から指4本分下、すねの骨の外側約1横指のくぼみ。スプリットステップからの第一歩の敏捷性向上。",
                "view": "front"
            },
            {
                "x": 130,
                "y": 302,
                "name": "前脛骨筋起始部 (左)",
                "desc": "お皿（膝蓋骨）の外側下縁から指4本分下、すねの骨の外側約1横指のくぼみ。スプリットステップからの第一歩の敏捷性向上。",
                "view": "front"
            }
        ]
    },
    "basketball": {
        "name": "バスケットボール",
        "desc": "ジャンプ到達点アップ、着地時の関節保護とクイックネス強化",
        "points": [
            {
                "x": 78,
                "y": 290,
                "name": "膝蓋骨周囲 (右)",
                "desc": "お皿（膝蓋骨）の下縁中央から左右外側へ指1本分。ジャンパー膝を防ぎ、着地時の内反（ニーイン）を抑える。",
                "view": "front"
            },
            {
                "x": 124,
                "y": 290,
                "name": "膝蓋骨周囲 (左)",
                "desc": "お皿（膝蓋骨）の下縁中央から左右外側へ指1本分。ジャンパー膝を防ぎ、着地時の内反（ニーイン）を抑える。",
                "view": "front"
            },
            {
                "x": 86,
                "y": 184,
                "name": "大殿筋起始部 (右)",
                "desc": "骨盤の後ろの骨の出っ張り（上後腸骨棘）から斜め下外側に指3本分、お尻のふくらみの上縁。股関節伸伸伸パワーを最大化。",
                "view": "back"
            },
            {
                "x": 120,
                "y": 184,
                "name": "大殿筋起始部 (左)",
                "desc": "骨盤の後ろの骨の出っ張り（上後腸骨棘）から斜め下外側に指3本分、お尻のふくらみの上縁。股関節伸伸伸パワーを最大化。",
                "view": "back"
            },
            {
                "x": 77,
                "y": 307,
                "name": "前脛骨筋起始部 (右)",
                "desc": "お皿（膝蓋骨）の外側下縁から指4本分下、すねの骨の外側約1横指のくぼみ。低い姿勢でのディフェンス時の足首のホールド安定。",
                "view": "front"
            },
            {
                "x": 127,
                "y": 309,
                "name": "前脛骨筋起始部 (左)",
                "desc": "お皿（膝蓋骨）の外側下縁から指4本分下、すねの骨の外側約1横指のくぼみ。低い姿勢でのディフェンス時の足首のホールド安定。",
                "view": "front"
            }
        ]
    },
    "rugby": {
        "name": "ラグビー",
        "desc": "コンタクト衝撃に耐えるコア（腹圧）と首元の保護",
        "points": [
            {
                "x": 86,
                "y": 176,
                "name": "腹横筋起始部 (右)",
                "desc": "骨盤の前の骨 of 出っ張り（上前腸骨棘）から内側へ指2本分、斜め下へ指1本分入ったところ。インナーユニットを活性化し強い腹圧を構築。",
                "view": "front"
            },
            {
                "x": 118,
                "y": 176,
                "name": "腹横筋起始部 (左)",
                "desc": "骨盤の前の骨 of 出っ張り（上前腸骨棘）から内側へ指2本分、斜め下へ指1本分入ったところ。インナーユニットを活性化し強い腹圧を構築。",
                "view": "front"
            },
            {
                "x": 93,
                "y": 194,
                "name": "脊柱起立筋起始部 (右)",
                "desc": "仙骨（お尻の真ん中の平らな骨）のすぐ上で、背骨の左右外側へ指2本分。タックル・スクラム時に腰椎を支える耐久力向上。",
                "view": "back"
            },
            {
                "x": 109,
                "y": 194,
                "name": "脊柱起立筋起始部 (左)",
                "desc": "仙骨（お尻の真ん中の平らな骨）のすぐ上で、背骨の左右外側へ指2本分。タックル・スクラム時に腰椎を支える耐久力向上。",
                "view": "back"
            },
            {
                "x": 93,
                "y": 52,
                "name": "僧帽筋起始部 (右)",
                "desc": "耳の後ろの骨の出っ張り（乳様突起）の下端から後ろへ指2本分進んだ生え際のくぼみ。頭部・頚部のブレを最小限にし脳震盪リスク低減。",
                "view": "back"
            },
            {
                "x": 111,
                "y": 52,
                "name": "僧帽筋起始部 (左)",
                "desc": "耳の後ろの骨の出っ張り（乳様突起）の下端から後ろへ指2本分進んだ生え際のくぼみ。頭部・頚部のブレを最小限にし脳震盪リスク低減。",
                "view": "back"
            }
        ]
    },
    "swimming": {
        "name": "水泳",
        "desc": "ストリームライン（一直線姿勢）の維持とストローク効率の向上",
        "points": [
            {
                "x": 82,
                "y": 80,
                "name": "鎖骨下周囲 (右)",
                "desc": "鎖骨 of 外側1/3（肩側の先端近く）のすぐ下にあるくぼみ（中央から指2〜3本分外側）。腕のスムーズな回旋を促す。",
                "view": "front"
            },
            {
                "x": 118,
                "y": 80,
                "name": "鎖骨下周囲 (左)",
                "desc": "鎖骨 of 外側1/3（肩側の先端近く）のすぐ下にあるくぼみ（中央から指2〜3本分外側）。腕のスムーズな回旋を促す。",
                "view": "front"
            },
            {
                "x": 88,
                "y": 180,
                "name": "腹横筋起始部 (右)",
                "desc": "骨盤の前の骨の出っ張り（上前腸骨棘）から内側へ指2本分、斜め下へ指1本分入ったところ。水中での腰の反りを防ぎ一直線キックを維持。",
                "view": "front"
            },
            {
                "x": 116,
                "y": 180,
                "name": "腹横筋起始部 (左)",
                "desc": "骨盤の前の骨の出っ張り（上前腸骨棘）から内側へ指2本分、斜め下へ指1本分入ったところ. 水中での腰の反りを防ぎ一直線キックを維持。",
                "view": "front"
            },
            {
                "x": 85,
                "y": 85,
                "name": "棘上筋・棘下筋起始部 (右)",
                "desc": "肩甲骨 of 斜めに走る出っ張り骨の上側のくぼみ（棘上筋）と、そのすぐ下側の肩甲骨中央（棘下筋）。プル動作における肩甲骨の協調性向上。",
                "view": "back"
            },
            {
                "x": 115,
                "y": 85,
                "name": "棘上筋・棘下筋起始部 (左)",
                "desc": "肩甲骨 of 斜めに走る出っ張り骨の上側のくぼみ（棘上筋）と、そのすぐ下側の肩甲骨中央（棘下筋）。プル動作における肩甲骨の協調性向上。",
                "view": "back"
            }
        ]
    },
    "volleyball": {
        "name": "バレーボール",
        "desc": "スパイクスイングスピードの向上と着地によるジャンパー膝予防",
        "points": [
            {
                "x": 84,
                "y": 186,
                "name": "大殿筋起始部 (右)",
                "desc": "骨盤の後ろの骨の出っ張り（上後腸骨棘）から斜め下外側に指3本分、お尻のふくらみの上縁。助走から跳躍へ変換する股関節爆発力向上。",
                "view": "back"
            },
            {
                "x": 118,
                "y": 186,
                "name": "大殿筋起始部 (左)",
                "desc": "骨盤の後ろの骨の出っ張り（上後腸骨棘）から斜め下外側に指3本分、お尻のふくらみの上縁。助走から跳躍へ変換する股関節爆発力向上。",
                "view": "back"
            },
            {
                "x": 82,
                "y": 80,
                "name": "鎖骨下周囲 (右)",
                "desc": "鎖骨 of 外側1/3のすぐ下にあるくぼみ（指2〜3本分外側）。スパイクテイクバック時の胸郭のしなりと腕の引き込み。",
                "view": "front"
            },
            {
                "x": 118,
                "y": 80,
                "name": "鎖骨下周囲 (左)",
                "desc": "鎖骨 of 外側1/3のすぐ下にあるくぼみ（指2〜3本分外側）。スパイクテイクバック時の胸郭のしなりと腕の引き込み。",
                "view": "front"
            },
            {
                "x": 78,
                "y": 288,
                "name": "膝蓋骨周囲 (右)",
                "desc": "お皿（膝蓋骨）の下縁中央から左右外側へ指1本分。ジャンパー膝の予防。着地時の急激な膝蓋腱のテンション緩和。",
                "view": "front"
            },
            {
                "x": 126,
                "y": 290,
                "name": "膝蓋骨周囲 (左)",
                "desc": "お皿（膝蓋骨）の下縁中央から左右外側へ指1本分。ジャンパー膝の予防. 着地時の急激な膝蓋腱のテンション緩和。",
                "view": "front"
            }
        ]
    },
    "badminton": {
        "name": "バドミントン",
        "desc": "フットワークの急ストップ時の安定とリストターン of 障害予防",
        "points": [
            {
                "x": 75,
                "y": 307,
                "name": "前脛骨筋起始部 (右)",
                "desc": "お皿（膝蓋骨）の外側下縁から指4本分下、すねの骨の外側約1横指のくぼみ。シャトルを拾う最後の一歩の大きな踏み込みと切り返し。",
                "view": "front"
            },
            {
                "x": 129,
                "y": 309,
                "name": "前脛骨筋起始部 (左)",
                "desc": "お皿（膝蓋骨）の外側下縁から指4本分下、すねの骨の外側約1横指のくぼみ。シャトルを拾う最後の一歩の大きな踏み込みと切り返し。",
                "view": "front"
            },
            {
                "x": 82,
                "y": 80,
                "name": "鎖骨下周囲 (右)",
                "desc": "鎖骨 of 外側1/3のすぐ下にあるくぼみ（指2〜3本分外側）。背面のテンションを緩め、高い打点からのスマッシュ胸郭確保。",
                "view": "front"
            },
            {
                "x": 118,
                "y": 80,
                "name": "鎖骨下周囲 (左)",
                "desc": "鎖骨 of 外側1/3のすぐ下にあるくぼみ（指2〜3本分外側）。背面のテンションを緩め、高い打点からのスマッシュ胸郭確保。",
                "view": "front"
            },
            {
                "x": 49,
                "y": 138,
                "name": "外側上顆周囲 (右)",
                "desc": "肘 of 外側の骨の出っ張り（外側上顆）から指1.5本分前腕（手首）寄りの筋肉 of ふくらみ。高速フリックによるラケット肘の疲労対策。",
                "view": "front"
            },
            {
                "x": 153,
                "y": 140,
                "name": "外側上顆周囲 (左)",
                "desc": "肘 of 外側の骨の出っ張り（外側上顆）から指1.5本分前腕（手首）寄りの筋肉 of ふくらみ。高速フリックによるラケット肘の疲労対策。",
                "view": "front"
            }
        ]
    },
    "tabletennis": {
        "name": "卓球",
        "desc": "微小ステップ時の敏捷性と手首のミリ単位コントロール",
        "points": [
            {
                "x": 75,
                "y": 301,
                "name": "前脛骨筋起始部 (右)",
                "desc": "お皿（膝蓋骨）の外側下縁から指4本分下、すねの骨の外側約1横指のくぼみ。ラリー中の細かく激しい前後左右の重心移動をアシスト。",
                "view": "front"
            },
            {
                "x": 127,
                "y": 301,
                "name": "前脛骨筋起始部 (左)",
                "desc": "お皿（膝蓋骨）の外側下縁から指4本分下、すねの骨の外側約1横指のくぼみ. ラリー中の細かく激しい前後左右の重心移動をアシスト。",
                "view": "front"
            },
            {
                "x": 44,
                "y": 181,
                "name": "手関節背側 (右)",
                "desc": "手首 of 甲側のしわの中央から指1.5本分肘寄り、骨の間のくぼみ。手首の精緻なラケット面調整と、チキータ・ドライブ打球精度。",
                "view": "front"
            },
            {
                "x": 160,
                "y": 183,
                "name": "手関節背側 (左)",
                "desc": "手首 of 甲側のしわの中央から指1.5本分肘寄り、骨の間のくぼみ。手首の精緻なラケット面調整と、チキータ・ドライブ打球精度。",
                "view": "front"
            },
            {
                "x": 90,
                "y": 150,
                "name": "傍脊柱筋 胸腰移行部 (右)",
                "desc": "一番下の肋骨の高さ（第12胸椎）の背骨のきわから左右に指1.5本分外側。低く構える前傾姿勢の維持と腰部痛の緩和。",
                "view": "back"
            },
            {
                "x": 114,
                "y": 150,
                "name": "傍脊柱筋 胸腰移行部 (左)",
                "desc": "一番下の肋骨の高さ（第12胸椎）の背骨のきわから左右に指1.5本分外側. 低く構える前傾姿勢の維持と腰部痛の緩和。",
                "view": "back"
            }
        ]
    },
    "judo": {
        "name": "柔道",
        "desc": "グラウンディング（踏ん張り）の強化と引き込み握力の維持",
        "points": [
            {
                "x": 93,
                "y": 186,
                "name": "多裂筋・傍脊柱筋 (右)",
                "desc": "腰の背骨（腰椎）の突起のきわ（指半本分外側）、仙骨のすぐ上の高さ。相手の引きに耐え、軸を通すための背面コアの強化。",
                "view": "back"
            },
            {
                "x": 109,
                "y": 186,
                "name": "多裂筋・傍脊柱筋 (左)",
                "desc": "腰の背骨（腰椎）の突起のきわ（指半本分外側）、仙骨のすぐ上の高さ。相手の引きに耐え、軸を通すための背面コアの強化。",
                "view": "back"
            },
            {
                "x": 79,
                "y": 204,
                "name": "大腿動脈拍動部 (右)",
                "desc": "太モモの付け根（鼠径部）のシワの中央で、脈がドクドクと触れる部分。腰を落とす姿勢での下肢血流低下・疲労の緩和。",
                "view": "front"
            },
            {
                "x": 123,
                "y": 206,
                "name": "大腿動脈拍動部 (左)",
                "desc": "太モモの付け根（鼠径部）のシワの中央で、脈がドクドクと触れる部分. 腰を落とす姿勢での下肢血流低下・疲労の緩和。",
                "view": "front"
            },
            {
                "x": 52,
                "y": 170,
                "name": "前腕屈筋群 (右)",
                "desc": "肘の内側の骨の出っ張りから指3本分下、前腕の親指側寄りの筋肉 of フクラミ。道着を強力にホールドする掴み手の握力持久。",
                "view": "front"
            },
            {
                "x": 148,
                "y": 170,
                "name": "前腕屈筋群 (左)",
                "desc": "肘の内側の骨の出っ張りから指3本分下、前腕の親指側寄りの筋肉 of フクラミ。道着を強力にホールドする掴み手の握力持久。",
                "view": "front"
            }
        ]
    },
    "handball": {
        "name": "ハンドボール",
        "desc": "空中の接触衝撃に耐える空中バランスとシュート可動域",
        "points": [
            {
                "x": 86,
                "y": 182,
                "name": "腹横筋起始部 (右)",
                "desc": "骨盤の前の骨の出っ張り（上前腸骨棘）から内側へ指2本分、斜め下へ指1本分入ったところ。空中シュート時に相手と接触してもブレない軸の確保。",
                "view": "front"
            },
            {
                "x": 118,
                "y": 182,
                "name": "腹横筋起始部 (左)",
                "desc": "骨盤の前の骨の出っ張り（上前腸骨棘）から内側へ指2本分、斜め下へ指1本分入ったところ。空中シュート時に相手と接触してもブレない軸の確保。",
                "view": "front"
            },
            {
                "x": 82,
                "y": 80,
                "name": "鎖骨下周囲 (右)",
                "desc": "鎖骨 of 外側1/3のすぐ下にあるくぼみ（指2〜3本分外側）。キャッチ・シュートにおける肩甲胸郭関節の回旋リリース。",
                "view": "front"
            },
            {
                "x": 118,
                "y": 80,
                "name": "鎖骨下周囲 (左)",
                "desc": "鎖骨 of 外側1/3のすぐ下にあるくぼみ（指2〜3本分外側）。キャッチ・シュートにおける肩甲胸郭関節の回旋リリース。",
                "view": "front"
            },
            {
                "x": 77,
                "y": 301,
                "name": "前脛骨筋起始部 (右)",
                "desc": "お皿（膝蓋骨）の外側下縁から指4本分下、すねの骨の外側約1横指のくぼみ。激しいストップ＆ゴーに対応する足首コントロール。",
                "view": "front"
            },
            {
                "x": 129,
                "y": 303,
                "name": "前脛骨筋起始部 (左)",
                "desc": "お皿（膝蓋骨）の外側下縁から指4本分下、すねの骨の外側約1横指のくぼみ。激しいストップ＆ゴーに対応する足首コントロール。",
                "view": "front"
            }
        ]
    },
    "figureskating": {
        "name": "フィギュアスケート [後半プロトコル]",
        "desc": "ジャンプ着氷時の目線のブレ抑制、スピン時の軸の安定",
        "points": [
            {
                "x": 102,
                "y": 58,
                "name": "後頚部 (第2-3頚椎間)",
                "desc": "首の後ろの最も出っ張った骨（第7頚椎）から上に指2本分、背骨のすぐ外側のくぼみ。頭部・眼球の協調運動を司る後頭下筋群をリリースし、着氷時の平衡感覚を再起動。",
                "view": "back"
            },
            {
                "x": 89,
                "y": 188,
                "name": "多裂筋起始部 (右)",
                "desc": "腰 of 背骨（腰椎）の突起のすぐきわ（指半本分外側）、仙骨のすぐ上。スピンやスパイラル姿勢の維持に必要な深層体幹の極小のコントロール。",
                "view": "back"
            },
            {
                "x": 113,
                "y": 188,
                "name": "多裂筋起始部 (左)",
                "desc": "腰 of 背骨（腰椎）の突起のすぐきわ（指半本分外側）、仙骨のすぐ上。スピンやスパイラル姿勢の維持に必要な深層体幹の極小のコントロール。",
                "view": "back"
            },
            {
                "x": 80,
                "y": 196,
                "name": "大殿筋起始部 (右)",
                "desc": "骨盤の後ろの骨の出っ張り（上後腸骨棘）から斜め下外側に指3本分、お尻のふくらみの上縁。片足滑走（スケーティング）時の骨盤の水平アライメント維持。",
                "view": "back"
            },
            {
                "x": 120,
                "y": 196,
                "name": "大殿筋起始部 (左)",
                "desc": "骨盤の後ろの骨の出っ張り（上後腸骨棘）から斜め下外側に指3本分、お尻のふくらみの上縁。片足滑走（スケーティング）時の骨盤の水平アライメント維持。",
                "view": "back"
            }
        ]
    },
    "ballet": {
        "name": "バレエ [後半プロトコル]",
        "desc": "つま先立ち（ルルベ）時の軸ブレ軽減、ターンアウト可動域向上",
        "points": [
            {
                "x": 77,
                "y": 303,
                "name": "前脛骨筋起始部 (右)",
                "desc": "お皿（膝蓋骨）の外側下縁から指4本分下、すねの骨の外側約1横指のくぼみ。ポワント・ルルベ時の足関節・足根骨アライメントの安定。",
                "view": "front"
            },
            {
                "x": 127,
                "y": 305,
                "name": "前脛骨筋起始部 (左)",
                "desc": "お皿（膝蓋骨）の外側下縁から指4本分下、すねの骨の外側約1横指 of くぼみ。ポワント・ルルベ時の足関節・足根骨アライメントの安定。",
                "view": "front"
            },
            {
                "x": 90,
                "y": 170,
                "name": "腸腰筋起始部 (右)",
                "desc": "おへそから左右外側に指3本分、そこからさらに下に指3本分下がったお腹の深部。脚を高くキープする（アラベスクなど）際、腰椎代償反りを防ぐ。",
                "view": "front"
            },
            {
                "x": 114,
                "y": 170,
                "name": "腸腰筋起始部 (左)",
                "desc": "おへそから左右外側に指3本分、そこからさらに下に指3本分下がったお腹の深部. 脚を高くキープする（アラベスクなど）際、腰椎代償反りを防ぐ。",
                "view": "front"
            },
            {
                "x": 90,
                "y": 148,
                "name": "傍脊柱筋 (右)",
                "desc": "一番下の肋骨の高さ（第12胸椎）の背骨のきわから左右に指1.5本分外側。背中のしなやかな引き上げと、アンオー時の姿勢維持。",
                "view": "back"
            },
            {
                "x": 114,
                "y": 148,
                "name": "傍脊柱筋 (左)",
                "desc": "一番下の肋骨の高さ（第12胸椎）の背骨のきわから左右に指1.5本分外側。背中のしなやかな引き上げと、アンオー時の姿勢維持。",
                "view": "back"
            }
        ]
    },
    "dance": {
        "name": "ダンス [後半プロトコル]",
        "desc": "アイソレーション可動域 of 拡大とフットワーク of キレ向上",
        "points": [
            {
                "x": 82,
                "y": 80,
                "name": "鎖骨下周囲 (右)",
                "desc": "鎖骨 of 外側1/3のすぐ下にあるくぼみ（指2〜3本分外側）。胸・肩の独立した動き（アイソレーション）の可動制限解除。",
                "view": "front"
            },
            {
                "x": 118,
                "y": 80,
                "name": "鎖骨下周囲 (左)",
                "desc": "鎖骨 of 外側1/3のすぐ下にあるくぼみ（指2〜3本分外側）。胸・肩の独立した動き（アイソレーション）の可動制限解除。",
                "view": "front"
            },
            {
                "x": 92,
                "y": 138,
                "name": "胸腰椎移行部 T12-L1 (右)",
                "desc": "背骨（脊柱）の中心から左右に指2本分外側、一番下の肋骨（第12肋骨）の先端と同じ高さ。上下の運動連動性を高め、アップ・ダウンステップのバネを出す。",
                "view": "back"
            },
            {
                "x": 112,
                "y": 138,
                "name": "胸腰椎移行部 T12-L1 (左)",
                "desc": "背骨（脊柱）の中心から左右に指2本分外側、一番下の肋骨（第12肋骨）の先端と同じ高さ。上下の運動連動性を高め、アップ・ダウンステップのバネを出す。",
                "view": "back"
            },
            {
                "x": 84,
                "y": 184,
                "name": "上殿皮神経周囲 (右)",
                "desc": "腰骨の最上部（腸骨稜）の後ろの出っ張りから斜め下へ指2本分、お尻の上部。骨盤の逃げを防ぎ、フロアワーク時の接地安定感をサポート。",
                "view": "back"
            },
            {
                "x": 118,
                "y": 184,
                "name": "上殿皮神経周囲 (左)",
                "desc": "腰骨の最上部（腸骨稜）の後ろの出っ張りから斜め下へ指2本分、お尻の上部。骨盤の逃げを防ぎ、フロアワーク時の接地安定感をサポート。",
                "view": "back"
            }
        ]
    }
};

const SYMPTOMS_MAPPING = {
    "shoulder_stiff": {
        "name": "肩こり・首の張り",
        "desc": "デスクワークによる巻き肩・頚部交感神経緊張をリリース",
        "points": [
            {
                "x": 100,
                "y": 48,
                "name": "後頚部 (C2-C3棘突起間)",
                "desc": "首の後ろの最も出っ張った骨（第7頚椎）から上に指2本分、背骨のすぐ外側のくぼみ。頚部交感神経を抑制し筋緊張緩和。",
                "view": "back"
            },
            {
                "x": 90,
                "y": 110,
                "name": "肩甲間部 (Th3-Th4レベル) (右)",
                "desc": "背骨の中心と肩甲骨の内側縁のちょうど中間、上から指3本分下がった高さ。肩甲骨の位置アライメントを正常化。",
                "view": "back"
            },
            {
                "x": 110,
                "y": 110,
                "name": "肩甲間部 (Th3-Th4レベル) (左)",
                "desc": "背骨の中心と肩甲骨の内側縁 of ちょうど中間、上から指3本分下がった高さ。肩甲骨の位置アライメントを正常化。",
                "view": "back"
            },
            {
                "x": 85,
                "y": 52,
                "name": "僧帽筋起始部 (右)",
                "desc": "耳の後ろの骨の出っ張り（乳様突起）の下端から後ろへ指2本分進んだ生え際のくぼみ。肩の挙上トーンを引き下げる。",
                "view": "back"
            },
            {
                "x": 115,
                "y": 52,
                "name": "僧帽筋起始部 (左)",
                "desc": "耳の後ろの骨の出っ張り（乳様突起）の下端から後ろへ指2本分進んだ生え際のくぼみ。肩の挙上トーンを引き下げる。",
                "view": "back"
            }
        ]
    },
    "back_pain": {
        "name": "腰痛・腰の張り",
        "desc": "体幹深層筋を活性化し、腰背部にかかる不要な代償緊張をリセット",
        "points": [
            {
                "x": 91,
                "y": 138,
                "name": "胸腰椎移行部 (右)",
                "desc": "一番下の肋骨の高さ（第12胸椎）の背骨のきわから左右に指1.5本分外側. 多裂筋・胸最長筋を活性化し腰部のアライメント修正。",
                "view": "back"
            },
            {
                "x": 115,
                "y": 139,
                "name": "胸腰椎移行部 (left)",
                "desc": "一番下の肋骨の高さ（第12胸椎）の背骨のきわから左右に指1.5本分外側。多裂筋・胸最長筋を活性化し腰部のアライメント修正。",
                "view": "back"
            },
            {
                "x": 87,
                "y": 176,
                "name": "腰方形筋 (QL) 周囲 (右)",
                "desc": "一番下の肋骨（第12肋骨）と骨盤の骨の縁（腸骨稜）のちょうど中間、背骨から指4本分外側の脇腹。腰の側屈・回旋時の痛みを緩和。",
                "view": "back"
            },
            {
                "x": 119,
                "y": 177,
                "name": "腰方形筋 (QL) 周囲 (left)",
                "desc": "一番下の肋骨（第12肋骨）と骨盤の骨の縁（腸骨稜）のちょうど中間、背骨から指4本分外側の脇腹。腰の側屈・回旋時の痛みを緩和。",
                "view": "back"
            },
            {
                "x": 90,
                "y": 190,
                "name": "腸腰筋起始部 (右)",
                "desc": "おへそから左右外側に指3本分、そこからさらに下に指3本分下がったお腹 of 深部（ゆっくり息を吐きながら押す）。前屈姿勢を改善。",
                "view": "front"
            },
            {
                "x": 110,
                "y": 190,
                "name": "腸腰筋起始部 (左)",
                "desc": "おへそから左右外側に指3本分、そこからさらに下に指3本分下がったお腹 of 深部（ゆっくり息を吐きながら押す）。前屈姿勢を改善。",
                "view": "front"
            }
        ]
    },
    "sciatica": {
        "name": "坐骨神経痛様・脚のしびれ",
        "desc": "神経絞扼（こうやく）部位周囲へ感覚刺激を送り、滑動性と血行を促進",
        "points": [
            {
                "x": 87,
                "y": 187,
                "name": "上殿皮神経・梨状筋部 (右)",
                "desc": "腰骨の最上部（腸骨稜）の後ろの出っ張りから斜め下へ指2本分、お尻の上部。殿部から太ももにかけてのつっぱり感を軽減。",
                "view": "back"
            },
            {
                "x": 118,
                "y": 186,
                "name": "上殿皮神経・梨状筋部 (左)",
                "desc": "腰骨の最上部（腸骨稜）の後ろの出っ張りから斜め下へ指2本分、お尻の上部. 殿部から太ももにかけてのつっぱり感を軽減。",
                "view": "back"
            },
            {
                "x": 93,
                "y": 170,
                "name": "脊髄神経出口付近 (右)",
                "desc": "背骨（腰椎）の突起から左右に指1.5本分外側、腰の最もくびれる高さ。脊髄神経根の滑りを促し痛みをブロック。",
                "view": "back"
            },
            {
                "x": 107,
                "y": 170,
                "name": "脊髄神経出口付近 (左)",
                "desc": "背骨（腰椎）の突起から左右に指1.5本分外側、腰の最もくびれる高さ. 脊髄神経根の滑りを促し痛みをブロック。",
                "view": "back"
            },
            {
                "x": 74,
                "y": 310,
                "name": "総腓骨神経走向 (右)",
                "desc": "膝の裏の外側にある硬い腱のすぐ内側、または腓骨頭（外側のすねの骨の出っ張り）のすぐ後ろ下のくぼみ。足首のしびれ・ふらつきを改善。",
                "view": "back"
            },
            {
                "x": 126,
                "y": 310,
                "name": "総腓骨神経走向 (左)",
                "desc": "膝の裏の外側にある硬い腱のすぐ内側、または腓骨頭（外側のすねの骨の出っ張り）のすぐ後ろ下のくぼみ. 足首のしびれ・ふらつきを改善。",
                "view": "back"
            }
        ]
    }
};


// 4. View Control & Navigation
function switchView(viewId) {
    if (appState.editMode && viewId !== 'map') {
        exitEditModeSilently();
    }

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

function exitEditModeSilently() {
    appState.editMode = false;
    const btn = document.getElementById('editModeBtn');
    const dashboard = document.querySelector('.mapping-dashboard');
    if (btn) {
        btn.classList.remove('active');
        btn.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> 座標調整`;
    }
    if (dashboard) dashboard.classList.remove('edit-active');
    
    const dpad = document.getElementById('dpadContainer');
    if (dpad) dpad.style.display = 'none';
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
    appState.isZoomed = false; // Start zoomed out
    const data = SPORTS_MAPPING[sportKey];
    document.getElementById('mappingTitle').textContent = data.name;
    document.getElementById('mappingDescription').textContent = data.desc;
    
    const svg = document.getElementById('bodySvg');
    if (svg) svg.setAttribute('viewBox', '0 0 200 400');
    
    renderMappingInteractive(data.points);
    
    // Toggle Sport Troubleshooting Guide Panel (available for all sports)
    const sportCard = document.getElementById('sportTroubleCard');
    if (sportCard) {
        sportCard.style.display = 'block';
        document.getElementById('sportTroubleTitle').textContent = `🏆 ${data.name} お悩み別 解決マッピング`;
        populateSportComplaints(sportKey);
    }
}

function loadSymptomMapping(symptomKey) {
    appState.selectedSymptom = symptomKey;
    appState.activeDotIndex = 0;
    appState.isZoomed = false; // Start zoomed out
    const data = SYMPTOMS_MAPPING[symptomKey];
    document.getElementById('mappingTitle').textContent = data.name;
    document.getElementById('mappingDescription').textContent = data.desc;
    
    const svg = document.getElementById('bodySvg');
    if (svg) svg.setAttribute('viewBox', '0 0 200 400');
    
    renderMappingInteractive(data.points);
    
    // Hide Sport Troubleshooting Guide Panel when viewing symptoms
    const sportCard = document.getElementById('sportTroubleCard');
    if (sportCard) sportCard.style.display = 'none';
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
    document.querySelectorAll('.body-svg .map-dot, .body-svg .map-dot-touch').forEach(el => el.remove());
    
    points.forEach((pt, index) => {
        if ((pt.view || 'front') === activeView) {
            // Invisible larger touch target for easier tapping on smartphones (r=20)
            let touchCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            touchCircle.setAttribute("cx", pt.x);
            touchCircle.setAttribute("cy", pt.y);
            touchCircle.setAttribute("r", "20");
            touchCircle.setAttribute("class", `map-dot-touch dot-${index} ${index === appState.activeDotIndex ? 'active' : ''}`);
            touchCircle.setAttribute("fill", "transparent");
            touchCircle.setAttribute("style", "cursor: pointer; pointer-events: all;");
            svg.appendChild(touchCircle);

            // Visible inner dot (r=6)
            let visibleCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            visibleCircle.setAttribute("cx", pt.x);
            visibleCircle.setAttribute("cy", pt.y);
            visibleCircle.setAttribute("r", "6");
            visibleCircle.setAttribute("class", `map-dot dot-visible-${index} ${index === appState.activeDotIndex ? 'active' : ''}`);
            visibleCircle.setAttribute("style", "pointer-events: none;"); // Let touch events pass through to touchCircle
            svg.appendChild(visibleCircle);
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

    // 4. Zoom / Pan ViewBox Animation
    if (appState.isZoomed && activePt) {
        const zoomW = 90;
        const zoomH = 180;
        let minX = activePt.x - zoomW / 2;
        let minY = activePt.y - zoomH / 2;
        minX = Math.max(0, Math.min(200 - zoomW, minX));
        minY = Math.max(0, Math.min(400 - zoomH, minY));
        animateViewBox(minX, minY, zoomW, zoomH);
    } else {
        animateViewBox(0, 0, 200, 400);
    }
}

function selectPoint(index) {
    appState.activeDotIndex = index;
    appState.isZoomed = true;
    
    const tabName = appState.mappingTab;
    const points = tabName === 'sports' 
        ? SPORTS_MAPPING[appState.selectedSport].points 
        : SYMPTOMS_MAPPING[appState.selectedSymptom].points;

    renderMappingInteractive(points);
}

// 4.5 Smooth viewBox Animation & Zoom Reset Functions
let zoomAnimationId = null;

function animateViewBox(targetMinX, targetMinY, targetW, targetH, duration = 300) {
    const svg = document.getElementById('bodySvg');
    if (!svg) return;
    
    if (zoomAnimationId) {
        cancelAnimationFrame(zoomAnimationId);
    }
    
    const startStr = svg.getAttribute('viewBox') || '0 0 200 400';
    const start = startStr.split(' ').map(Number);
    
    const startTime = performance.now();
    
    function update(time) {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const ease = progress * (2 - progress);
        
        const curMinX = start[0] + (targetMinX - start[0]) * ease;
        const curMinY = start[1] + (targetMinY - start[1]) * ease;
        const curW = start[2] + (targetW - start[2]) * ease;
        const curH = start[3] + (targetH - start[3]) * ease;
        
        svg.setAttribute('viewBox', `${curMinX} ${curMinY} ${curW} ${curH}`);
        
        if (progress < 1) {
            zoomAnimationId = requestAnimationFrame(update);
        } else {
            zoomAnimationId = null;
        }
    }
    
    zoomAnimationId = requestAnimationFrame(update);
}

function resetZoom() {
    appState.isZoomed = false;
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
    if (target.classList.contains('map-dot-touch')) {
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
    
    // Read current viewBox dynamically to handle zoom accurately
    const viewBoxStr = svg.getAttribute('viewBox') || '0 0 200 400';
    const vb = viewBoxStr.split(' ').map(Number);
    const vbMinX = vb[0];
    const vbMinY = vb[1];
    const vbWidth = vb[2];
    const vbHeight = vb[3];
    
    const scaleX = vbWidth / rect.width;
    const scaleY = vbHeight / rect.height;
    
    let x = Math.round(vbMinX + (clientX - rect.left) * scaleX);
    let y = Math.round(vbMinY + (clientY - rect.top) * scaleY);
    
    // Clamp inside absolute viewBox limits (200 x 400)
    x = Math.max(0, Math.min(200, x));
    y = Math.max(0, Math.min(400, y));
    
    const tabName = appState.mappingTab;
    const points = tabName === 'sports' 
        ? SPORTS_MAPPING[appState.selectedSport].points 
        : SYMPTOMS_MAPPING[appState.selectedSymptom].points;
        
    if (points[draggedDotIndex]) {
        points[draggedDotIndex].x = x;
        points[draggedDotIndex].y = y;
        
        // Update both SVG circles dynamically
        const circles = svg.querySelectorAll(`.dot-${draggedDotIndex}, .dot-visible-${draggedDotIndex}`);
        circles.forEach(c => {
            c.setAttribute('cx', x);
            c.setAttribute('cy', y);
        });
        
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
        showToast("座標の調整を終了しました。");
        openExportModal(); // Auto-open bulk code export modal
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
        
        // Update both SVG circles dynamically
        const circles = document.querySelectorAll(`#bodySvg .dot-${appState.activeDotIndex}, #bodySvg .dot-visible-${appState.activeDotIndex}`);
        circles.forEach(c => {
            c.setAttribute('cx', pt.x);
            c.setAttribute('cy', pt.y);
        });
        
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
            closeExportModal(); // Auto-close modal
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
                    SPORTS_MAPPING[key] = parsed.sports[key];
                }
            }
            if (parsed.symptoms) {
                for (let key in parsed.symptoms) {
                    SYMPTOMS_MAPPING[key] = parsed.symptoms[key];
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
    const preFlex = parseFloat(document.getElementById('preFlexion').value) || 5;
    const preExt = parseFloat(document.getElementById('preExtension').value) || 5;
    const preRot = parseFloat(document.getElementById('preRotation').value) || 5;
    const preLat = parseFloat(document.getElementById('preLateral').value) || 5;

    const postFlex = parseFloat(document.getElementById('postFlexion').value) || 5;
    const postExt = parseFloat(document.getElementById('postExtension').value) || 5;
    const postRot = parseFloat(document.getElementById('postRotation').value) || 5;
    const postLat = parseFloat(document.getElementById('postLateral').value) || 5;

    // Calculate averages
    const preAvg = (preFlex + preExt + preRot + preLat) / 4;
    const postAvg = (postFlex + postExt + postRot + postLat) / 4;

    // Calculate percentage improvements
    const romChange = (((postAvg - preAvg) / preAvg) * 100).toFixed(1);
    const balChange = (((postFlex - preFlex) / preFlex) * 100).toFixed(1); // Flexion specific change

    document.getElementById('resPreRom').textContent = `${preAvg.toFixed(1)} / 10`;
    document.getElementById('resPostRom').textContent = `${postAvg.toFixed(1)} / 10`;
    document.getElementById('resRomChange').textContent = `${romChange > 0 ? '+' : ''}${romChange}%`;
    
    document.getElementById('resPreBal').textContent = `${preFlex} / 10`;
    document.getElementById('resPostBal').textContent = `${postFlex} / 10`;
    document.getElementById('resBalChange').textContent = `${balChange > 0 ? '+' : ''}${balChange}%`;

    const usedRings = 6;
    deductRings(usedRings);

    const today = new Date().toISOString().split('T')[0];
    const sportName = SPORTS_MAPPING[appState.selectedSport].name;
    const newRecord = {
        id: Date.now(),
        date: today,
        sport: sportName,
        preRom: preAvg,
        postRom: postAvg,
        romChange: parseFloat(romChange),
        preBal: preFlex,
        postBal: postFlex,
        balChange: parseFloat(balChange)
    };
    appState.historyData.push(newRecord);
    saveStateToLocalStorage();

    nextWizardStep(3);
    showToast("神経促通の測定結果が保存されました！");
}

function resetWizard() {
    // Reset ranges to 5
    document.getElementById('preFlexion').value = 5;
    document.getElementById('preExtension').value = 5;
    document.getElementById('preRotation').value = 5;
    document.getElementById('preLateral').value = 5;
    document.getElementById('postFlexion').value = 5;
    document.getElementById('postExtension').value = 5;
    document.getElementById('postRotation').value = 5;
    document.getElementById('postLateral').value = 5;

    // Reset textual indicators
    document.getElementById('preFlexionText').innerText = 5;
    document.getElementById('preExtensionText').innerText = 5;
    document.getElementById('preRotationText').innerText = 5;
    document.getElementById('preLateralText').innerText = 5;
    document.getElementById('postFlexionText').innerText = 5;
    document.getElementById('postExtensionText').innerText = 5;
    document.getElementById('postRotationText').innerText = 5;
    document.getElementById('postLateralText').innerText = 5;

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
                    label: '総合改善率 (%)',
                    data: romData,
                    borderColor: '#39ff14',
                    backgroundColor: 'rgba(57, 255, 20, 0.05)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                },
                {
                    label: '前屈改善率 (%)',
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
                    <span class="history-stat-label">総合改善</span>
                    <span class="history-stat-val highlight-green">${item.romChange > 0 ? '+' : ''}${item.romChange}%</span>
                </div>
                <div class="history-stat-box">
                    <span class="history-stat-label">前屈改善</span>
                    <span class="history-stat-val highlight-blue">${item.balChange > 0 ? '+' : ''}${item.balChange}%</span>
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

// 11. Admin Database Management Functions
function openAdminModal() {
    const modal = document.getElementById('adminModal');
    if (!modal) return;
    
    const tabName = appState.mappingTab;
    const key = tabName === 'sports' ? appState.selectedSport : appState.selectedSymptom;
    const mapping = tabName === 'sports' ? SPORTS_MAPPING : SYMPTOMS_MAPPING;
    const data = mapping[key];
    
    if (data) {
        document.getElementById('adminCategoryName').value = data.name;
        document.getElementById('adminCategoryDesc').value = data.desc;
        renderAdminPointsList();
        
        document.getElementById('adminEditPanel').style.display = 'block';
        document.getElementById('adminCreatePanel').style.display = 'none';
        
        modal.style.display = 'flex';
    }
}

function closeAdminModal() {
    const modal = document.getElementById('adminModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function renderAdminPointsList() {
    const list = document.getElementById('adminPointsList');
    if (!list) return;
    list.innerHTML = '';
    
    const tabName = appState.mappingTab;
    const key = tabName === 'sports' ? appState.selectedSport : appState.selectedSymptom;
    const mapping = tabName === 'sports' ? SPORTS_MAPPING : SYMPTOMS_MAPPING;
    const data = mapping[key];
    
    if (!data || !data.points) return;
    
    data.points.forEach((pt, index) => {
        let item = document.createElement('div');
        item.style.background = 'rgba(255,255,255,0.02)';
        item.style.border = '1px solid rgba(255,255,255,0.05)';
        item.style.borderRadius = '8px';
        item.style.padding = '10px';
        item.style.display = 'flex';
        item.style.flexDirection = 'column';
        item.style.gap = '8px';
        
        item.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 11px; font-weight: 700; color: var(--secondary);">ポイント ${index + 1}</span>
                <button class="btn btn-outline btn-xs" onclick="deleteAdminPoint(${index})" style="color: var(--accent); border-color: rgba(255,0,127,0.2); padding: 2px 6px;">
                    <i class="fa-solid fa-trash-can"></i> 削除
                </button>
            </div>
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 8px;">
                <input type="text" value="${pt.name}" onchange="updatePointField(${index}, 'name', this.value)" class="admin-input" style="padding: 4px 8px; font-size: 11px;" placeholder="ポイント名">
                <select onchange="updatePointField(${index}, 'view', this.value)" class="custom-select" style="padding: 4px 8px; font-size: 11px; height: 28px; line-height: 1;">
                    <option value="front" ${pt.view === 'front' ? 'selected' : ''}>前面</option>
                    <option value="back" ${pt.view === 'back' ? 'selected' : ''}>背面</option>
                </select>
            </div>
            <textarea onchange="updatePointField(${index}, 'desc', this.value)" class="admin-input" rows="1" style="padding: 4px 8px; font-size: 11px;" placeholder="貼り付け位置の説明（例: 膝蓋骨の外側下縁から指4本分下）">${pt.desc}</textarea>
            <div style="display: flex; gap: 8px; align-items: center;">
                <span style="font-size: 10px; color: var(--text-muted);">座標(X, Y):</span>
                <input type="number" value="${pt.x}" onchange="updatePointField(${index}, 'x', parseInt(this.value))" class="admin-input" style="width: 50px; padding: 2px 6px; font-size: 11px; text-align: center;">
                <input type="number" value="${pt.y}" onchange="updatePointField(${index}, 'y', parseInt(this.value))" class="admin-input" style="width: 50px; padding: 2px 6px; font-size: 11px; text-align: center;">
                <span style="font-size: 9px; color: var(--text-muted);">※マップ上でドラッグ調整も可能です</span>
            </div>
        `;
        list.appendChild(item);
    });
}

function updatePointField(index, field, value) {
    const tabName = appState.mappingTab;
    const key = tabName === 'sports' ? appState.selectedSport : appState.selectedSymptom;
    const mapping = tabName === 'sports' ? SPORTS_MAPPING : SYMPTOMS_MAPPING;
    const data = mapping[key];
    
    if (data && data.points && data.points[index]) {
        data.points[index][field] = value;
    }
}

function addAdminPoint() {
    const tabName = appState.mappingTab;
    const key = tabName === 'sports' ? appState.selectedSport : appState.selectedSymptom;
    const mapping = tabName === 'sports' ? SPORTS_MAPPING : SYMPTOMS_MAPPING;
    const data = mapping[key];
    
    if (data && data.points) {
        if (data.points.length >= 8) {
            showToast("パッチの最大貼付数は8点までです。");
            return;
        }
        
        data.points.push({
            x: 100,
            y: 200,
            name: "新規ポイント",
            desc: "貼り付け位置の説明を入力してください（例: お皿の外側から指○本分下）",
            view: "front"
        });
        
        renderAdminPointsList();
    }
}

function deleteAdminPoint(index) {
    const tabName = appState.mappingTab;
    const key = tabName === 'sports' ? appState.selectedSport : appState.selectedSymptom;
    const mapping = tabName === 'sports' ? SPORTS_MAPPING : SYMPTOMS_MAPPING;
    const data = mapping[key];
    
    if (data && data.points) {
        data.points.splice(index, 1);
        renderAdminPointsList();
    }
}

function saveAdminData() {
    const tabName = appState.mappingTab;
    const key = tabName === 'sports' ? appState.selectedSport : appState.selectedSymptom;
    const mapping = tabName === 'sports' ? SPORTS_MAPPING : SYMPTOMS_MAPPING;
    const data = mapping[key];
    
    const nameInput = document.getElementById('adminCategoryName');
    const descInput = document.getElementById('adminCategoryDesc');
    
    if (data) {
        if (nameInput.value.trim() === '') {
            showToast("カテゴリー名を入力してください。");
            return;
        }
        data.name = nameInput.value;
        data.desc = descInput.value;
        
        saveCustomCoordinates();
        closeAdminModal();
        showToast("変更を保存しました。");
        
        renderMappingSelectorOptions();
        if (tabName === 'sports') {
            loadSportMapping(appState.selectedSport);
        } else {
            loadSymptomMapping(appState.selectedSymptom);
        }
    }
}

function deleteActiveCategoryBtnClick() {
    const tabName = appState.mappingTab;
    const key = tabName === 'sports' ? appState.selectedSport : appState.selectedSymptom;
    const mapping = tabName === 'sports' ? SPORTS_MAPPING : SYMPTOMS_MAPPING;
    const data = mapping[key];
    
    if (!data) return;
    
    if (confirm(`本当にカテゴリー「${data.name}」を完全に削除しますか？`)) {
        delete mapping[key];
        saveCustomCoordinates();
        
        const newKeys = Object.keys(mapping);
        if (newKeys.length > 0) {
            if (tabName === 'sports') {
                appState.selectedSport = newKeys[0];
            } else {
                appState.selectedSymptom = newKeys[0];
            }
        }
        
        closeAdminModal();
        showToast("カテゴリーを削除しました。");
        
        renderMappingSelectorOptions();
        if (tabName === 'sports') {
            loadSportMapping(appState.selectedSport);
        } else {
            loadSymptomMapping(appState.selectedSymptom);
        }
    }
}

function addNewCategoryBtnClick() {
    document.getElementById('adminEditPanel').style.display = 'none';
    document.getElementById('adminCreatePanel').style.display = 'block';
}

function cancelCreateCategory() {
    document.getElementById('adminCreatePanel').style.display = 'none';
    document.getElementById('adminEditPanel').style.display = 'block';
}

function saveNewCategory() {
    const type = document.getElementById('newCatType').value;
    const id = document.getElementById('newCatId').value.trim().toLowerCase();
    const name = document.getElementById('newCatName').value.trim();
    const desc = document.getElementById('newCatDesc').value.trim();
    
    if (id === '' || name === '') {
        showToast("IDと表示名を入力してください。");
        return;
    }
    
    if (!/^[a-z0-9_-]+$/.test(id)) {
        showToast("IDは半角英数字、アンダースコア、ハイフンのみ使用できます。");
        return;
    }
    
    const mapping = type === 'sports' ? SPORTS_MAPPING : SYMPTOMS_MAPPING;
    if (mapping[id]) {
        showToast("このIDは既に存在します。別のIDを指定してください。");
        return;
    }
    
    mapping[id] = {
        name: name,
        desc: desc,
        points: [
            {
                x: 100,
                y: 200,
                name: "第1ポイント",
                desc: "位置の説明を入力してください",
                view: "front"
            }
        ]
    };
    
    saveCustomCoordinates();
    
    appState.mappingTab = type;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.mapping-tab-content').forEach(cont => cont.classList.remove('active'));
    
    if (type === 'sports') {
        appState.selectedSport = id;
        document.querySelector('.tab-btn[onclick*="sports"]').classList.add('active');
        document.getElementById('mapping-sports-container').classList.add('active');
    } else {
        appState.selectedSymptom = id;
        document.querySelector('.tab-btn[onclick*="symptoms"]').classList.add('active');
        document.getElementById('mapping-symptoms-container').classList.add('active');
    }
    
    cancelCreateCategory();
    closeAdminModal();
    showToast("新規カテゴリーを作成しました！");
    
    renderMappingSelectorOptions();
    if (type === 'sports') {
        loadSportMapping(id);
    } else {
        loadSymptomMapping(id);
    }
}

function openProductDetailsModal() {
    const modal = document.getElementById('productDetailsModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeProductDetailsModal() {
    const modal = document.getElementById('productDetailsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Admin Privilege Control Functions
function updateAdminButtonsVisibility() {
    const adminBtn = document.getElementById('adminBtn');
    const exportCodeBtn = document.getElementById('exportCodeBtn');
    const editModeBtn = document.getElementById('editModeBtn');
    const lockBtn = document.getElementById('adminLockBtn');
    const lockIcon = document.getElementById('adminLockIcon');
    
    const showAdmin = appState.isAdmin;
    
    if (adminBtn) adminBtn.style.display = showAdmin ? 'inline-flex' : 'none';
    if (exportCodeBtn) exportCodeBtn.style.display = showAdmin ? 'inline-flex' : 'none';
    if (editModeBtn) editModeBtn.style.display = showAdmin ? 'inline-flex' : 'none';
    
    if (lockIcon) {
        if (showAdmin) {
            lockIcon.className = 'fa-solid fa-lock-open';
            if (lockBtn) lockBtn.classList.add('unlocked');
        } else {
            lockIcon.className = 'fa-solid fa-lock';
            if (lockBtn) lockBtn.classList.remove('unlocked');
        }
    }
}

function handleAdminLockClick() {
    if (appState.isAdmin) {
        appState.isAdmin = false;
        sessionStorage.removeItem('bclab_is_admin');
        updateAdminButtonsVisibility();
        
        // Exit edit mode if active
        if (appState.editMode) {
            toggleEditMode();
        }
        
        showToast("管理者モードからログアウトしました。");
    } else {
        const pwd = prompt("管理者パスワードを入力してください:");
        if (pwd === 'bclab2009') {
            appState.isAdmin = true;
            sessionStorage.setItem('bclab_is_admin', 'true');
            updateAdminButtonsVisibility();
            showToast("管理者モードでログインしました。");
        } else if (pwd !== null) {
            showToast("パスワードが正しくありません。");
        }
    }
}

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
    loadStateFromLocalStorage();
    loadCustomCoordinates(); // Restores drag-and-dropped coordinates
    updateStockUI(0);
    
    // Restore admin session if active
    if (sessionStorage.getItem('bclab_is_admin') === 'true') {
        appState.isAdmin = true;
    }
    updateAdminButtonsVisibility();
    
    switchView('home');
    initDragAndDrop(); // Attaches mouse/touch events to body SVG
    
    // PWA & Notification setup
    initPWA();
    initNotificationUI();
    checkPortalUpdates();
});

// PWA Service Worker Registration
function initPWA() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('ServiceWorker registered with scope:', reg.scope))
                .catch(err => console.error('ServiceWorker registration failed:', err));
        });
    }
}

// Notification UI handling
function initNotificationUI() {
    const btn = document.getElementById('notificationToggleBtn');
    if (!btn) return;
    
    if (!("Notification" in window)) {
        btn.textContent = "非対応";
        btn.disabled = true;
        btn.style.opacity = "0.5";
        return;
    }
    
    if (Notification.permission === "granted") {
        btn.textContent = "通知オン";
        btn.style.background = "rgba(0, 240, 255, 0.2)";
        btn.style.borderColor = "var(--secondary)";
        btn.disabled = true;
    } else if (Notification.permission === "denied") {
        btn.textContent = "通知ブロック中";
        btn.style.background = "rgba(255, 0, 80, 0.1)";
        btn.style.borderColor = "#ff0050";
        btn.style.color = "#ff0050";
        btn.disabled = true;
    }
}

async function toggleNotificationPermission() {
    if (!("Notification" in window)) return;
    
    const permission = await Notification.requestPermission();
    initNotificationUI();
    
    if (permission === "granted") {
        showToast("通知がオンになりました！");
        // Send a test notification
        new Notification("B.C Lab ポータル", {
            body: "CORE CONNECTの最新情報やアップデート通知が届くようになりました。",
            icon: "icon.svg"
        });
        checkPortalUpdates();
    } else {
        showToast("通知設定がキャンセルされました。");
    }
}

// Background / Fetch checking for CORE CONNECT updates via GitHub API
async function checkPortalUpdates() {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    
    try {
        const apiUrl = "https://api.github.com/repos/bclab2020/portal-mockup/commits";
        const response = await fetch(apiUrl);
        if (!response.ok) return;
        const data = await response.json();
        
        if (data && data.length > 0) {
            const latestCommit = data[0];
            const latestSha = latestCommit.sha;
            const savedSha = localStorage.getItem('last_notified_portal_sha');
            const commitMessage = (latestCommit.commit && latestCommit.commit.message) ? latestCommit.commit.message : 'コンテンツが更新されました。';
            
            if (savedSha && savedSha !== latestSha) {
                // Trigger local notification
                const notification = new Notification("【CORE CONNECT 更新】", {
                    body: commitMessage,
                    icon: "icon.svg",
                    tag: "portal-update"
                });
                notification.onclick = () => {
                    window.focus();
                    window.open('https://bclab2020.github.io/portal-mockup/', '_self');
                    notification.close();
                };
            }
            
            // Save latest SHA in localStorage
            localStorage.setItem('last_notified_portal_sha', latestSha);
        }
    } catch (e) {
        console.error("CORE CONNECT更新チェックエラー:", e);
    }
}

// All-Sports Troubleshooting Mapping Database (Simplified for UI)
const SPORTS_COMPLAINTS = {
    "tennis": [
        {
            id: "tennis_1",
            title: "悩み①：フォアが差し込まれ、打点が後ろになって球威が出ない",
            cause: "デスクワーク等の巻き肩で大胸筋のセンサーが麻痺し、脳からのテイクバック指令が遅れるため打点が後ろになります。",
            points: "鎖骨下周囲 (左右)",
            effect: "鎖骨下神経を刺激し小脳の予測誤差をリセット。胸郭と肩甲骨の防衛的な脳ブレーキを外します。",
            future: "テイクバックが高速化し、常に前方の芯で捉えられます。軽い振りで球威が最大化します。"
        },
        {
            id: "tennis_2",
            title: "悩み②：バックハンドで当たり負けし、面がブレてミスになる",
            cause: "打撃衝撃で前腕の受容器が麻痺し、インパクト時の極小の面ブレ補正反射（共収縮）が遅れます。",
            points: "外側上顆周囲 (左右) ＋ 手関節背側 (左右)",
            effect: "橈骨神経や手首腱膜の感覚フィードバックをミリ秒単位で高速化し、手首と前腕を瞬間補正します。",
            future: "相手の強打に対してもラケット面が壁のように安定し、正確無比なコントロールが手に入ります。"
        },
        {
            id: "tennis_3",
            title: "悩み③：力んで手打ちになり、ボールが伸びない",
            cause: "脳の過剰な保護反応により全身が力み（同時緊張）、下半身から腕への運動連鎖が寸断されます。",
            points: "鎖骨下周囲 (左右) ＋ 胸腰椎移行部 (左右)",
            effect: "体幹の安定と肩甲帯の感覚統合により力みを消去。相反性神経支配（主動筋と拮抗筋の連動）を正常化します。",
            future: "下半身のパワーがロスなく伝達。脱力スイングで生きた伸びるボールが打てるようになります。"
        },
        {
            id: "tennis_4",
            title: "悩み④：トスとの距離感がズレ、打点が毎回バラバラになる",
            cause: "疲労で肩甲骨の固有受容感覚が狂い、空中のラケットとボールの距離を脳が正確に認知できません。",
            points: "棘上筋・棘下筋起始部 (左右) ［肩甲骨の中央と上部］",
            effect: "肩甲上神経経由で肩の位置情報を小脳に高速伝達。視覚と腕の連動（目と手の協調）エラーを解消します。",
            future: "常に最も力が伝わる打点（スイートスポット）で打てるようになり、サーブの再現性が激変します。"
        },
        {
            id: "tennis_5",
            title: "悩み⑤：肩が詰まりサーブのスピードが出ない",
            cause: "ローテーターカフや僧帽筋の硬化によるインピンジメント（衝突）を防ぐため、脳が可動制限をかけます。",
            points: "僧帽筋起始部 (左右) ＋ 鎖骨下周囲 (左右)",
            effect: "副神経および鎖骨下神経への入力により、脳が腕を上げる際の防衛ロックを解除し、可動域を広げます。",
            future: "肩が引っかかりなく滑らかに回り、高い打点からしなる強烈な高速サーブが打てるようになります。"
        },
        {
            id: "tennis_6",
            title: "悩み⑥：一歩目の出だしが遅れる",
            cause: "足関節や脛の感覚器が鈍り、脳が地面を蹴る運動準備指令（背屈・底屈反射）を遅延させます。",
            points: "前脛骨筋起始部 (左右) ［お皿の外側下］",
            effect: "深腓骨神経へ高密度入力し、足首の背屈・底屈の脊髄反射回路を高速化。敏捷性スイッチをオンにします。",
            future: "打球音と同時に体が爆発的に反応。一歩目が速くなり、守備範囲が劇的に広がります。"
        },
        {
            id: "tennis_7",
            title: "悩み⑦：切り返し時に体が流れて踏ん張れない",
            cause: "急減速時の横ブレに股関節（殿筋）の連動が遅れ、骨盤がスライドして重心が崩れます。",
            points: "前脛骨筋起始部 (左右) ＋ 大殿筋起始部 (左右)",
            effect: "殿筋と足首の感覚連動を高め、着地時の床反力を体幹へ即時共有。骨盤のアライメントを自動補正します。",
            future: "走らされたストップでも軸がブレずに強打でき、打球後一瞬でセンターに戻れるようになります。"
        },
        {
            id: "tennis_8",
            title: "悩み⑧：練習後に腰が張り、慢性的な腰痛がある",
            cause: "捻転運動による多裂筋・腰方形筋の緊張から、脳が腰を固める防衛収縮ループが固定化しています。",
            points: "胸腰椎移行部 T12-L1 (左右)",
            effect: "脊髄後枝への入力で交感神経の異常緊張を緩和。毛細血管を拡張させて血流を改善し疲労を蓄積させません。",
            future: "翌朝腰の重さなくスッキリ起きられます。腰を庇う悪いスイングのクセが根絶されます。"
        },
        {
            id: "tennis_9",
            title: "悩み⑨：打っていると肘の外側や手首がピキッと痛む（テニス肘）",
            cause: "グリップの握りすぎや差し込まれにより、肘の外側の短橈側手根伸筋腱に牽引ストレスが集中します。",
            points: "外側上顆周囲 (左右)",
            effect: "筋肉のセンサー疲労をリセットし前腕の緊張を最適化。打球衝撃をしなやかに逃がす機能を取り戻します。",
            future: "サポーターや薬に頼らず、全力スイングを痛みの恐怖ゼロで楽しめる未来が手に入ります。"
        },
        {
            id: "tennis_10",
            title: "悩み⑩：踏み込みやダッシュ時に膝が痛む",
            cause: "着地時に股関節が十分に機能せず、大腿四頭筋（前もも）だけで減速ショックを受け止めるためです。",
            points: "膝蓋骨周囲 (左右) ＋ 大腿四頭筋起始部 (左右) ［太ももの付け根中央］",
            effect: "太ももの位置感覚を高め、着地時のニーイン（膝の内ブレ）を自動修正。臀部へ衝撃を分散させます。",
            future: "膝のグラつきや痛みが消え、低い姿勢でも強く踏ん張れます。関節の寿命を大幅に伸ばします。"
        }
    ],
    "sprinting": [
        {
            id: "sprint_1",
            title: "悩み①：スタート時の爆発的な蹴り出し（出だし）が遅い",
            cause: "足裏やすねの感覚器が鈍り、地面を踏んだ反発力を脳が瞬時に大出力の瞬発力へ変換できていません。",
            points: "前脛骨筋起始部 (左右)",
            effect: "深腓骨神経を刺激し、足関節の底屈・背屈の脊髄反射を高速化。プレテンション（準備状態）を整えます。",
            future: "スタート音と同時に爆発的に飛び出せ、最初の一歩目の初速が劇的にアップします。"
        },
        {
            id: "sprint_2",
            title: "悩み②：中盤以降のピッチ（脚の回転）が上がらない",
            cause: "股関節周囲の感覚フィードバックが低下し、大殿筋と腸腰筋の切り替えタイミングにズレが生じています。",
            points: "大殿筋起始部 (左右) ＋ 胸腰椎移行部 (左右)",
            effect: "大殿筋と体幹コアの感覚入力を統合し、相反性支配を整え、無駄な拮抗筋の力みを自動消去します。",
            future: "力みのないスムーズな脚の回転が可能になり、後半のトップスピード維持が極めて楽になります。"
        },
        {
            id: "sprint_3",
            title: "悩み③：接地時に上体や足首がブレ、前への推進力が逃げる",
            cause: "走動作による微細な疲労で多裂筋や前脛骨筋のセンサーが狂い、動的アライメントが崩れています。",
            points: "胸腰椎移行部 T12-L1 (左右) ＋ 前脛骨筋起始部 (左右)",
            effect: "脊髄後枝と深腓骨神経の入力を統合し、着地ショックを吸収して骨盤の前傾姿勢を自動キープします。",
            future: "接地時のグラつきが皆無になり、すべてのキック力がロスなく前方への推進力に変換されます。"
        },
        {
            id: "sprint_4",
            title: "悩み④：ストライド（一歩の歩幅）が伸びない",
            cause: "股関節前部（腸腰筋）や臀部の可動域に脳が防衛ブレーキをかけ、脚の後方スイング幅を制限しています。",
            points: "大腿四頭筋起始部 (左右) ＋ 大殿筋起始部 (左右)",
            effect: "大腿神経と臀筋受容器へクリアなシグナルを送り、大腿部の伸展可動制限（防御性収縮）を解除します。",
            future: "骨盤からしなやかに脚が後ろへ送り出せるようになり、無理なく大きなストライドを維持できます。"
        },
        {
            id: "sprint_5",
            title: "悩み⑤：走っていると後半に腰が落ち、姿勢が崩れてくる",
            cause: "背部深層の多裂筋センサーの疲労で、骨盤を前傾に維持する脳のトニック指令が途切れています。",
            points: "胸腰椎移行部 T12-L1 (左右)",
            effect: "脊髄コア感覚を高め、長時間にわたり脊柱起立筋群のスタミナと動的アライメント維持力をキープします。",
            future: "レース終盤でも骨盤が高く保たれ、減速の少ない美しいスプリントフォームを完遂できます。"
        },
        {
            id: "sprint_6",
            title: "悩み⑥：ハードル跨ぎや跳躍時に脚がスムーズに上がらない",
            cause: "腸腰筋と大腿四頭筋の動的な協調が低下し、脳が股関節屈曲のスピードを制限しています。",
            points: "大腿四頭筋起始部 (左右)",
            effect: "大腿神経の感覚感度を向上させ、急激な股関節屈曲（脚の引き上げ）の運動指令エラーを解消します。",
            future: "ハードルや踏み切り動作で狙った高さへストレスなく脚が上がり、空中姿勢が非常に安定します。"
        },
        {
            id: "sprint_7",
            title: "悩み⑦：踏み切り時（跳躍）に十分な高さ（バネ）が出ない",
            cause: "足首関節周囲のSA-II機械受容器が麻痺し、床を強く叩くプライオメトリック反射の効率が落ちています。",
            points: "前脛骨筋起始部 (左右)",
            effect: "深腓骨神経および腱膜の入力を鋭敏化し、腱反射（アキレス腱のバネ）の弾性エネルギーを100%引き出します。",
            future: "地面からの反発力をダイレクトに上昇エネルギーに変えられ、高い跳躍力を発揮できます。"
        },
        {
            id: "sprint_8",
            title: "悩み⑧：接地後に足首を捻りやすく、着地に不安がある",
            cause: "腓骨筋周囲の固有受容感覚が狂い、接地時の微細な角度調整を行う脳の予測誤差が大きくなっています。",
            points: "前脛骨筋起始部 (左右)",
            effect: "腓骨神経走向および前脛骨筋の感覚入力をリセットし、足首の横ブレに対する補正反射をミリ秒単位で高速化します。",
            future: "どんな不整地やスピード接地でも足関節がピタッと安定し、怪我の不安なく攻めた走りができます。"
        },
        {
            id: "sprint_9",
            title: "悩み⑨：練習後にすね（シンスプリント部位）が張って痛む",
            cause: "接地衝撃のショック吸収が足裏ですべて行えず、前脛骨筋やヒラメ筋の腱付着部に過負荷が集中しています。",
            points: "前脛骨筋起始部 (左右)",
            effect: "前脛骨筋の過緊張トーンを緩和し、足部アーチの感覚フィードバックを補正して衝撃吸収力を高めます。",
            future: "接地衝撃が優しく分散され、すねの張りを引きずらずに連日の練習に励むことができます。"
        },
        {
            id: "sprint_10",
            title: "悩み⑩：大腿後部（ハムストリングス）に肉離れの不安や張りがある",
            cause: "大腿四頭筋との拮抗関係（相反性支配）が崩れ、膝伸展時にハムストリングスが緩まず過度に引き伸ばされています。",
            points: "大殿筋起始部 (左右) ＋ 大腿四頭筋起始部 (左右)",
            effect: "腿の前後および臀部の筋収縮協調パターンを脳内で再学習させ、ハムへの急激な引き伸ばしストレスを抑えます。",
            future: "ハムストリングスの張りがスッと抜け、全力疾走時でも肉離れの不安なく思い切り足を振り出せます。"
        }
    ],
    "soccer": [
        {
            id: "soccer_1",
            title: "悩み①：キック時に軸足がブレてシュートやロングパスが逸れる",
            cause: "軸足の着地感と骨盤のコントロールセンサーが鈍り、踏み込みの瞬間に重心のズレを反射補正できていません。",
            points: "前脛骨筋起始部 (左右) ＋ 腰方形筋周囲 (左右)",
            effect: "深腓骨神経と腰背部の入力を高め、踏み込み時の床反力を即座にコア（体幹）へ伝達。骨盤の左右ブレを抑えます。",
            future: "どんなに激しいスピードからでも軸足がピタッと安定し、正確無比なキックが連発できるようになります。"
        },
        {
            id: "soccer_2",
            title: "悩み②：急な切り返し（ターンやダッシュ）で踏ん張れず滑る・遅れる",
            cause: "減速ショックに対する殿筋（お尻）の反射収縮が遅れ、太ももだけで受け止めるため関節が防御ロックします。",
            points: "大腿四頭筋起始部 (左右) ＋ 大殿筋起始部 (左右)",
            effect: "前後の筋肉の感覚統合を高め、ニーイン（膝の内折れ）を抑えつつ、臀部のブレーキ力を瞬間的に起動します。",
            future: "鋭いターンや急ストップでもブレず、ディフェンスの一歩先を行くキレのある動きが手に入ります。"
        },
        {
            id: "soccer_3",
            title: "悩み③：ヘディングや競り合いで空中バランスが崩れて競り負ける",
            cause: "ジャンプ前の踏み込み感と空中姿勢の感覚アライメントにズレが生じ、無駄な全身の力みが発生しています。",
            points: "胸腰椎移行部 T12-L1 (左右) ＋ 前脛骨筋起始部 (左右)",
            effect: "体幹後枝と足関節のセンサーを同調させ、空中で自身の軸を脳が正確に把握できるようになります。",
            future: "空中でピタッと軸がぶれなくなり、高い打点から競り負けないパワフルなヘディングが打てます。"
        },
        {
            id: "soccer_4",
            title: "悩み④：トラップ時のタッチが固く、足元にボールが収まらない",
            cause: "足首や足裏のレセプター（機械受容器）が麻痺し、ボールが触れる瞬間の脱力クッション反射が作動していません。",
            points: "前脛骨筋起始部 (左右)",
            effect: "腓骨神経系の感覚入力精度を高め、足首周囲の相反性支配（柔軟な屈伸）を促しタッチを極めてソフトにします。",
            future: "吸い付くようなピタッとしたファーストタッチが可能になり、すぐに次の動作（パスやシュート）に移れます。"
        },
        {
            id: "soccer_5",
            title: "悩み⑤：試合後半に走行距離（スプリント回数）が落ちる",
            cause: "体幹深層筋の疲労蓄積により重心が下がり、脚全体のストライクトーン（筋収縮効率）が大きく低下しています。",
            points: "胸腰椎移行部 T12-L1 (左右)",
            effect: "自律神経系の過緊張を抑え、下肢への血流循環を活性化。疲労物質の排出と体幹支持力を高めます。",
            future: "後半ロスタイムでも足が軽々と動き、チームのために何度もスプリントを繰り返すスタミナが維持されます。"
        },
        {
            id: "soccer_6",
            title: "悩み⑥：インステップキックでボールの芯を捉えられず、ミート率が低い",
            cause: "膝と足首を固定するセンサーの協調が崩れ、インパクトの瞬間に足首がルーズ（ブレ）になっています。",
            points: "前脛骨筋起始部 (左右)",
            effect: "足関節周囲の腱膜センサーを活性化し、インステップにかかる衝撃に対して瞬時に固定する反射を強めます。",
            future: "インパクトの瞬間に足首が強固に固定され、ボールに100%力が伝わり無回転や強烈なシュートが打てます。"
        },
        {
            id: "soccer_7",
            title: "悩み⑦：背後からのロングパスの目測がズレて処理を誤る",
            cause: "レシーブ姿勢での「視覚と身体軸の空間的協調」に微細なズレが生じています。",
            points: "僧帽筋起始部 (左右) ＋ 鎖骨下周囲 (左右)",
            effect: "頸部固有受容感覚と胸郭まわりの位置感覚入力を統合し、小脳での空間認知のエラー率を大幅に引き下げます。",
            future: "走りながらの背後からのパスもブレずに軌道を見極められ、流れるようなトラップから前を向けます。"
        },
        {
            id: "soccer_8",
            title: "悩み⑧：股関節の付け根（内転筋・鼠径部）が痛む（グロインペイン症候群）",
            cause: "骨盤のアライメント不良により、キックやダッシュ時に一部の内転筋腱へストレスが集中しています。",
            points: "大腿四頭筋起始部 (左右) ＋ 腰方形筋周囲 (左右)",
            effect: "骨盤を支える大腿部前部と腰背部の感覚フィードバックを補正し、骨盤をニュートラルに保持して負担を分散します。",
            future: "股関節の嫌な痛みや詰まり感が解消し、全力での踏み込みや強いインサイドパスが快適に行えます。"
        },
        {
            id: "soccer_9",
            title: "悩み⑨：ダッシュ後に膝のお皿の下あたりが痛む（ジャンパー膝）",
            cause: "大腿四頭筋（前もも）が硬直し、ジャンプや着地時に膝蓋腱にかかる張力を逃がせなくなっています。",
            points: "大腿四頭筋起始部 (左右)",
            effect: "大腿神経のトーンを正常化し、大腿四頭筋の防御的過緊張を緩和。着地衝撃を臀部へ分散させます。",
            future: "膝関節周囲への負担が激減し、着地の恐怖感なく何度も高いジャンプや急停止が繰り返せます。"
        },
        {
            id: "soccer_10",
            title: "悩み⑩：プレッシャー下で視野が狭くなり、周囲の状況判断が遅れる",
            cause: "全身の交感神経過緊張（力み）により視野の周辺認知能力が低下し、脳のワーキングメモリが圧迫されています。",
            points: "鎖骨下周囲 (左右) ＋ 胸腰椎移行部 (左右)",
            effect: "胸郭周辺と自律神経調整部位へのアプローチにより、脳の防衛トーンをオフ。リラックスしつつ集中した状態を作ります。",
            future: "プレー中の視野がグッと広がり、相手の位置や味方のフリーランニングを冷静に見極め、正確な判断が下せます。"
        }
    ],
    "baseball": [
        {
            id: "baseball_1",
            title: "悩み①：投球時に肩が引っかかり、球速が出ない（肩の詰まり）",
            cause: "肩甲骨周囲の受容器の麻痺により、脳が肩のインピンジメントを防ごうと腕の振りに無意識のブレーキをかけています。",
            points: "僧帽筋起始部 (左右) ＋ 鎖骨下周囲 (左右)",
            effect: "副神経と鎖骨下神経への入力により、脳の挙上制限ロックを解除。胸郭の回旋としなやかな肩甲骨運動を促します。",
            future: "肩が引っかかりなく滑らかに回り、高いリリースポイントから伸びのある快速球が投げられます。"
        },
        {
            id: "baseball_2",
            title: "悩み②：スイング時に軸がブレてボールの芯を捉えられない",
            cause: "スイングの捻転動作の際に、体幹と踏み込み足の感覚連動が低下し、スウェー（腰の逃げ）が発生しています。",
            points: "胸腰椎移行部 T12-L1 (左右) ＋ 前脛骨筋起始部 (左右)",
            effect: "体幹深層筋と足関節のセンサーを同調。回転運動軸となる骨盤のアライメントをリアルタイムで自動補正します。",
            future: "頭の位置が全くブレない正確なスイング軸になり、変化球にも崩されずにミート力が最大化します。"
        },
        {
            id: "baseball_3",
            title: "悩み③：守備や走塁で「最初の一歩」の反応が遅れる",
            cause: "プレ準備姿勢でのすねや足裏の感覚入力が低く、脳からの瞬発的な動作指令の伝達が遅延しています。",
            points: "前脛骨筋起始部 (左右)",
            effect: "深腓骨神経を活性化させ、一歩目を踏み出す足の脊髄反射回路（背屈・底屈）の反応速度を高速化します。",
            future: "打球音やサインに体が無意識に反応し、レシーブや盗塁のスタートが爆発的に速くなります。"
        },
        {
            id: "baseball_4",
            title: "悩み④：投球を繰り返すと肩の後ろ側がピキッと痛む",
            cause: "リリースからフォロースルー時の急激な減速動作で、腱板後方がブレーキ役として過酷な牽引ストレスを受けています。",
            points: "僧帽筋起始部 (左右)",
            effect: "肩甲骨周囲の固有感覚フィードバックを高め、腕の減速ショックを背中全体の筋肉へシームレスに分散させます。",
            future: "肩後方への局所的な負担が消え、イニングを重ねても肩の軽さを維持したまま投げ抜くことができます。"
        },
        {
            id: "baseball_5",
            title: "悩み⑤：送球（スローイング）のコントロールが安定しない",
            cause: "リリース時の指先・手首の固有受容感覚が狂い、指先でボールを押すリリースタイミングが毎回ズレています。",
            points: "外側上顆周囲 (左右)",
            effect: "橈骨神経系への感覚入力をクリアにし、手関節から指先への微細な屈伸・協調運動の精度を高めます。",
            future: "狙ったスポットへ吸い込まれるような正確なコントロールが身につき、悪送球のイップスや不安が解消します。"
        },
        {
            id: "baseball_6",
            title: "悩み⑥：打撃でインコースのボールに対してバットが出にくい",
            cause: "大胸筋や前鋸筋周辺の固着により、肘を抜きながらインサイドからバットを出す胸郭の捻り運動がロックされています。",
            points: "鎖骨下周囲 (左右)",
            effect: "鎖骨下および胸郭周囲の皮膚機械受容器への刺激により、脳の挙動制限を外し、胸郭の回旋可動性を最大化します。",
            future: "インコースの内角球に対しても肘をスッと抜け、シャープな回転でフェアゾーンへ強く弾き返せます。"
        },
        {
            id: "baseball_7",
            title: "悩み⑦：捕球時のグラブさばき（タッチハンドリング）が固い",
            cause: "グラブを持つ腕の防御的過緊張により、ボールの衝撃を吸収する手首や肘の相反性神経支配が機能していません。",
            points: "外側上顆周囲 (左右)",
            effect: "グリップ過緊張を緩和し、ボールがグラブに触れた瞬間の極小の「引き込み」反射をアシストします。",
            future: "バウンドの変化に柔らかく対応するグラブさばきが可能になり、ファンブルエラーが劇的に減少します。"
        },
        {
            id: "baseball_8",
            title: "悩み⑧：スイング後半に腰が抜け、強い打球が飛ばない",
            cause: "インパクトからフォロースルーの強烈な回旋に対して、軸足の踏ん張りと体幹の固定が遅れています。",
            points: "大殿筋起始部 (左右) ＋ 胸腰椎移行部 (左右)",
            effect: "後ろ側の臀部と体幹の固有感覚連動を瞬時に同期し、回転力を逃がさずにインパクトの瞬間へ全パワーを伝えます。",
            future: "押し込みの効いた強烈なバックスピンの打球になり、外野の頭を越える長打が増加します。"
        },
        {
            id: "baseball_9",
            title: "悩み⑨：試合後半に足腰の踏ん張りがきかなくなり、スローイングが浮く",
            cause: "下半身の疲労により、前足を踏み込んでから上体へパワーを繋ぐ骨盤移行部の固有感覚が鈍っています。",
            points: "胸腰椎移行部 T12-L1 (左右) ＋ 前脛骨筋起始部 (左右)",
            effect: "骨盤の安定性に関わる脊髄反射をサポートし、下半身から上半身への運動連鎖（キネティックチェーン）を維持します。",
            future: "試合の終盤になっても上体だけで投げる「手投げ」にならず、地面からの力を利用した力強い送球が持続します。"
        },
        {
            id: "baseball_10",
            title: "悩み⑩：ヘッドスライディングやダイビング守備でのケガが心配",
            cause: "突発的な衝撃に対する全身の関節防衛アライメント（防御的な瞬間緊張）が遅れ、肩や手首に無理な力がかかっています。",
            points: "鎖骨下周囲 (左右) ＋ 大殿筋起始部 (左右)",
            effect: "全身の筋肉の準備トーンを整え、衝撃を受ける瞬間の全身の分散補正反射を高速化します。",
            future: "ダイナミックなプレースタイルでも、衝撃を上手にいなし、脱臼やねんざなどのケガのリスクを極小に抑えられます。"
        }
    ],
    "golf": [
        {
            id: "golf_1",
            title: "悩み①：バックスイングで腰が引けてスウェー（横流れ）してしまう",
            cause: "股関節および骨盤周囲の感覚アライメントが狂い、回転の中心軸（骨盤）を脳が正しく認知できていません。",
            points: "大殿筋起始部 (左右) ＋ 腰方形筋周囲 (左右)",
            effect: "殿筋と腰背部のレセプターを刺激し、股関節の回旋運動時に骨盤を水平に保持する筋肉のセンサーを活性化します。",
            future: "その場で独楽（こま）のように鋭く回転するテイクバックになり、スウェーによるエネルギーロスを防ぎます。"
        },
        {
            id: "golf_2",
            title: "悩み②：インパクトで力んでしまい、ヘッドスピードが上がらずスライスする",
            cause: "「強く叩こう」とすることで脳が関節保護のために肩や腕を防御的に固め（力み）、ヘッドの走りをつくられます。",
            points: "鎖骨下周囲 (左右)",
            effect: "鎖骨下・胸郭周辺の感覚フィードバックを高め、脳の緊張トーンを緩和。相反性支配を促し無駄な力みを取り除きます。",
            future: "無駄な力が綺麗に抜け、インパクトゾーンでヘッドが勝手に走る「美しいドローボール」が打てるようになります。"
        },
        {
            id: "golf_3",
            title: "悩み③：ラウンド後半に腰が張り、アドレスが安定せずミスショットが出る",
            cause: "長時間のスイング反復による腰方形筋・多裂筋の疲労蓄積から、脳が腰を固める防衛反応スパイラルに陥っています。",
            points: "胸腰椎移行部 T12-L1 (左右)",
            effect: "脊髄後枝への感覚入力により自律神経の過緊張を和らげ、腰部の血流を急速に促進させます。",
            future: "後半ホールになってもアドレスの軸が安定し、疲れによるダフリやトップのミスショットが激減します。"
        },
        {
            id: "golf_4",
            title: "悩み④：パッティングで手の先が震え、ストローク軌道が安定しない",
            cause: "手首や前腕の固有受容感覚が麻痺し、目標の距離感に対して指先が防御的に微小過剰に動いてしまうためです。",
            points: "外側上顆周囲 (左右)",
            effect: "前腕屈筋・伸筋群の感覚受容器を整え、パターの重量を感じながら指先の余計な力みをスッと消します。",
            future: "狙ったライン上にストレートにヘッドを出し引きでき、1〜2mのショートパットが確実に決まるようになります。"
        },
        {
            id: "golf_5",
            title: "悩み⑤：テイクバックでの左肩の入りが浅く、捻転不足を感じる",
            cause: "肩甲骨まわりの筋緊張センサー（僧帽筋など）が狂い、脳がこれ以上の回旋を危険とみなしてストッパーをかけています。",
            points: "僧帽筋起始部 (左右)",
            effect: "肩甲背神経走向への入力により、脳の可動制限ロック（防御反応）を解除し、肩甲骨の引き込み可動域を拡大します。",
            future: "深くゆとりのあるトップオブスイングになり、余裕を持ってクラブをため、ダウンスイングに繋げられます。"
        },
        {
            id: "golf_6",
            title: "悩み⑥：ダウンスイングで手元が浮き、シャンクやトップが出る",
            cause: "インパクト直前に骨盤が前方へ起き上がり、腕の通り道が消えてクラブが外から入るためです。",
            points: "大殿筋起始部 (左右) ＋ 前脛骨筋起始部 (左右)",
            effect: "足関節と臀部の感覚入力を統合し、前傾姿勢（お尻の位置）をキープしたまま切り返す筋反射を自動トリガーします。",
            future: "インパクトまで上体の前傾姿勢がピタッと維持され、インサイドからクラブが入り、美しいミートになります。"
        },
        {
            id: "golf_7",
            title: "悩み⑦：飛距離を出そうとすると「チーピン」や引っかけが出る",
            cause: "下半身の動きに対して腕のローテーション感覚が脳内でオーバーラップし、フェースが急激に閉じています。",
            points: "外側上顆周囲 (左右) ＋ 大殿筋起始部 (左右)",
            effect: "前腕と下半身の固有受容フィードバックを同調。手首の過剰なこね反射を自動抑制します。",
            future: "フェースの向きがインパクトゾーンで長くスクエアに保たれ、直進性の高いビッグキャリーが実現します。"
        },
        {
            id: "golf_8",
            title: "悩み⑧：バンカーショットや傾斜地からのショットで下半身がブレる",
            cause: "足の底面や脛のセンサーからの床情報入力が低く、足元が不安定なときに腰や膝がブレてしまっています。",
            points: "前脛骨筋起始部 (左右)",
            effect: "深腓骨神経経由で下肢の接地バランスフィードバックを高め、足首の微妙な角度に対する自動安定化を促します。",
            future: "砂の上や厳しい傾斜でも下半身のスタンスが完璧に固定され、ブレのないクリーンな脱出・ショットが打てます。"
        },
        {
            id: "golf_9",
            title: "悩み⑨：アプローチでダフリの恐怖感がある",
            cause: "「ダフりたくない」という不安による脳の防御反応から、肩や手首をリリースするタイミングが縮こまっています。",
            points: "鎖骨下周囲 (左右) ＋ 外側上顆周囲 (左右)",
            effect: "上半身全体の緊張トーンを下げ、フェース面をボールの下に滑り込ませるしなやかなリリース感覚を促します。",
            future: "ボールを優しく拾うアプローチハンドリングになり、ダフリの恐怖なくピンそばへピタッと寄せられます。"
        },
        {
            id: "golf_10",
            title: "悩み⑩：ラウンド翌日に首や背中がバキバキに張る",
            cause: "一方向へのスイングを繰り返すことによる筋肉の非対称的な過緊張が、交感神経を刺激したままロックされています。",
            points: "僧帽筋起始部 (左右) ＋ 胸腰椎移行部 (左右)",
            effect: "脊髄の皮枝入力から自律神経をリラックス状態へシフト。血流を促してスイングの捻転疲労を急速に回復させます。",
            future: "ラウンドの翌朝でも身体の重さがなくスッキリと目覚め、週2〜3回のプレーでも疲労蓄積を全く感じなくなります。"
        }
    ],
    "basketball": [
        {
            id: "basketball_1",
            title: "悩み①：ドライブイン時の切り返し（クロスオーバー）のキレが悪い",
            cause: "横方向への爆発的な切り返しに対して、足首と股関節のセンサー連動が遅れて重心移動がロスしています。",
            points: "前脛骨筋起始部 (左右) ＋ 大殿筋起始部 (左右)",
            effect: "足関節の底屈・背屈反射と臀部の踏ん張り反射を同調させ、急な切り返し動作を高速化します。",
            future: "ディフェンスが一歩も動けないような、重心移動が深く鋭いキレ味抜群のドライブが可能になります。"
        },
        {
            id: "basketball_2",
            title: "悩み②：ジャンプシュート時に空中でブレてリングを外す・着地が不安定",
            cause: "空中姿勢をコントロールするコアと肩まわりの固有感覚のズレにより、空間における体の対称姿勢を脳が保てていません。",
            points: "胸腰椎移行部 T12-L1 (左右) ＋ 鎖骨下周囲 (左右)",
            effect: "脊髄コアと鎖骨周囲の感覚アライメントを統合し、空中で重心軸が真っ直ぐに維持されるよう脳が自動調整します。",
            future: "空中でピタッと静止しているような感覚になり、リリースのブレがなくなりシュート確率が劇的に向上します。"
        },
        {
            id: "basketball_3",
            title: "悩み③：ディフェンス時に相手のクイックネスな動きについていけない",
            cause: "横スライドの際の足首の防御的関節ロック（捻挫防止反応）が発生し、ステップがワンテンポ遅れています。",
            points: "前脛骨筋起始部 (左右)",
            effect: "深腓骨神経へ高密度入力し、足首の横方向への踏ん張りと敏捷なステップのための反射回路を解放します。",
            future: "相手の細かい方向転換にも完全にマークが張り付き、シュートスペースを与えない強固なDFが築けます。"
        },
        {
            id: "basketball_4",
            title: "悩み④：ボールキャッチからシュートへの一連の動作が遅い",
            cause: "キャッチした手のセンサーがボールを脳に伝達し、次の筋肉を起動する運動計画プログラムのトリガーが遅延しています。",
            points: "外側上顆周囲 (左右)",
            effect: "手〜前腕の機械受容器フィードバックを活性化。キャッチ後の「次の判断」への脊髄反射を高速化します。",
            future: "キャッチした瞬間にはすでに次のモーションに入れており、ディフェンスに隙を与えることなくオフェンスを完遂できます。"
        },
        {
            id: "basketball_5",
            title: "悩み⑤：フリースローの時に力んでしまい、ボールが強く弾かれて外れる",
            cause: "「決めたい」というプレッシャーにより、大胸筋や肩甲骨周囲の筋肉が同時収縮を起こし手首が固くなっています。",
            points: "鎖骨下周囲 (左右)",
            effect: "鎖骨下のSA-II機械受容器を刺激。脳へのリラックス信号を増やし、手首と指先の柔らかなフォロースルーを可能にします。",
            future: "リリース時のタッチが非常に柔らかくなり、リングに優しく吸い込まれるような高確率のフリースローになります。"
        },
        {
            id: "basketball_6",
            title: "悩み⑥：リバウンドで競り負ける・最高到達点に届かない",
            cause: "踏み込みの瞬間に臀部のパワーが十分発揮されず、大腿部の筋肉だけでジャンプしてしまっています。",
            points: "大殿筋起始部 (左右)",
            effect: "臀部のレセプターへ感覚刺激を送り、股関節伸展パワーを瞬時に解放。大腿後部と臀部の連動力を引き上げます。",
            future: "ジャンプのバネが一段階向上し、高い打点で確実にリバウンドやブロックショットを制することができます。"
        },
        {
            id: "basketball_7",
            title: "悩み⑦：激しいコンタクトでバランスが崩れ、シュートを決めきれない",
            cause: "接触した衝撃に対して体幹の固有感覚が遅れ、インナーマッスルの瞬間的な姿勢保持が間に合っていません。",
            points: "胸腰椎移行部 T12-L1 (左右)",
            effect: "脊髄のコア神経を経由して多裂筋などの体幹支持筋を瞬時に活性化。衝撃に対する予測姿勢補正を促します。",
            future: "空中やゴール下で激しいぶつかり合いを受けても体軸がブレず、タフなレイアップシュートを沈められます。"
        },
        {
            id: "basketball_8",
            title: "悩み⑧：ダッシュやストップの繰り返しで膝蓋骨の周囲が痛む",
            cause: "大腿四頭筋がクッション機能を果たせず、衝撃がすべて膝蓋腱に集中して炎症を起こしています。",
            points: "大腿四頭筋起始部 (左右)",
            effect: "大腿四頭筋の異常収縮トーンを下げて柔軟性を取り戻し、大殿筋と連動させることで膝へのショックを分散します。",
            future: "膝にかかる強いストレスが消え、急停止や全力ダッシュを痛みを恐れずに何百回も繰り返せます。"
        },
        {
            id: "basketball_9",
            title: "悩み⑨：パスが弱く、相手にカットされやすい",
            cause: "胸郭の回旋力と肘〜手首の運動連鎖が崩れ、手先だけの「手押しパス」になっているためスピードが出ません。",
            points: "鎖骨下周囲 (左右) ＋ 外側上顆周囲 (左右)",
            effect: "肩甲帯と腕の固有感覚入力を同調させ、胸から押し出すようにバネのように手首が走る運動連鎖を作ります。",
            future: "パススピードが飛躍的にアップし、鋭く正確なチェストパスや片手のアウトレットパスがディフェンスをすり抜けます。"
        },
        {
            id: "basketball_10",
            title: "悩み⑩：長時間の試合で足の裏やふくらはぎがつりそうになる",
            cause: "足根骨周囲の細かなセンサー疲労により、床を掴むインナー足底筋が緩み、ふくらはぎで代償して過緊張が生じています。",
            points: "前脛骨筋起始部 (左右)",
            effect: "足関節下行の神経回路を整え、下腿三頭筋の過度の防衛的パンプアップを抑え、アライメントを適正化します。",
            future: "試合の終盤になっても足が軽くしなやかに動き、脚がつる不安から完全に解放されてプレーに集中できます。"
        }
    ],
    "general": [
        {
            id: "general_1",
            title: "悩み①：練習や試合の後半になると動きが固くなり、スタミナ切れ・力みが出る",
            cause: "反復動作の疲労ノイズにより脳が筋肉を過剰に固め、アゴニストとアンタゴニストが同時に収縮してエネルギーをロスします。",
            points: "各競技の基本貼付ポイント",
            effect: "全身の相反性神経支配（主動筋が働くとき拮抗筋が緩む動き）を脳が正しく機能させ、筋肉が自然にしなる状態に戻します。",
            future: "長時間のプレーでも無駄な筋肉の摩擦熱や疲労がなくなり、後半まで高いパフォーマンスを持続できます。"
        },
        {
            id: "general_2",
            title: "悩み②：特定の関節の可動域が狭く、動きに「詰まり」や引っかかりを感じる",
            cause: "過去の怪我や疲労により脳が防御反応として関節可動域にブレーキをかけ、動作スピードを制限しています。",
            points: "各関節周囲の貼付ポイント",
            effect: "皮膚受容器からのクリアな位置感覚シグナルが「これ以上動かしても安全」という判断を脳に促し、ブレーキを解除します。",
            future: "詰まり感がその場で消去され、関節の可動域が広がることで、ダイナミックでしなやかなフォームへ改善します。"
        },
        {
            id: "general_3",
            title: "悩み③：プレー翌日に必ず背中や腰に疲労が残り、コンディションが安定しない",
            cause: "激しいプレーによる筋肉の過緊張と血流低下が、交感神経の優位状態を引き起こし、睡眠時の回復力を妨げています。",
            points: "胸腰椎移行部 T12-L1 (左右)",
            effect: "脊髄神経後枝への感覚入力が自律神経バランスを副交感神経優位に導き、全身の毛細血管血流を促進させて早期リカバリーします。",
            future: "翌朝の寝起きが非常に軽くなり、連戦でも蓄積された疲労を引きずることなく100%の力で臨めます。"
        },
        {
            id: "general_4",
            title: "悩み④：本番前の緊張で筋肉がこわばり、普段通りのパフォーマンスができない",
            cause: "緊張により偏桃体が過剰に活動し、脳から全身へ防御的な筋硬直の防衛シグナルが発令されているためです。",
            points: "鎖骨下周囲 (左右)",
            effect: "鎖骨下および胸郭周辺の感覚受容器へ優しく刺激を送り、三叉神経・迷走神経経路を介して過緊張トーンを和らげます。",
            future: "緊張感はあるのに身体は完全にリラックスしている「ゾーン」の状態を作り出し、本番で最高のパフォーマンスが出せます。"
        },
        {
            id: "general_5",
            title: "悩み⑤：動作中に左右のバランスが崩れ、体幹の軸が安定しない",
            cause: "身体の左右非対称な動作の反復により、小脳が認識している「中心軸」にエラーが生じ、姿勢補正が傾いています。",
            points: "胸腰椎移行部 T12-L1 (左右)",
            effect: "背柱深層の固有感覚の入力を対称にクリアにし、脳がリアルタイムで中心軸をミリメートル単位で補正します。",
            future: "体幹が芯からブレない美しいバランスになり、どの方向へのステップや回旋動作も安定してスムーズになります。"
        },
        {
            id: "general_6",
            title: "悩み⑥：道具との一体感が感じられない（フィット感不足）",
            cause: "手や腕のレセプターの疲労で、道具から手のひらに伝わる「触覚・振動フィードバック」の感度が著しく落ちています。",
            points: "外側上顆周囲 (左右)",
            effect: "橈骨神経・正中神経走向の固有受容を活性化し、手が持つ道具の重心位置を脳が精密に認識できるようにします。",
            future: "道具が自分の「身体の延長」として感じられるようになり、打撃やインパクトの瞬間をより敏感に操れます。"
        },
        {
            id: "general_7",
            title: "悩み⑦：急激なストップや方向転換時に関節がグラつく",
            cause: "減速Gに対して筋肉の反応速度がコンマ数秒遅れ、靭帯や関節包などの受動組織だけで衝撃を受けています。",
            points: "前脛骨筋起始部 (左右)",
            effect: "深腓骨神経および脛骨側受容器のトーンを活性化し、関節にかかる急な外力に対して周囲の筋肉が瞬時に締まる反射を高めます。",
            future: "激しいアジリティワークでも関節が靭帯レベルからピタッとブレずに安定し、ねんざなどの怪我の心配が皆無になります。"
        },
        {
            id: "general_8",
            title: "悩み⑧：スローイングやキック等の動作で肘や膝の抜け感が悪い",
            cause: "主動筋と拮抗筋の動的な感覚同調が崩れ、末端関節を伸ばしきる瞬間にブレーキがかかっています。",
            points: "僧帽筋起始部 (左右) または 大腿四頭筋起始部 (左右)",
            effect: "胸郭・肩甲骨または大腿部の固有感覚の位置情報を統合し、脳が腕や脚の振り出し終点を「安全」と認識させます。",
            future: "関節がスムーズに伸び抜け、引っかかり感なく最後までエネルギーが道具やボールへしっかりと伝わります。"
        },
        {
            id: "general_9",
            title: "悩み⑨：慢性的に同じ部位ばかり怪我や痛みを繰り返す",
            cause: "過去の怪我の「痛みの記憶」が脳内に残り、そこを庇うための代償運動による不自然な過負荷が隣接部位へ蓄積しています。",
            points: "胸腰椎移行部 (左右) ＋ 前脛骨筋起始部 (左右)",
            effect: "全身のアライメントセンサーを統合し、脳に誤った「代償動作のクセ」を忘れさせ、正しい運動パターンへ再学習させます。",
            future: "特定の関節に余計な負担が集中しなくなり、同じ部位の慢性的なケガや再発の負のループから脱出できます。"
        },
        {
            id: "general_10",
            title: "悩み⑩：動き全体の連動性が消えてぎこちない（しなやかさ不足）",
            cause: "部分的な筋力強化や反復動作により、脳が部位別の独立した運動計画ばかりを発令し、全身の連動性が分断されています。",
            points: "鎖骨下周囲 (左右) ＋ 胸腰椎移行部 (左右) ＋ 大殿筋起始部 (左右)",
            effect: "コア・上肢・下肢の感覚フィードバックをひとつの協調パターンとして小脳で統合させ、運動連鎖をなめらかに繋ぎます。",
            future: "全身の筋肉が一本の鞭のようにしなる、無駄な抵抗のない美しくダイナミックな連動動作が実現します。"
        }
    ]
};

// Populate complaints select options dynamically based on selected sport
function populateSportComplaints(sportKey) {
    const selector = document.getElementById('sportComplaintSelector');
    if (!selector) return;
    
    // Clear existing options, keeping only the default placeholder
    selector.innerHTML = '<option value="">-- お悩みを選択してください --</option>';
    
    // Determine which complaints array to load
    const complaints = SPORTS_COMPLAINTS[sportKey] || SPORTS_COMPLAINTS['general'];
    
    // Build options
    complaints.forEach((c, idx) => {
        const opt = document.createElement('option');
        opt.value = idx.toString(); // Store the array index as option value
        opt.textContent = c.title;
        selector.appendChild(opt);
    });
    
    // Hide detail area initially
    document.getElementById('sportComplaintDetailArea').style.display = 'none';
}

function showSportComplaintDetail(idxVal) {
    const area = document.getElementById('sportComplaintDetailArea');
    if (!idxVal) {
        area.style.display = 'none';
        return;
    }
    
    const sportKey = appState.selectedSport;
    const complaints = SPORTS_COMPLAINTS[sportKey] || SPORTS_COMPLAINTS['general'];
    const data = complaints[parseInt(idxVal)];
    
    if (data) {
        document.getElementById('sportCompCause').textContent = data.cause;
        document.getElementById('sportCompPoints').textContent = data.points;
        document.getElementById('sportCompEffect').textContent = data.effect;
        document.getElementById('sportCompFuture').textContent = data.future;
        area.style.display = 'block';
    }
}
