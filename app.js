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
    historyData: [
        { id: 1, date: '2026-07-01', sport: '陸上 (スプリント)', preRom: 70, postRom: 85, romChange: 21.4, preBal: 12, postBal: 28, balChange: 133.3 },
        { id: 2, date: '2026-07-04', sport: '陸上 (スプリント)', preRom: 72, postRom: 88, romChange: 22.2, preBal: 15, postBal: 35, balChange: 133.3 }
    ],
    cameraStage: null // 'pre' or 'post'
};

// 2. Mapping Data Definitions (16 Sports - Minor sports Figure Skating, Ballet, Dance placed at the end)
const SPORTS_MAPPING = {
    sprinting: {
        name: "陸上（スプリント・跳躍）",
        desc: "走動作の推進力・ピッチ・接地感覚を最大化するプロトコル",
        points: [
            { x: 75, y: 320, name: "前脛骨筋起始部 (右)", desc: "腓骨頭の斜め前下方。接地時のブレーキを軽減し、足首の滑りを促進。" },
            { x: 125, y: 320, name: "前脛骨筋起始部 (左)", desc: "腓骨頭の斜め前下方。接地時のブレーキを軽減し、足首の滑りを促進。" },
            { x: 85, y: 220, name: "胸腰椎移行部 T12-L1 (右)", desc: "第12胸椎・第1腰椎外側2本分。骨盤の前傾制御と体幹の動的安定。" },
            { x: 115, y: 220, name: "胸腰椎移行部 T12-L1 (左)", desc: "第12胸椎・第1腰椎外側2本分。骨盤の前傾制御と体幹の動的安定。" },
            { x: 80, y: 260, name: "大殿筋起始部 (右)", desc: "腸骨稜の後縁。股関節伸展パワーを呼び覚まし推進力を最大化。" },
            { x: 120, y: 260, name: "大殿筋起始部 (左)", desc: "腸骨稜の後縁。股関節伸展パワーを呼び覚まし推進力を最大化。" }
        ]
    },
    soccer: {
        name: "サッカー",
        desc: "キック時の軸ブレ防止、急激な切り返し（アジリティ）を強化",
        points: [
            { x: 75, y: 320, name: "前脛骨筋起始部 (右)", desc: "切り返し時の足首のブレ抑制と芝への引っかかり防止。" },
            { x: 125, y: 320, name: "前脛骨筋起始部 (左)", desc: "切り返し時の足首のブレ抑制と芝への引っかかり防止。" },
            { x: 78, y: 230, name: "腰方形筋 (QL) 周囲 (右)", desc: "脇腹と腰骨の間。骨盤の左右ブレを抑え、片足立位軸を安定。" },
            { x: 122, y: 230, name: "腰方形筋 (QL) 周囲 (左)", desc: "脇腹と腰骨の間。骨盤の左右ブレを抑え、片足立位軸を安定。" },
            { x: 80, y: 200, name: "大腿四頭筋起始部 (右)", desc: "脚の付け根前面（下前腸骨棘）。キックのテイクバック可動域を拡大。" },
            { x: 120, y: 200, name: "大腿四頭筋起始部 (左)", desc: "脚の付け根前面（下前腸骨棘）。キックのテイクバック可動域を拡大。" }
        ]
    },
    baseball: {
        name: "野球",
        desc: "投球時の肩甲骨・胸郭連動、バッティング時のスイング軸を安定",
        points: [
            { x: 80, y: 110, name: "鎖骨下周囲 (右)", desc: "巻き肩をリセットし、テイクバック〜リリース時の胸郭の開きを拡大。" },
            { x: 120, y: 110, name: "鎖骨下周囲 (左)", desc: "巻き肩をリセットし、テイクバック〜リリース時の胸郭の開きを拡大。" },
            { x: 85, y: 130, name: "棘上筋・棘下筋起始部 (右)", desc: "肩甲骨の縁。回旋腱板の協調運動を促し、肩関節の衝突痛を防止。" },
            { x: 115, y: 130, name: "棘上筋・棘下筋起始部 (左)", desc: "肩甲骨の縁。回旋腱板の協調運動を促し、肩関節の衝突痛を防止。" },
            { x: 90, y: 230, name: "多裂筋起始部 (右)", desc: "仙骨〜腰椎の両側。投球・打撃のスイング回旋軸のブレを抑制。" },
            { x: 110, y: 230, name: "多裂筋起始部 (左)", desc: "仙骨〜腰椎の両側。投球・打撃のスイング回旋軸のブレを抑制。" }
        ]
    },
    golf: {
        name: "ゴルフ",
        desc: "アドレス時の重心安定、体幹（スイング軸）の安定を促す",
        points: [
            { x: 85, y: 210, name: "傍脊柱筋 T12周囲 (右)", desc: "背骨の両側。アドレスからフィニッシュまでの前傾角度のキープ。" },
            { x: 115, y: 210, name: "傍脊柱筋 T12周囲 (左)", desc: "背骨の両側。アドレスからフィニッシュまでの前傾角度のキープ。" },
            { x: 90, y: 200, name: "腸腰筋起始部 (右)", desc: "下腹部深部。バックスイング時の腰のスウェー（逃げ）を防止。" },
            { x: 110, y: 200, name: "腸腰筋起始部 (左)", desc: "下腹部深部. バックスイング時の腰のスウェー（逃げ）を防止。" },
            { x: 65, y: 190, name: "手関節背側 (右)", desc: "手首の甲側中央。インパクト時のこね（アーリーリリース）を防止。" },
            { x: 135, y: 190, name: "手関節背側 (左)", desc: "手首の甲側中央。インパクト時のこね（アーリーリリース）を防止。" }
        ]
    },
    tennis: {
        name: "テニス",
        desc: "リスト・肘の負担軽減とフットワークの敏捷性向上",
        points: [
            { x: 60, y: 150, name: "外側上顆周囲 (右)", desc: "テニス肘の予防。短橈側手根伸筋のテンションを調整。" },
            { x: 140, y: 150, name: "外側上顆周囲 (左)", desc: "テニス肘の予防。短橈側手根伸筋のテンションを調整。" },
            { x: 80, y: 110, name: "鎖骨下周囲 (右)", desc: "胸郭の回旋を促し、手打ちを防いで体幹でストローク。" },
            { x: 120, y: 110, name: "鎖骨下周囲 (左)", desc: "胸郭の回旋を促し、手打ちを防いで体幹でストローク。" },
            { x: 75, y: 320, name: "前脛骨筋起始部 (右)", desc: "スプリットステップからの第一歩のフットワーク俊敏性向上。" },
            { x: 125, y: 320, name: "前脛骨筋起始部 (左)", desc: "スプリットステップからの第一歩のフットワーク俊敏性向上。" }
        ]
    },
    basketball: {
        name: "バスケットボール",
        desc: "ジャンプ到達点アップ、着地時の関節保護とクイックネス強化",
        points: [
            { x: 75, y: 290, name: "膝蓋骨周囲 (右)", desc: "大腿四頭筋〜膝蓋腱。ジャンパー膝を防ぎ、着地の内反（ニーイン）を抑える。" },
            { x: 125, y: 290, name: "膝蓋骨周囲 (左)", desc: "大腿四頭筋〜膝蓋腱。ジャンパー膝を防ぎ、着地の内反（ニーイン）を抑える。" },
            { x: 80, y: 260, name: "大殿筋起始部 (右)", desc: "跳躍パワーの源である股関節伸展パワーを最大化。" },
            { x: 120, y: 260, name: "大殿筋起始部 (左)", desc: "跳躍パワーの源である股関節伸展パワーを最大化。" },
            { x: 75, y: 320, name: "前脛骨筋起始部 (右)", desc: "低い姿勢でのディフェンス時の足首のホールド安定。" },
            { x: 125, y: 320, name: "前脛骨筋起始部 (左)", desc: "低い姿勢でのディフェンス時の足首のホールド安定。" }
        ]
    },
    rugby: {
        name: "ラグビー",
        desc: "コンタクト衝撃に耐えるコア（腹圧）と首元の保護",
        points: [
            { x: 85, y: 200, name: "腹横筋起始部 (右)", desc: "インナーユニットを活性化し、コンタクト衝撃に耐える強い腹圧を構築。" },
            { x: 115, y: 200, name: "腹横筋起始部 (左)", desc: "インナーユニットを活性化し、コンタクト衝撃に耐える強い腹圧を構築。" },
            { x: 90, y: 250, name: "脊柱起立筋起始部 (右)", desc: "タックル・スクラム時に腰椎を支える低姿勢での耐久力向上。" },
            { x: 110, y: 250, name: "脊柱起立筋起始部 (左)", desc: "タックル・スクラム時に腰椎を支える低姿勢での耐久力向上。" },
            { x: 85, y: 90, name: "僧帽筋起始部 (右)", desc: "耳の後ろ（上項線）。頭部・頚部のブレを最小限にし脳震盪リスク低減。" },
            { x: 115, y: 90, name: "僧帽筋起始部 (左)", desc: "耳の後ろ（上項線）。頭部・頚部のブレを最小限にし脳震盪リスク低減。" }
        ]
    },
    swimming: {
        name: "水泳",
        desc: "ストリームライン（一直線姿勢）の維持とストローク効率の向上",
        points: [
            { x: 80, y: 110, name: "鎖骨下周囲 (右)", desc: "広背筋・小胸筋を緩め、水面をキャッチする際の腕のスムーズな回旋。" },
            { x: 120, y: 110, name: "鎖骨下周囲 (左)", desc: "広背筋・小胸筋を緩め、水面をキャッチする際の腕のスムーズな回旋。" },
            { x: 85, y: 200, name: "腹横筋起始部 (右)", desc: "水中での腰の反り（下垂）を防ぎ、一直線のキック姿勢をキープ。" },
            { x: 115, y: 200, name: "腹横筋起始部 (left)", desc: "水中での腰の反り（下垂）を防ぎ、一直線のキック姿勢をキープ。" },
            { x: 85, y: 130, name: "棘上筋・棘下筋起始部 (右)", desc: "肩甲骨周辺。プル動作における肩甲骨の協調性向上。" },
            { x: 115, y: 130, name: "棘上筋・棘下筋起始部 (左)", desc: "肩甲骨周辺。プル動作における肩甲骨の協調性向上。" }
        ]
    },
    volleyball: {
        name: "バレーボール",
        desc: "スパイクスイングスピードの向上と着地によるジャンパー膝予防",
        points: [
            { x: 80, y: 260, name: "大殿筋起始部 (右)", desc: "助走から跳躍へ変換する股関節爆発力向上。" },
            { x: 120, y: 260, name: "大殿筋起始部 (左)", desc: "助走から跳躍へ変換する股関節爆発力向上。" },
            { x: 80, y: 110, name: "鎖骨下周囲 (右)", desc: "スパイクテイクバック時の胸郭のしなりと腕の引き込み。" },
            { x: 120, y: 110, name: "鎖骨下周囲 (左)", desc: "スパイクテイクバック時の胸郭のしなりと腕の引き込み。" },
            { x: 75, y: 290, name: "膝蓋骨周囲 (右)", desc: "ジャンパー膝の予防。着地時の急激な膝蓋腱のテンション緩和。" },
            { x: 125, y: 290, name: "膝蓋骨周囲 (左)", desc: "ジャンパー膝の予防。着地時の急激な膝蓋腱のテンション緩和。" }
        ]
    },
    badminton: {
        name: "バドミントン",
        desc: "フットワークの急ストップ時の安定とリストターンの障害予防",
        points: [
            { x: 75, y: 320, name: "前脛骨筋起始部 (右)", desc: "シャトルを拾う最後の一歩の大きな踏み込みと切り返し。" },
            { x: 125, y: 320, name: "前脛骨筋起始部 (左)", desc: "シャトルを拾う最後の一歩の大きな踏み込みと切り返し。" },
            { x: 80, y: 110, name: "鎖骨下周囲 (右)", desc: "背面のテンションを緩め、高い打点からのスマッシュ胸郭確保。" },
            { x: 120, y: 110, name: "鎖骨下周囲 (左)", desc: "背面のテンションを緩め、高い打点からのスマッシュ胸郭確保。" },
            { x: 60, y: 150, name: "外側上顆周囲 (右)", desc: "高速フリックによるラケット肘の疲労対策。" },
            { x: 140, y: 150, name: "外側上顆周囲 (左)", desc: "高速フリックによるラケット肘の疲労対策。" }
        ]
    },
    tabletennis: {
        name: "卓球",
        desc: "微小ステップ時の敏捷性と手首のミリ単位コントロール",
        points: [
            { x: 75, y: 320, name: "前脛骨筋起始部 (右)", desc: "ラリー中の細かく激しい前後左右の重心移動をアシスト。" },
            { x: 125, y: 320, name: "前脛骨筋起始部 (左)", desc: "ラリー中の細かく激しい前後左右の重心移動をアシスト。" },
            { x: 65, y: 190, name: "手関節背側 (右)", desc: "手首の精緻なラケット面調整と、チキータ・ドライブ打球精度。" },
            { x: 135, y: 190, name: "手関節背側 (左)", desc: "手首の精緻なラケット面調整と、チキータ・ドライブ打球精度。" },
            { x: 85, y: 215, name: "傍脊柱筋 胸腰移行部 (右)", desc: "低く構える前傾姿勢の維持と腰部痛の緩和。" },
            { x: 115, y: 215, name: "傍脊柱筋 胸腰移行部 (左)", desc: "低く構える前傾姿勢の維持と腰部痛の緩和。" }
        ]
    },
    judo: {
        name: "柔道",
        desc: "グラウンディング（踏ん張り）の強化と引き込み握力の維持",
        points: [
            { x: 85, y: 230, name: "多裂筋・傍脊柱筋 (右)", desc: "相手の引きに耐え、軸を通すための背面コアの強化。" },
            { x: 115, y: 230, name: "多裂筋・傍脊柱筋 (左)", desc: "相手の引きに耐え、軸を通すための背面コアの強化。" },
            { x: 85, y: 200, name: "大腿動脈拍動部 (右)", desc: "鼠径部。腰を落とす姿勢での下肢血流低下・疲労の緩和。" },
            { x: 115, y: 200, name: "大腿動脈拍動部 (左)", desc: "鼠径部。腰を落とす姿勢での下肢血流低下・疲労の緩和。" },
            { x: 62, y: 170, name: "前腕屈筋群 (右)", desc: "道着を強力にホールドする掴み手の握力持久。" },
            { x: 138, y: 170, name: "前腕屈筋群 (左)", desc: "道着を強力にホールドする掴み手の握力持久。" }
        ]
    },
    handball: {
        name: "ハンドボール",
        desc: "空中の接触衝撃に耐える空中バランスとシュート可動域",
        points: [
            { x: 85, y: 200, name: "腹横筋起始部 (右)", desc: "空中シュート時に相手と接触してもブレない軸の確保。" },
            { x: 115, y: 200, name: "腹横筋起始部 (左)", desc: "空中シュート時に相手と接触してもブレない軸の確保。" },
            { x: 80, y: 110, name: "鎖骨下周囲 (右)", desc: "キャッチ・シュートにおける肩甲胸郭関節の回旋リリース。" },
            { x: 120, y: 110, name: "鎖骨下周囲 (左)", desc: "キャッチ・シュートにおける肩甲胸郭関節 of 回旋リリース。" },
            { x: 75, y: 320, name: "前脛骨筋起始部 (右)", desc: "激しいストップ＆ゴーに対応する足首コントロール。" },
            { x: 125, y: 320, name: "前脛骨筋起始部 (左)", desc: "激しいストップ＆ゴーに対応する足首コントロール。" }
        ]
    },
    // Minor Sports moved to the end
    figureskating: {
        name: "フィギュアスケート [後半プロトコル]",
        desc: "ジャンプ着氷時の目線のブレ抑制、スピン時の軸の安定",
        points: [
            { x: 100, y: 90, name: "後頚部 (第2-3頚椎間)", desc: "頭部・眼球の協調運動を司る後頭下筋群をリリースし、着氷時の平衡感覚を即時再起動。" },
            { x: 90, y: 230, name: "多裂筋起始部 (右)", desc: "スピンやスパイラル姿勢の維持に必要な、深層体幹の極小のコントロール。" },
            { x: 110, y: 230, name: "多裂筋起始部 (左)", desc: "スピンやスパイラル姿勢の維持に必要な、深層体幹の極小のコントロール。" },
            { x: 80, y: 260, name: "大殿筋起始部 (右)", desc: "片足滑走（スケーティング）時の骨盤の水平アライメント維持。" },
            { x: 120, y: 260, name: "大殿筋起始部 (左)", desc: "片足滑走（スケーティング）時の骨盤の水平アライメント維持。" }
        ]
    },
    ballet: {
        name: "バレエ [後半プロトコル]",
        desc: "つま先立ち（ルルベ）時の軸ブレ軽減、ターンアウト可動域向上",
        points: [
            { x: 75, y: 320, name: "前脛骨筋起始部 (右)", desc: "ポワント・ルルベ時の足関節・足根骨アライメントの安定。" },
            { x: 125, y: 320, name: "前脛骨筋起始部 (左)", desc: "ポワント・ルルベ時の足関節・足根骨アライメントの安定。" },
            { x: 90, y: 200, name: "腸腰筋起始部 (右)", desc: "脚を高くキープする（アラベスクなど）際、腰椎代償反りを防ぐ。" },
            { x: 110, y: 200, name: "腸腰筋起始部 (左)", desc: "脚を高くキープする（アラベスクなど）際、腰椎代償反りを防ぐ。" },
            { x: 85, y: 220, name: "傍脊柱筋 (右)", desc: "背中のしなやかな引き上げと、アンオー時の姿勢維持。" },
            { x: 115, y: 220, name: "傍脊柱筋 (左)", desc: "背中のしなやかな引き上げと、アンオー時の姿勢維持。" }
        ]
    },
    dance: {
        name: "ダンス [後半プロトコル]",
        desc: "アイソレーション可動域の拡大とフットワークのキレ向上",
        points: [
            { x: 80, y: 110, name: "鎖骨下周囲 (右)", desc: "胸・肩の独立した動き（アイソレーション）の可動制限解除。" },
            { x: 120, y: 110, name: "鎖骨下周囲 (左)", desc: "胸・肩の独立した動き（アイソレーション）の可動制限解除。" },
            { x: 85, y: 220, name: "胸腰椎移行部 T12-L1 (右)", desc: "上下の運動連動性を高め、アップ・ダウンステップのバネを出す。" },
            { x: 115, y: 220, name: "胸腰椎移行部 T12-L1 (左)", desc: "上下の運動連動性を高め、アップ・ダウンステップのバネを出す。" },
            { x: 85, y: 270, name: "上殿皮神経周囲 (右)", desc: "骨盤の逃げを防ぎ、フロアワーク時の接地安定感をサポート。" },
            { x: 115, y: 270, name: "上殿皮神経周囲 (左)", desc: "骨盤の逃げを防ぎ、フロアワーク時の接地安定感をサポート。" }
        ]
    }
};

// 3. Symptoms Mapping Data
const SYMPTOMS_MAPPING = {
    shoulder_stiff: {
        name: "肩こり・首の張り",
        desc: "デスクワークによる巻き肩・頚部交感神経緊張をリリース",
        points: [
            { x: 100, y: 90, name: "後頚部 (C2-C3棘突起間)", desc: "頭を前に倒した時の陥凹部。頚部交感神経を抑制し筋緊張緩和。" },
            { x: 90, y: 120, name: "肩甲間部 (Th3-Th4レベル)", desc: "胸椎棘突起間。肩甲骨の位置アライメントを正常化。" },
            { x: 110, y: 120, name: "肩甲間部 (Th3-Th4レベル)", desc: "胸椎棘突起間。肩甲骨の位置アライメントを正常化。" },
            { x: 85, y: 95, name: "僧帽筋起始部 (右)", desc: "耳の後ろ（乳様突起下）。肩の挙上トーンを引き下げる。" },
            { x: 115, y: 95, name: "僧帽筋起始部 (左)", desc: "耳の後ろ（乳様突起下）。肩の挙上トーンを引き下げる。" }
        ]
    },
    back_pain: {
        name: "腰痛・腰の張り",
        desc: "体幹深層筋を活性化し、腰背部にかかる不要な代償緊張をリセット",
        points: [
            { x: 85, y: 220, name: "胸腰椎移行部 (右)", desc: "多裂筋・胸最長筋を活性化し腰部のアライメント修正。" },
            { x: 115, y: 220, name: "胸腰椎移行部 (左)", desc: "多裂筋・胸最長筋を活性化し腰部のアライメント修正。" },
            { x: 75, y: 235, name: "腰方形筋 (QL) 周囲 (右)", desc: "第12肋骨と腸骨の間。腰の側屈・回旋時の痛みを緩和。" },
            { x: 125, y: 235, name: "腰方形筋 (QL) 周囲 (左)", desc: "第12肋骨と腸骨の間。腰の側屈・回旋時の痛みを緩和。" },
            { x: 90, y: 200, name: "腸腰筋起始部 (右)", desc: "お腹の深い部分。最深層からの感覚入力で前屈姿勢を改善。" },
            { x: 110, y: 200, name: "腸腰筋起始部 (左)", desc: "お腹の深い部分。最深層からの感覚入力で前屈姿勢を改善。" }
        ]
    },
    sciatica: {
        name: "坐骨神経痛様・脚のしびれ",
        desc: "神経絞扼（こうやく）部位周囲へ感覚刺激を送り、滑動性と血行を促進",
        points: [
            { x: 85, y: 270, name: "上殿皮神経・梨状筋部 (右)", desc: "お尻の外側上部。殿部から太ももにかけてのつっぱり感を軽減。" },
            { x: 115, y: 270, name: "上殿皮神経・梨状筋部 (左)", desc: "お尻の外側上部。殿部から太ももにかけてのつっぱり感を軽減。" },
            { x: 90, y: 245, name: "脊髄神経出口付近 (右)", desc: "腰椎の椎間孔付近。脊髄神経根の滑りを促し痛みをブロック。" },
            { x: 110, y: 245, name: "脊髄神経出口付近 (左)", desc: "腰椎の椎間孔付近。脊髄神経根の滑りを促し痛みをブロック。" },
            { x: 75, y: 310, name: "総腓骨神経走向 (右)", desc: "膝の外側・腓骨頭下。足首のしびれ・ふらつきを改善。" },
            { x: 125, y: 310, name: "総腓骨神経走向 (左)", desc: "膝の外側・腓骨頭下。足首のしびれ・ふらつきを改善。" }
        ]
    }
};

// 4. View Control & Navigation
function switchView(viewId) {
    appState.currentView = viewId;
    
    // Hide all views, display targeted
    document.querySelectorAll('.app-view').forEach(view => {
        view.classList.remove('active');
    });
    const targetView = document.getElementById(`view-${viewId}`);
    if (targetView) targetView.classList.add('active');

    // Update bottom nav active state
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    const activeNav = document.getElementById(`nav-${viewId}`);
    if (activeNav) activeNav.classList.add('active');

    // Handle special view initializations
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
    const data = SPORTS_MAPPING[sportKey];
    document.getElementById('mappingTitle').textContent = data.name;
    document.getElementById('mappingDescription').textContent = data.desc;
    renderMappingInteractive(data.points);
}

function loadSymptomMapping(symptomKey) {
    appState.selectedSymptom = symptomKey;
    const data = SYMPTOMS_MAPPING[symptomKey];
    document.getElementById('mappingTitle').textContent = data.name;
    document.getElementById('mappingDescription').textContent = data.desc;
    renderMappingInteractive(data.points);
}

function renderMappingInteractive(points) {
    // 1. Draw SVG dots
    const svg = document.getElementById('bodySvg');
    
    // Clear old dynamically generated dots
    document.querySelectorAll('.body-svg .map-dot').forEach(el => el.remove());
    
    points.forEach((pt, index) => {
        let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", pt.x);
        circle.setAttribute("cy", pt.y);
        circle.setAttribute("r", "6");
        circle.setAttribute("class", `map-dot dot-${index} ${index === appState.activeDotIndex ? 'active' : ''}`);
        circle.setAttribute("onclick", `selectPoint(${index})`);
        svg.appendChild(circle);
    });

    // 2. Draw lists
    const listContainer = document.getElementById('targetPointList');
    listContainer.innerHTML = '';
    
    points.forEach((pt, index) => {
        let card = document.createElement('div');
        card.className = `target-point-item item-${index} ${index === appState.activeDotIndex ? 'active' : ''}`;
        card.setAttribute("onclick", `selectPoint(${index})`);
        card.innerHTML = `
            <h4><span class="dot-number">${index + 1}</span> ${pt.name}</h4>
            <p>${pt.desc}</p>
        `;
        listContainer.appendChild(card);
    });
}

function selectPoint(index) {
    appState.activeDotIndex = index;
    
    // Update SVG active classes
    document.querySelectorAll('.map-dot').forEach((el, idx) => {
        if (idx === index) el.classList.add('active');
        else el.classList.remove('active');
    });

    // Update List active classes
    document.querySelectorAll('.target-point-item').forEach((el, idx) => {
        if (idx === index) {
            el.classList.add('active');
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            el.classList.remove('active');
        }
    });
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

    // Calculations
    const romChange = (((postRom - preRom) / preRom) * 100).toFixed(1);
    const balChange = (((postBal - preBal) / preBal) * 100).toFixed(1);

    // Update Result UI
    document.getElementById('resPreRom').textContent = `${preRom}°`;
    document.getElementById('resPostRom').textContent = `${postRom}°`;
    document.getElementById('resRomChange').textContent = `${romChange > 0 ? '+' : ''}${romChange}%`;
    
    document.getElementById('resPreBal').textContent = `${preBal}秒`;
    document.getElementById('resPostBal').textContent = `${postBal}秒`;
    document.getElementById('resBalChange').textContent = `${balChange > 0 ? '+' : ''}${balChange}%`;

    // Deduct stock (e.g. 6 rings used)
    const usedRings = 6;
    deductRings(usedRings);

    // Save to history
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
        showToast(`警告: シールの残数が少なくなっています (${appState.ringStock}枚)。追加購入を検討してください。`);
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
    
    // Result step details
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

// 8. Photo Camera Overlay & Comparison (ROM comparison)
function startCamera(stage) {
    appState.cameraStage = stage;
    const modal = document.getElementById('cameraModal');
    const webcam = document.getElementById('webcam');
    const overlayImg = document.getElementById('transparencyOverlayImg');
    const transControl = document.getElementById('transparencyControl');
    const titleEl = document.getElementById('cameraTitle');
    
    titleEl.textContent = stage === 'pre' ? 'プレテスト（貼る前）前屈の撮影' : 'ポストテスト（貼った後）重ね合わせ撮影';
    modal.style.display = 'flex';

    // Enable transparency slider only on Post stage
    if (stage === 'post' && appState.prePhotoData) {
        overlayImg.src = appState.prePhotoData;
        overlayImg.style.display = 'block';
        transControl.style.display = 'flex';
        adjustOverlayTransparency(50);
    } else {
        overlayImg.style.display = 'none';
        transControl.style.display = 'none';
    }

    // Connect Webcam
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
            webcam.srcObject = stream;
        })
        .catch(err => {
            console.error("Webcam error:", err);
            // Fallback for demo
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
        // Fallback snap
        simulateCameraSnapshotFallback(appState.cameraStage);
    }
    
    closeCamera();
}

function simulateCameraSnapshotFallback(stage) {
    // Generate dummy colored block representation for snapshot
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

    // Sort descending
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
    updateStockUI(0);
    switchView('home');
});
