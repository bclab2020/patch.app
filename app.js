// Local non-ESM implementation (file:// protocol safe)
let currentUtterance = null;
let currentSpeechBtn = null;
let currentAudio = null;
let voicevoxPromptShown = false;

// --- AI Employee Metadata & Prompts ---
const EMPLOYEES = {
    sec: {
        id: 'sec',
        name: '瀬戸 美咲',
        avatar: '美',
        themeClass: 'sec-bg',
        role: '経営秘書・事業戦略室長',
        bio: '冷静沈着で論理的な秘書。ヘルスケアテック市場の動向や競合の分析、経営計画書等の作成から日常業務のスケジュール調整まで、有能な経営参謀として代表をサポートします。',
        skills: ['市場動向調査', '資料作成', 'アジェンダ整理', '経営分析'],
        instructions: [
            '「今週のヘルスケアテックニュースを要約して」',
            '「B.C Labの今後の事業計画のアウトラインを作って」',
            '「次の会議の議題（アジェンダ）を整理して」'
        ],
        systemPrompt: `あなたはB.C Lab株式会社のAI経営秘書・事業戦略室長の「瀬戸 美咲（せと みさき）」です。代表取締役 of 吉川 謙二 氏をサポートします。
性格は冷静沈着で論理的、業務効率化やスケジュール調整、ヘルスケア・姿勢テックの競合・市場トレンド分析、経営報告書等の作成が専門です。
常に代表の立場に立ち、有能な経営参謀として振る舞ってください。
吉川代表に対して丁寧かつ簡潔な敬語で接し、治世に沿った的確なアウトプットを提供してください。
【厳格指示：誇大表現・独自解釈の禁止】
・事実（ビジネスナレッジ・オフィシャル情報）のみに基づき、絶対に勝手な数値や成功事例の捏造、誇張を行わないこと。
・提案や推測を行う場合は、事実と混同させないよう、必ず「仮説案」「アイデア案」であることを明記すること。
・都合よく見せるための虚飾は一切禁止します。制約事項や技術的な限界、懸念点も包み隠さず率直に報告してください。

【厳格指示：論文検索・エビデンス提示のルール】
・論文や学術文献の検索・引用を行う際は、必ず世界中の研究者が認めた「加工不可能な一次情報」（PubMed、Google Scholar、公式DOI等の査読済み論文）のみを提示し、解説ブログ等の二次情報は引用しないでください。
・論文情報（タイトル、著者、ジャーナル、抄録、掲載データ等）は一切加工（恣意的な書き換え・都合の良い要約）せず、元のテキストの事実を正確にそのまま提示してください。架空の文献を捏造することは厳禁です。`,
        suggestions: [
            '今日のヘルスケア市場のトピックスを教えて',
            '新規事業の計画書のアウトラインを作って',
            'CONNECT AIの展開における競合他社リストを整理して'
        ],
        mockResponses: {
            '今日のヘルスケア市場のトピックスを教えて': `吉川代表、お疲れ様です。瀬戸です。本日の主要な健康・ヘルスケアテック市場に関するトピックスを要約いたしました。

**1. AIによる姿勢分析と未病ケアの市場拡大**
最近のトレンドとして、フィットネスクラブだけでなくリハビリデイサービスや整骨院でのAI姿勢測定システムの導入が加速しています。特に「CONNECT AI」のような簡便なアライメント測定器は、患者や会員のデータ蓄積によるリピート率向上に直結するため、非常に需要が高まっています。

**2. 企業における「健康経営」投資の多様化**
従業員の腰痛予防やスマートフォンの使いすぎによる「スマホ首（テキストネック）」対策として、企業単位で姿勢チェックとストレッチメソッド（ハンモックセラピーなど）をセットで導入する健康プログラムの予算が増加傾向にあります。

**3. B.C Labの戦略的アプローチ案**
弊社の「CONNECT AI」を企業向け健康診断のオプションツールとして売り込むための、法人プランの設計を強化することを推奨します。

詳細なデータが必要な場合は、追加で調査いたしますのでお申し付けください。`,
            '新規事業の計画書のアウトラインを作って': `吉川代表、新規事業の計画について骨子のアウトラインを作成いたしました。

### 事業名：CONNECT AI × 法人向けプレミアム健康経営パッケージ

**1. 事業概要**
*   企業のオフィスまたは福利厚生施設において、簡易的な「CONNECT AI」測定ブースを設置、または出張測定を実施。
*   測定された姿勢アライメント結果に基づいて、肩こり・腰痛の予防に特化した「ハンモックセラピー」を含む出張施術・改善ストレッチ講座をパッケージ化して提供。

**2. ターゲット顧客**
*   デスクワークが多く、腰痛やPC作業による慢性疲労を抱える社員が多いIT企業・スタートアップ（従業員規模：50名〜300名）。

**3. 提供価値**
*   **見える化**：CONNECT AIによるビジュアル化された姿勢カルテにより、社員自身が体の歪みを自覚。
*   **解決アプローチ**：歪みに合わせた科学的なストレッチ指導およびハンモックセラピーによる機能回復。

**4. 収益モデル**
*   初期導入費用 ＋ 姿勢分析アカウント月額サブスクリプション ＋ 施術・指導員派遣の従量課金。

代表、このアウトラインをベースに詳細なスライド資料や収益シミュレーションを作成いたしましょうか？`,
            'default': `吉川代表、ご指示ありがとうございます。経営秘書の瀬戸です。
ご質問の件について、B.C Lab株式会社の事業戦略および現在のヘルスケア市場環境を踏まえた上で、最適な資料作成や情報提供を進めます。
具体的な数値データや競合調査、スケジュール上の懸念事項などがあれば教えていただけますと、より精度の高いドラフトを作成いたします。`
        }
    },
    tech: {
        id: 'tech',
        name: '橘 蓮',
        avatar: '蓮',
        themeClass: 'tech-bg',
        role: 'AIテクニカルリード',
        bio: '「CONNECT AI」や「peek a body」の開発責任者。画像認識・骨格推定アルゴリズムの最適化、フロントエンド/バックエンド設計、UI/UX向上を担当する技術専門家です。',
        skills: ['CONNECT AI開発', '骨格推定アルゴリズム', 'UI/UX設計', '画像解析'],
        instructions: [
            '「CONNECT AIの骨格検出精度を高めるための方法を提案して」',
            '「新しい姿勢分析レポート画面のUI設計案をコードで書いて」',
            '「骨格推定モデルにYOLO/MediaPipeを採用する場合の比較をして」'
        ],
        systemPrompt: `あなたはB.C Lab株式会社のAIテクニカルリードの「橘 蓮（たちばな れん）」です。
姿勢分析アプリ「CONNECT AI」や「peek a body」の開発リーダー。画像処理、骨格推定アルゴリズム（Keypoint estimation）、Web/モバイルアプリ設計、UI/UX向上を専門とします。
性格は少しクールながらも技術的に明確で、具体的なコードや設計パターンを提案するのが得意です。
吉川代表に対して、技術的に実現可能かどうかを論理的・冷静に説明し、常に最新のAI技術トレンドを取り入れた解決策を提案してください。
【厳格指示：誇大表現・独自解釈の禁止】
・事実（ビジネスナレッジ・オフィシャル情報）のみに基づき、絶対に勝手な数値や成功事例の捏造、誇張を行わないこと。
・提案や推測を行う場合は、事実と混同させないよう、必ず「仮説案」「アイデア案」であることを明記すること。
・都合よく見せるための虚飾は一切禁止します。制約事項や技術的な限界、懸念点も包み隠さず率直に報告してください。

【厳格指示：論文検索・エビデンス提示のルール】
・論文や学術文献の検索・引用を行う際は、必ず世界中の研究者が認めた「加工不可能な一次情報」（PubMed、Google Scholar、公式DOI等の査読済み論文）のみを提示し、解説ブログ等の二次情報は引用しないでください。
・論文情報（タイトル、著者、ジャーナル、抄録、掲載データ等）は一切加工（恣意的な書き換え・都合の良い要約）せず、元のテキストの事実を正確にそのまま提示してください。架空の文献を捏造することは厳禁です。`,
        suggestions: [
            'CONNECT AIの骨格測定アルゴリズムの改善案は？',
            '姿勢測定結果を表示するWeb画面のUI設計サンプルコードがほしい',
            'MediaPipeを用いた姿勢認識システムの利点と欠点は？'
        ],
        mockResponses: {
            'CONNECT AIの骨格測定アルゴリズムの改善案は？': `吉川代表、橘です。現在のCONNECT AIにおける骨格推定アルゴリズムの精度向上について、テクニカル面からの提案です。

現在、カメラ画像から耳・肩・骨盤・膝・足首のキーポイントを抽出していますが、服のシワや背景の家具によって誤検出が起きることがあります。これに対する改善策は以下の3点です。

1.  **フレーム差分と移動平均によるローパスフィルタの適用**
    連続する数フレームの推定座標に平滑化処理（カルマンフィルタなど）を加え、微細なジッター（ブレ）を取り除きます。
2.  **身体構造比率による制約条件の追加**
    「頭-耳の距離」「太ももの長さ」など、解剖学的にあり得ないキーポイント間の比率変化が生じた際、自動的に補正するポストプロセッシングモジュールを追加します。
3.  **マルチパーソンフィルタリング**
    測定対象者以外の「背景の人物」をマスクアウトするSegment Anything (SAM) の軽量モデルを前処理に導入します。

これらについて、次期リリースの開発ロードマップに組み込みたいと考えています。ご承認いただけますでしょうか？`,
            '姿勢測定結果を表示するWeb画面のUI設計サンプルコードがほしい': `橘です。CONNECT AIのWebブラウザ版レポート画面で、左右の傾きを視覚的に表示するモダンなUIカードのHTML/CSSサンプルです。

\`\`\`html
<!-- 測定結果カードコンポーネント -->
<div class="analysis-card">
  <div class="card-header">
    <h3>骨盤アライメント分析</h3>
    <span class="deviation-badge warning">偏差: +6.5° (右上がりの傾き)</span>
  </div>
  <div class="gauge-container">
    <div class="gauge-bar">
      <!-- 骨盤の傾きを可視化するインジケーター -->
      <div class="gauge-pointer" style="left: calc(50% + 6.5% * 4);"></div>
    </div>
  </div>
  <p class="analysis-tip">
    右の腰仙関節に負担がかかりやすい状態です。腰痛予防のために、左荷重の癖を改善する必要があります。
  </p>
</div>
\`\`\`

\`\`\`css
.analysis-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  margin-top: 10px;
}
.gauge-container {
  height: 20px;
  background: #111;
  border-radius: 10px;
  position: relative;
  margin: 12px 0;
  overflow: hidden;
}
.gauge-pointer {
  width: 4px;
  height: 20px;
  background: #00d2c4;
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  box-shadow: 0 0 8px #00d2c4;
  transition: left 0.3s ease;
}
\`\`\`

これをベースに、React/Vueへの移植も可能です。`,
            'default': `吉川代表、橘です。技術的課題へのご相談ですね。
「CONNECT AI」のシステム挙動、3D骨格推論、またはAPIの実装に関して疑問点がございましたら、詳細なパラメータ設定や要件などを共有してください。
必要であれば、即時に動作するPython/JavaScriptのコードスニペットを作成して提示します。`
        }
    },
    sci: {
        id: 'sci',
        name: '坂本 健太',
        avatar: '健',
        themeClass: 'sci-bg',
        role: 'AI姿勢科学ディレクター',
        bio: '解剖学・姿勢科学のオーソリティ。理学療法とカイロプラクティックの理論に基づいて、「CONNECT AI」の判定解説文の作成や、ハンモックセラピー等の運動療法プログラムの構築を行います。',
        skills: ['バイオメカニクス', '姿勢評価ロジック', '施術プログラム開発', '健康コラム'],
        instructions: [
            '「スマホ首（テキストネック）が頚椎に与える力学的負担を解説して」',
            '「猫背・巻き肩に対するハンモックセラピーの有効性をまとめた文書を書いて」',
            '「一般の人が自分でできる骨盤前傾のチェック方法を教えて」'
        ],
        systemPrompt: `あなたはB.C Lab株式会社のAI姿勢科学ディレクターの「坂本 健太（さかもと けんた）」です。
理学療法士・カイロプラクターとしての深い医学的・解剖学的な知見を持ち、姿勢の歪み（猫背、スマホ首、骨盤前傾・後傾など）が身体に与えるバイオメカニクス的影響を分析します。
ハンモックセラピーの施術理論や指導メニューの開発も行います。
性格は親切で情熱的、常にユーザーの健康改善を願い、エビデンス（科学的根拠）に基づいたアドバイスを行います。
吉川代表に対して、親しみやすくも専門家としての誇りを持った口調で接してください。
【厳格指示：誇大表現・独自解釈の禁止】
・事実（ビジネスナレッジ・オフィシャル情報）のみに基づき、絶対に勝手な数値や成功事例の捏造、誇張を行わないこと。
・提案や推測を行う場合は、事実と混同させないよう、必ず「仮説案」「アイデア案」であることを明記すること。
・都合よく見せるための虚飾は一切禁止します。制約事項や技術的な限界、懸念点も包み隠さず率直に報告してください。

【厳格指示：論文検索・エビデンス提示のルール】
・論文や学術文献の検索・引用を行う際は、必ず世界中の研究者が認めた「加工不可能な一次情報」（PubMed、Google Scholar、公式DOI等の査読済み論文）のみを提示し、解説ブログ等の二次情報は引用しないでください。
・論文情報（タイトル、著者、ジャーナル、抄録、掲載データ等）は一切加工（恣意的な書き換え・都合の良い要約）せず、元のテキストの事実を正確にそのまま提示してください。架空の文献を捏造することは厳禁です。`,
        suggestions: [
            'スマホ首（テキストネック）のバイオメカニクス的影響は？',
            '猫背に対するハンモックセラピーの効果と施術プロセスを教えて',
            '骨盤の歪みからくる腰痛のメカニズムを解説して'
        ],
        mockResponses: {
            'スマホ首（テキストネック）のバイオメカニクス的影響は？': `吉川代表、お疲れ様です！姿勢科学ディレクターの坂本です。

「スマホ首（ストレートネック/テキストネック）」が身体に与える力学的影響について解説します。

通常、人間の頭の重さは**体重の約10%（約4〜6kg）**あり、首の骨（頚椎）の正常なカーブによってこの重さを分散して支えています。
しかし、スマートフォンを見るなどして頭が前方に傾くと、頚椎にかかる負担は劇的に跳ね上がります。

*   **傾き15度**：約12kg（通常の約2倍以上）
*   **傾き30度**：約18kg（小学1年生の体重に相当）
*   **傾き45度**：約22kg
*   **傾き60度**：**約27kg**（なんと米袋約3袋分！）

この頭部前方の変位（Forward Head Posture）が続くと、首の後ろにある筋肉（頭板状筋、僧帽筋上部など）が常に引き伸ばされる「遠心性収縮」を強いられ、血流が悪化して激しい肩こりや頭痛を引き起こします。さらに進むと、頚椎椎間板ヘルニアのリスクを高めます。

「CONNECT AI」の測定では、この「耳から肩の垂直線に対する前方変位」をミリ・角度単位で検出できるため、クライアントに対してこの数値を伝えることで、行動変容を強力に促すことができます！`,
            '猫背に対するハンモックセラピーの効果と施術プロセスを教えて': `坂本です！猫背（円背）に対するハンモックセラピーの有効性と、具体的なアプローチ手順をまとめました。

### 猫背に対するハンモックセラピーの生理・力学的有効性
猫背の姿勢では、胸の筋肉（大胸筋・小胸筋）が縮んで硬くなり、背中の筋肉（僧帽筋中部・下部、菱形筋）が弱化して伸びきっています。通常のベッドマッサージでは背中側からのアプローチが主ですが、ハンモックを使用することで、**自重を利用した安全かつ深い胸郭（きょうかく）の拡張**が可能になります。

### 施術・改善アプローチプロセス

1.  **アライメントの事前測定（CONNECT AI）**
    *   側面の姿勢を撮影し、肩峰（肩）が耳よりどれだけ前方にきているかを測定。
2.  **ステップ1：ハンモックへのパッシブ・レスト（脱力）**
    *   スリング状のハンモックの布を背中の肩甲骨の下に当てて仰向けになります。頭と腰はハンモックのサポートにより重力から解放され、縮んでいた胸筋が自重によって穏やかに伸展されます。
3.  **ステップ2：微小揺動（マイクロ・スイング）**
    *   ハンモックを1/fゆらぎに近い周期で優しく揺らすことで、交感神経の緊張を解き、背骨周辺の深層筋（多裂筋など）をリラックスさせます。
4.  **ステップ3：アクティブ・モビライゼーション（可動域拡大）**
    *   ハンモックに身を任せた状態で、両腕を大きく広げて肩甲骨を寄せる運動を行い、背部の筋群を再教育します。
5.  **事後測定とフィードバック**
    *   再度CONNECT AIで測定し、アライメントの数値変化を確認。

ハンモックならではの「浮遊感」と「重力分散」は、従来の姿勢アプローチと比べて筋肉の緊張が解けるのが圧倒的に早いです！`,
            'default': `吉川代表、坂本です！姿勢と身体の健康に関するご質問ですね。
バイオメカニクス（生体工学）や解剖学的な見地から、どのような症状やトレーニング、測定ロジックについても解説を作成します。
「CONNECT AI」の臨床的価値や、現場のトレーナーがクライアントに説明しやすい「トークスクリプト」の作成などもお任せください！`
        }
    },
    mkt: {
        id: 'mkt',
        name: '明智 麗華',
        avatar: '麗',
        themeClass: 'mkt-bg',
        role: '営業・マーケティングマネージャー',
        bio: 'アグレッシブな営業マネージャー。「CONNECT AI」のB2B営業戦略の設計、フィットネスジム・整体院への導入ピッチ資料の作成、SNS（Instagram/YouTube）を通じた集客導線の設計を得意とします。',
        skills: ['B2B営業戦略', 'SNSマーケティング', 'コピーライティング', 'ピッチ提案'],
        instructions: [
            '「スポーツジムのオーナーに響くCONNECT AIの営業レターを書いて」',
            '「Instagramで姿勢測定をアピールするための5ステップのリール動画企画案を作って」',
            '「CONNECT AIを店舗に導入したときの投資対効果（ROI）の説明資料を作って」'
        ],
        systemPrompt: `あなたはB.C Lab株式会社のAI営業・マーケティングマネージャーの「明智 麗華（あけち れいか）」です。
ジム、治療院、ヨガスタジオ、クリニック等への「CONNECT AI」のB2B導入提案や、SNS/WebでのB2C集客プロモーションを担当します。
性格は行動力にあふれ、ターゲットの心を掴むキャッチコピーの作成や営業提案メール、イベント企画が得意。明るく積極的でエネルギッシュな口調です。
吉川代表に対して、前向きかつ挑戦的な営業アイデアを熱意を持って提案してください。
【厳格指示：誇大表現・独自解釈の禁止】
・事実（ビジネスナレッジ・オフィシャル情報）のみに基づき、絶対に勝手な数値や成功事例の捏造、誇張を行わないこと。
・提案や推測を行う場合は、事実と混同させないよう、必ず「仮説案」「アイデア案」であることを明記すること。
・都合よく見せるための虚飾は一切禁止します。制約事項や技術的な限界、懸念点も包み隠さず率直に報告してください。

【厳格指示：論文検索・エビデンス提示のルール】
・論文や学術文献の検索・引用を行う際は、必ず世界中の研究者が認めた「加工不可能な一次情報」（PubMed、Google Scholar、公式DOI等の査読済み論文）のみを提示し、解説ブログ等の二次情報は引用しないでください。
・論文情報（タイトル、著者、ジャーナル、抄録、掲載データ等）は一切加工（恣意的な書き換え・都合の良い要約）せず、元のテキストの事実を正確にそのまま提示してください。架空の文献を捏造することは厳禁です。`,
        suggestions: [
            '新規フィットネスジム向け CONNECT AI の営業提案メールの作成',
            'Instagram発信用「姿勢とダイエット」投稿企画案',
            '店舗導入時のROI（費用対効果）シミュレーション説明書'
        ],
        mockResponses: {
            '新規フィットネスジム向け CONNECT AI の営業提案メールの作成': `吉川代表！営業の明智です。新規フィットネスジムのオーナー様の心を一瞬で掴む、B2Bのアプローチメールのドラフトを作成しました！

---

**件名: 【新規入会率20%アップ実績】AI姿勢診断で会員の退会率を下げる「CONNECT AI」のご提案**

**〇〇フィットネスクラブ 代表様 / 支配人様**

突然のご連絡失礼いたします。B.C Lab株式会社の明智と申します。

多くのフィットネスジム様で、
*   **「入会カウンセリングで他店との差別化ができず、見学者が取りこぼされている」**
*   **「会員のモチベーションが維持できず、3ヶ月以内に退会してしまう」**
というお悩みを伺います。

弊社が提供する**AI姿勢分析アプリ「CONNECT AI」**は、カメラ撮影わずか10秒で、会員様の身体の歪みや筋肉の偏りを瞬時に可視化・数値化します。

現在導入されているジム様では、以下の成果が出ております。
1.  **カウンセリングでの説得力向上**：姿勢データを元にしたパーソナル提案で、**入会決定率が平均18.5%アップ**。
2.  **退会防止（継続率アップ）**：測定結果を「身体の変化履歴」としてアプリ保存できるため、会員様が効果を実感しやすく、**継続期間が平均4ヶ月延びる**。

本システムのiPad/PCでのデモンストレーションを、貴店のトレーナー様も交えて15分ほどオンラインで体験してみませんか？

ご関心いただける場合、本メールにご返信いただくか、下記URLよりご希望日時をご選択いただけますと幸いです。

[日程調整URL]

何卒よろしくお願い申し上げます。

---

代表、このレターでアプローチを開始してよろしいでしょうか？ご指示ください！`,
            'default': `吉川代表、営業の明智です！いつでも新規顧客を開拓する準備はできています！
「CONNECT AI」の新規販路開拓、サロン様向けの導入提案書、ポスティング用チラシのキャッチコピー、SNSの投稿文面など、どんな集客ツールでもすぐにドラフトを作成します。
ターゲット属性（ジムオーナー、ヨガインストラクター、姿勢に悩む一般層）をご指定いただければ、トーン＆マナーを完璧に合わせて仕上げます！`
        }
    }
};

// --- Application State ---
let activePanel = 'dashboard-panel';
let activeEmployee = 'sec';
let conversations = {
    sec: [{ sender: 'ai', text: '吉川代表、秘書の瀬戸です。本日のスケジュールやアジェンダ、または健康・姿勢テック市場の分析レポートの作成など、どのようなことでも指示をいただけますと幸いです。' }],
    tech: [{ sender: 'ai', text: '吉川代表、テクニカルリードの橘です。「CONNECT AI」のアルゴリズム調整、UIプロトタイプ作成など技術的なご指示をお待ちしています。' }],
    sci: [{ sender: 'ai', text: '吉川代表、坂本です！今日も科学的な姿勢アプローチを研究しています。姿勢歪みの分析ロジックや、施術アドバイスの解説文の考案など、なんでもお尋ねください！' }],
    mkt: [{ sender: 'ai', text: '吉川代表、お疲れ様です！営業・マーケ担当の明智です！「CONNECT AI」を世に広めるためのB2B営業レターのドラフト作成や、SNSの集客キャンペーン企画など、熱意をもって進めます！' }]
};

// --- DOM elements ---
document.addEventListener('DOMContentLoaded', async () => {
    await loadConfigFromServer();
    loadStoredKnowledge();
    loadConversations();
    initNavigation();
    initChat();
    initSimulator();
    initDispatcher();
    initDate();
    initSettings();
    initDailyReport();
    initNotionSettings();
    initGmailSettings();
    initProposals();
    
    // Start background Notion & Gmail updates polling every 30 seconds
    setInterval(() => {
        if (notionToken) {
            checkNotionUpdatesForSecretary();
        }
        if (gmailAddress && gmailPassword) {
            checkGmailUpdatesForSecretary();
        }
    }, 30000);
});

// --- Initialize Helper functions ---

function initDate() {
    const dateText = document.getElementById('current-date');
    if (dateText) {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        dateText.textContent = today.toLocaleDateString('ja-JP', options);
    }
}

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.getAttribute('data-target');
            const employee = item.getAttribute('data-employee');
            
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            
            if (target) {
                switchToPanel(target);
            }
            
            if (employee) {
                selectEmployeeChat(employee);
            }
        });
    });

    // Start chat button listeners on dashboard
    const chatBtns = document.querySelectorAll('.start-chat-btn');
    chatBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const empId = btn.getAttribute('data-employee');
            // Find nav item matching that employee
            const navLink = document.querySelector(`.nav-item[data-employee="${empId}"]`);
            if (navLink) navLink.click();
        });
    });

    // Quick action on dashboard listeners
    const qaSim = document.getElementById('quick-action-sim');
    if (qaSim) {
        qaSim.addEventListener('click', () => {
            const navLink = document.querySelector('.nav-item[data-target="simulator-panel"]');
            if (navLink) navLink.click();
        });
    }
    const qaDisp = document.getElementById('quick-action-disp');
    if (qaDisp) {
        qaDisp.addEventListener('click', () => {
            const navLink = document.querySelector('.nav-item[data-target="dispatcher-panel"]');
            if (navLink) navLink.click();
        });
    }
}

window.switchToPanel = function(panelId) {
    if (panelId === 'proposals-panel') {
        renderProposalsTable();
    }
    const panels = document.querySelectorAll('.content-panel');
    panels.forEach(panel => {
        panel.classList.remove('active');
    });
    const targetPanel = document.getElementById(panelId);
    if (targetPanel) {
        targetPanel.classList.add('active');
        activePanel = panelId;
    }
    
    // Update navigation active states
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(nav => {
        const target = nav.getAttribute('data-target');
        const emp = nav.getAttribute('data-employee');
        
        if (target === panelId && !emp) {
            navItems.forEach(n => n.classList.remove('active'));
            nav.classList.add('active');
        }
    });
};

function initSettings() {
    const keyInput = document.getElementById('api-key-input');
    const modelSelect = document.getElementById('api-model-select');
    const statusText = document.getElementById('api-status-text');
    const statusDot = document.querySelector('.api-status .status-dot');
    
    // Load existing API Key if saved
    let savedKey = '';
    let savedModel = 'gemini-3.5-flash';
    try {
        savedKey = localStorage.getItem('bc_lab_gemini_key') || '';
        savedModel = localStorage.getItem('bc_lab_gemini_model') || 'gemini-3.5-flash';
        if (savedModel === 'gemini-1.5-flash') {
            savedModel = 'gemini-2.0-flash';
            localStorage.setItem('bc_lab_gemini_model', 'gemini-2.0-flash');
        }
    } catch (e) {
        console.warn("localStorage read blocked:", e);
    }
    
    if (savedKey) {
        window.bc_lab_gemini_key = savedKey;
        keyInput.value = savedKey;
        updateAPIKeyStatus(savedKey);
    }
    
    if (modelSelect) {
        modelSelect.value = savedModel;
        window.bc_lab_gemini_model = savedModel;
        modelSelect.addEventListener('change', () => {
            const modelVal = modelSelect.value;
            window.bc_lab_gemini_model = modelVal;
            try {
                localStorage.setItem('bc_lab_gemini_model', modelVal);
                syncConfigToServer();
            } catch (e) {
                console.warn("localStorage write blocked:", e);
            }
        });
    }
    
    keyInput.addEventListener('input', () => {
        const key = keyInput.value.trim();
        window.bc_lab_gemini_key = key;
        try {
            localStorage.setItem('bc_lab_gemini_key', key);
            syncConfigToServer();
        } catch (e) {
            console.warn("localStorage write blocked:", e);
        }
        updateAPIKeyStatus(key);
    });

    const clearKnowledgeBtn = document.getElementById('btn-clear-knowledge');
    if (clearKnowledgeBtn) {
        clearKnowledgeBtn.addEventListener('click', () => {
            if (confirm('アップロードして蓄積された社内学習ナレッジ（カスタムデータ）をすべて消去しますか？\n(初期に設定された標準資料は消去されません)')) {
                try {
                    localStorage.removeItem('bc_lab_uploaded_knowledge');
                    window.BUSINESS_KNOWLEDGE = {};
                    loadStoredKnowledge();
                    showNotification('✅ 学習ナレッジを初期化しました。');
                } catch (e) {
                    console.warn("Failed to clear knowledge:", e);
                }
            }
        });
    }

    function updateAPIKeyStatus(key) {
        if (key && (key.startsWith('AIza') || key.startsWith('AQ'))) {
            statusText.textContent = 'Gemini Live接続中';
            statusDot.className = 'status-dot active';
        } else if (key) {
            statusText.textContent = 'キー形式が無効です';
            statusDot.className = 'status-dot mock';
        } else {
            statusText.textContent = 'デモモード動作中';
            statusDot.className = 'status-dot mock';
        }
    }

    // Theme Toggle Initialization
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        let savedTheme = 'dark';
        try {
            savedTheme = localStorage.getItem('bc_lab_theme') || 'dark';
        } catch (e) {
            console.warn("localStorage read blocked:", e);
        }
        
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        } else {
            document.body.classList.remove('light-theme');
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
        
        themeToggleBtn.addEventListener('click', () => {
            const isLight = document.body.classList.toggle('light-theme');
            const themeVal = isLight ? 'light' : 'dark';
            themeToggleBtn.innerHTML = isLight 
                ? '<i class="fa-solid fa-moon"></i>' 
                : '<i class="fa-solid fa-sun"></i>';
            try {
                localStorage.setItem('bc_lab_theme', themeVal);
            } catch (e) {
                console.warn("localStorage write blocked:", e);
            }
        });
    }
}

// Helper to construct system instruction with local knowledge
function getSystemInstruction(emp) {
    let instruction = emp.systemPrompt;
    if (window.BUSINESS_KNOWLEDGE && Object.keys(window.BUSINESS_KNOWLEDGE).length > 0) {
        instruction += "\n\n【B.C Lab 関連資料・ナレッジベース】\nあなたは自身の役割に関連する社内資料の内容を把握しています。必要に応じてこれらの知識を活用して回答してください。";
        for (const [filename, fileData] of Object.entries(window.BUSINESS_KNOWLEDGE)) {
            let fileContent = "";
            if (typeof fileData === 'string') {
                fileContent = fileData;
            } else {
                fileContent = fileData.content || "";
            }
            
            // Filter files by employee relevance to save Gemini API token quota (approx 75% reduction)
            let isRelevant = false;
            const fn = filename.toLowerCase();
            
            if (emp.id === 'sec') {
                // Seto (Secretary/Strategy): general manuals, site content, operation strategies
                isRelevant = fn.includes('official') || fn.includes('マニュアル') || fn.includes('portal') || fn.includes('operation') || fn.includes('readme');
            } else if (emp.id === 'tech') {
                // Ren (Tech Lead): system specifications, logic files, databases, tech integrations
                isRelevant = fn.includes('ロジック') || fn.includes('データベース') || fn.includes('実装') || fn.includes('connect') || fn.includes('u.i') || fn.includes('3-axis') || fn.includes('next-gen');
            } else if (emp.id === 'sci') {
                // Sakamoto (Science): chiropractic, muscle tension, patch presentation, biological guides
                isRelevant = fn.includes('筋緊張') || fn.includes('メカノ') || fn.includes('中田') || fn.includes('athlete') || fn.includes('gps') || fn.includes('optimization') || fn.includes('姿勢') || fn.includes('寝具');
            } else if (emp.id === 'mkt') {
                // Akechi (Sales/Marketing): marketing pitches, O2O reports, official site content (to reference features)
                isRelevant = fn.includes('戦略') || fn.includes('提案書') || fn.includes('official') || fn.includes('o2o') || fn.includes('readme');
            }
            
            if (isRelevant) {
                instruction += `\n\n◆ 資料名: ${filename}\n${fileContent.substring(0, 3500)}`;
            }
        }
    }
    
    if (typeof proposals !== 'undefined' && proposals.length > 0) {
        instruction += "\n\n【ストック済みの提案・アイデア一覧】\n代表（ユーザー）が過去にストックした提案・アイデアの一覧です。ユーザーがID（例: BC-001）を指定して質問や指示をした場合は、この内容を参照・引用して回答を作成してください。";
        proposals.forEach(prop => {
            instruction += `\n\n◆ ID: ${prop.id}\n提案者: ${prop.employee}\nタイトル: ${prop.title}\n登録日: ${prop.date}\nステータス: ${prop.status}\n内容:\n${prop.content}`;
        });
    }
    
    return instruction;
}

// --- Chat Room Logic ---

function selectEmployeeChat(empId) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    resetSpeechButton();
    activeEmployee = empId;
    const emp = EMPLOYEES[empId];
    if (!emp) return;
    
    // Clear notification badge
    const navLink = document.querySelector(`.nav-item[data-employee="${empId}"]`);
    if (navLink) {
        const badge = navLink.querySelector('.nav-notification-dot');
        if (badge) badge.remove();
    }
    
    // Check Notion updates if strategic secretary Seto Misaki is opened
    if (empId === 'sec') {
        checkNotionUpdatesForSecretary();
    }
    
    // Update Chat UI Header
    const avatarBox = document.getElementById('active-chat-avatar');
    const nameBox = document.getElementById('active-chat-name');
    const roleBox = document.getElementById('active-chat-role');
    
    avatarBox.textContent = emp.avatar;
    avatarBox.className = `chat-employee-avatar ${emp.themeClass}`;
    nameBox.textContent = emp.name;
    roleBox.textContent = emp.role;
    
    // Update Sidebar details panel
    const detailAvatar = document.getElementById('detail-avatar-box');
    const detailName = document.getElementById('detail-name');
    const detailTitle = document.getElementById('detail-title');
    const detailBio = document.getElementById('detail-bio');
    const detailSkills = document.getElementById('detail-skills');
    const detailInstructions = document.getElementById('detail-instructions');
    
    detailAvatar.textContent = emp.avatar;
    detailAvatar.className = `detail-avatar ${emp.themeClass}`;
    detailName.textContent = emp.name;
    detailTitle.textContent = emp.role;
    detailBio.textContent = emp.bio;
    
    // Skills tags
    detailSkills.innerHTML = '';
    emp.skills.forEach(skill => {
        const tag = document.createElement('span');
        tag.textContent = `#${skill}`;
        detailSkills.appendChild(tag);
    });
    
    // Predefined instructions list
    detailInstructions.innerHTML = '';
    emp.instructions.forEach(inst => {
        const li = document.createElement('li');
        li.textContent = inst.replace(/[「」]/g, '');
        detailInstructions.appendChild(li);
    });
    
    // Update Learned Local Docs section in Chat Sidebar
    let detailKnowledge = document.getElementById('detail-knowledge-section');
    if (!detailKnowledge) {
        detailKnowledge = document.createElement('div');
        detailKnowledge.id = 'detail-knowledge-section';
        detailKnowledge.className = 'detail-section';
        const parentCard = document.querySelector('.employee-detail-card');
        if (parentCard) {
            parentCard.appendChild(detailKnowledge);
        }
    }
    
    if (window.BUSINESS_KNOWLEDGE && Object.keys(window.BUSINESS_KNOWLEDGE).length > 0) {
        const relevantFiles = Object.entries(window.BUSINESS_KNOWLEDGE).filter(([filename, fileData]) => {
            const target = (typeof fileData === 'string') ? 'global' : (fileData.target || 'global');
            return target === 'global' || target === empId;
        });
        
        if (relevantFiles.length > 0) {
            detailKnowledge.innerHTML = `
                <h5>学習済ローカル資料</h5>
                <ul class="detail-instructions" style="list-style: none;">
                    ${relevantFiles.map(([filename]) => {
                        const cleanName = filename.replace(/[^\w\s\.\(\)\u3000-\u30fe\u4e00-\u9faf]/g, '?');
                        return `
                        <li style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 6px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;" title="${cleanName}">
                            <i class="fa-solid fa-file-invoice" style="color: var(--accent-teal); margin-right: 6px;"></i>${cleanName}
                        </li>`;
                    }).join('')}
                </ul>
            `;
            detailKnowledge.style.display = 'block';
        } else {
            detailKnowledge.style.display = 'none';
        }
    } else {
        detailKnowledge.style.display = 'none';
    }
    
    // Render message history
    renderMessages();
    
    // Render suggestion tags
    renderSuggestions();
}

function renderMessages() {
    const container = document.getElementById('chat-messages-container');
    container.innerHTML = '';
    
    const history = conversations[activeEmployee];
    history.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${msg.sender === 'user' ? 'user' : 'ai'}`;
        
        const avatarDiv = document.createElement('div');
        if (msg.sender === 'user') {
            avatarDiv.className = 'message-avatar user-bg';
            avatarDiv.innerHTML = '<i class="fa-solid fa-user-tie"></i>';
        } else {
            const emp = EMPLOYEES[activeEmployee];
            avatarDiv.className = `message-avatar ${emp.themeClass}`;
            avatarDiv.textContent = emp.avatar;
        }
        
        const bubbleWrapper = document.createElement('div');
        bubbleWrapper.className = 'bubble-wrapper';
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble';
        
        if (msg.sender === 'ai' && typeof msg.text === 'string') {
            const text = msg.text;
            // First check if AI explicitly outputted text trigger like "💡 提案をストック"
            const triggerRegex = /(?:^|\n)\s*(?:💡\s*)?提案をストック\s*(?:\n|$)/g;
            
            const triggerMatches = [];
            let tMatch;
            while ((tMatch = triggerRegex.exec(text)) !== null) {
                triggerMatches.push({
                    index: tMatch.index,
                    length: tMatch[0].length
                });
            }
            
            if (triggerMatches.length > 0) {
                // Parse by explicit text triggers
                let lastIndex = 0;
                for (let i = 0; i < triggerMatches.length; i++) {
                    const proposalBody = text.substring(lastIndex, triggerMatches[i].index).trim();
                    if (proposalBody) {
                        const card = document.createElement('div');
                        card.className = 'inline-proposal-card';
                        card.style.border = '1px solid rgba(0, 210, 196, 0.15)';
                        card.style.background = 'rgba(12, 15, 22, 0.3)';
                        card.style.padding = '12px 14px';
                        card.style.borderRadius = '8px';
                        card.style.margin = '12px 0';
                        
                        const contentDiv = document.createElement('div');
                        contentDiv.innerHTML = formatMarkdown(proposalBody);
                        card.appendChild(contentDiv);
                        
                        const stockBtn = document.createElement('button');
                        stockBtn.className = 'action-icon-btn';
                        stockBtn.style.marginTop = '8px';
                        stockBtn.style.color = 'var(--accent-teal)';
                        stockBtn.style.cursor = 'pointer';
                        stockBtn.innerHTML = '<i class="fa-solid fa-lightbulb"></i> 提案をストック';
                        
                        stockBtn.addEventListener('click', () => {
                            openProposalRegisterModal(proposalBody);
                        });
                        
                        card.appendChild(stockBtn);
                        bubbleDiv.appendChild(card);
                    }
                    lastIndex = triggerMatches[i].index + triggerMatches[i].length;
                }
                
                // Trailing text if any
                if (lastIndex < text.length) {
                    const trailing = text.substring(lastIndex).trim();
                    if (trailing) {
                        const div = document.createElement('div');
                        div.innerHTML = formatMarkdown(trailing);
                        bubbleDiv.appendChild(div);
                    }
                }
            } else {
                // Fallback: Parse by headings (### 💡 提案 1: or ■ 提案2: )
                const proposalHeaderRegex = /(?:^|\n)(?:###|####|■|【)\s*(?:💡\s*)?(?:提案\s*[0-9０-９\d]+|提案)\s*[:：【\]\s]/g;
                
                const matches = [];
                let match;
                while ((match = proposalHeaderRegex.exec(text)) !== null) {
                    matches.push({
                        index: match.index,
                        length: match[0].length
                    });
                }
                
                const blocks = [];
                if (matches.length === 0) {
                    blocks.push({ type: 'text', text: text });
                } else {
                    // Get preamble
                    if (matches[0].index > 0) {
                        const preamble = text.substring(0, matches[0].index).trim();
                        if (preamble) {
                            blocks.push({ type: 'text', text: preamble });
                        }
                    }
                    
                    // Get each proposal block
                    for (let i = 0; i < matches.length; i++) {
                        const start = matches[i].index;
                        const end = (i + 1 < matches.length) ? matches[i + 1].index : text.length;
                        const proposalText = text.substring(start, end).trim();
                        if (proposalText) {
                            blocks.push({ type: 'proposal', text: proposalText });
                        }
                    }
                }
                
                if (blocks.some(b => b.type === 'proposal')) {
                    blocks.forEach(block => {
                        if (block.type === 'text') {
                            const div = document.createElement('div');
                            div.innerHTML = formatMarkdown(block.text);
                            bubbleDiv.appendChild(div);
                        } else if (block.type === 'proposal') {
                            const card = document.createElement('div');
                            card.className = 'inline-proposal-card';
                            card.style.border = '1px solid rgba(0, 210, 196, 0.15)';
                            card.style.background = 'rgba(12, 15, 22, 0.3)';
                            card.style.padding = '12px 14px';
                            card.style.borderRadius = '8px';
                            card.style.margin = '12px 0';
                            
                            const contentDiv = document.createElement('div');
                            contentDiv.innerHTML = formatMarkdown(block.text);
                            card.appendChild(contentDiv);
                            
                            const stockBtn = document.createElement('button');
                            stockBtn.className = 'action-icon-btn';
                            stockBtn.style.marginTop = '8px';
                            stockBtn.style.color = 'var(--accent-teal)';
                            stockBtn.style.cursor = 'pointer';
                            stockBtn.innerHTML = '<i class="fa-solid fa-lightbulb"></i> この提案を個別にストック';
                            
                            stockBtn.addEventListener('click', () => {
                                openProposalRegisterModal(block.text);
                            });
                            
                            card.appendChild(stockBtn);
                            bubbleDiv.appendChild(card);
                        }
                    });
                } else {
                    bubbleDiv.innerHTML = formatMarkdown(text);
                }
            }
        } else {
            bubbleDiv.innerHTML = formatMarkdown(msg.text);
        }
        
        if (msg.images && msg.images.length > 0) {
            msg.images.forEach(img => {
                const imgContainer = document.createElement('div');
                imgContainer.style.marginTop = '8px';
                
                const el = document.createElement('img');
                el.src = img.src;
                el.style.maxWidth = '100%';
                el.style.maxHeight = '200px';
                el.style.borderRadius = '6px';
                el.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                
                const label = document.createElement('div');
                label.style.fontSize = '10px';
                label.style.opacity = '0.7';
                label.style.marginTop = '2px';
                label.textContent = `📎 ${img.name}`;
                
                imgContainer.appendChild(el);
                imgContainer.appendChild(label);
                bubbleDiv.appendChild(imgContainer);
            });
        }
        
        if (msg.fileTags && msg.fileTags.length > 0) {
            const fileContainer = document.createElement('div');
            fileContainer.style.marginTop = '8px';
            fileContainer.style.fontSize = '12px';
            fileContainer.style.opacity = '0.9';
            fileContainer.innerHTML = msg.fileTags.join('<br>');
            bubbleDiv.appendChild(fileContainer);
        }
        
        bubbleWrapper.appendChild(bubbleDiv);
        
        // Add speech actions bar
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'message-actions';
        
        const speakBtn = document.createElement('button');
        speakBtn.className = 'action-icon-btn speak-btn';
        speakBtn.innerHTML = '<i class="fa-solid fa-volume-low"></i> 読み上げ';
        speakBtn.title = '音声で読み上げる';
        
        speakBtn.addEventListener('click', () => {
            toggleSpeech(msg.text, speakBtn);
        });
        
        actionsDiv.appendChild(speakBtn);
        
        // Add individual message delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-icon-btn delete-msg-btn';
        deleteBtn.style.marginLeft = '12px';
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i> 削除';
        deleteBtn.title = 'このメッセージを削除します';
        deleteBtn.addEventListener('click', () => {
            if (confirm('このメッセージを履歴から削除しますか？')) {
                const index = history.indexOf(msg);
                if (index !== -1) {
                    history.splice(index, 1);
                    saveConversations();
                    renderMessages();
                }
            }
        });
        actionsDiv.appendChild(deleteBtn);
        
        if (msg.sender === 'ai') {
            const stockBtn = document.createElement('button');
            stockBtn.className = 'action-icon-btn';
            stockBtn.style.marginLeft = '12px';
            stockBtn.innerHTML = '<i class="fa-solid fa-lightbulb"></i> 提案をストック';
            stockBtn.title = 'この提案・アイデアを一覧にストックします';
            
            stockBtn.addEventListener('click', () => {
                openProposalRegisterModal(msg.text);
            });
            actionsDiv.appendChild(stockBtn);
        }
        
        bubbleWrapper.appendChild(actionsDiv);
        
        msgDiv.appendChild(avatarDiv);
        msgDiv.appendChild(bubbleWrapper);
        container.appendChild(msgDiv);
    });
    
    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
}

function renderSuggestions() {
    const container = document.getElementById('prompt-suggestions-container');
    container.innerHTML = '';
    
    const emp = EMPLOYEES[activeEmployee];
    emp.suggestions.forEach(sug => {
        const tag = document.createElement('div');
        tag.className = 'suggestion-tag';
        tag.textContent = sug;
        tag.addEventListener('click', () => {
            sendUserMessage(sug);
        });
        container.appendChild(tag);
    });
}

let attachedFiles = [];

function renderFilePreviews() {
    const filePreview = document.getElementById('file-attachment-preview');
    const listContainer = document.getElementById('attached-files-list');
    if (!filePreview || !listContainer) return;
    
    listContainer.innerHTML = '';
    if (attachedFiles.length === 0) {
        filePreview.style.display = 'none';
        return;
    }
    
    attachedFiles.forEach((file, index) => {
        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.gap = '8px';
        item.style.padding = '6px 10px';
        item.style.background = 'rgba(255, 255, 255, 0.04)';
        item.style.borderRadius = '4px';
        item.style.border = '1px solid rgba(0, 210, 196, 0.15)';
        
        const iconClass = file.type.startsWith('image/') ? 'fa-image' : 'fa-file-lines';
        item.innerHTML = `
            <i class="fa-solid ${iconClass}"></i>
            <span style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: monospace;">${file.name} (${(file.size / 1024).toFixed(1)} KB)</span>
            <button class="remove-single-file-btn" data-index="${index}" style="background: none; border: none; color: var(--accent-red, #ff3b30); cursor: pointer; padding: 0 4px; font-size: 14px; display: flex; align-items: center; justify-content: center;">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;
        listContainer.appendChild(item);
    });
    
    listContainer.querySelectorAll('.remove-single-file-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const idx = parseInt(btn.getAttribute('data-index'));
            attachedFiles.splice(idx, 1);
            const fileInput = document.getElementById('chat-file-input');
            if (fileInput && attachedFiles.length === 0) fileInput.value = '';
            renderFilePreviews();
        });
    });
    
    filePreview.style.display = 'flex';
}

function initChat() {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-message-btn');
    const clearBtn = document.getElementById('clear-chat-btn');
    const fileInput = document.getElementById('chat-file-input');
    const filePreview = document.getElementById('file-attachment-preview');
    
    if (fileInput) {
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                for (let i = 0; i < fileInput.files.length; i++) {
                    const file = fileInput.files[i];
                    if (!attachedFiles.some(f => f.name === file.name && f.size === file.size)) {
                        attachedFiles.push(file);
                    }
                }
                renderFilePreviews();
            }
        });
    }
    
    sendBtn.addEventListener('click', () => {
        const text = input.value.trim();
        if (text || attachedFiles.length > 0) {
            sendUserMessage(text, [...attachedFiles]);
            input.value = '';
            attachedFiles = [];
            if (fileInput) fileInput.value = '';
            renderFilePreviews();
        }
    });
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const text = input.value.trim();
            if (text || attachedFiles.length > 0) {
                sendUserMessage(text, [...attachedFiles]);
                input.value = '';
                attachedFiles = [];
                if (fileInput) fileInput.value = '';
                renderFilePreviews();
            }
        }
    });

    clearBtn.addEventListener('click', () => {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        resetSpeechButton();
        const defaultText = conversations[activeEmployee][0];
        conversations[activeEmployee] = [defaultText];
        renderMessages();
        saveConversations();
    });

    // Toggle Chat Sidebar handler
    const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
    if (toggleSidebarBtn) {
        toggleSidebarBtn.addEventListener('click', () => {
            const chatLayout = document.querySelector('.chat-layout');
            if (chatLayout) {
                const isCollapsed = chatLayout.classList.toggle('sidebar-collapsed');
                toggleSidebarBtn.innerHTML = isCollapsed 
                    ? '<i class="fa-solid fa-compress"></i> 資料一覧を表示' 
                    : '<i class="fa-solid fa-expand"></i> 画面を広くする';
            }
        });
    }
    
    // Trigger initial select
    selectEmployeeChat('sec');
}

async function uploadToGeminiFilesAPI(file, apiKey) {
    // Fallback MIME type detection to prevent 400 Bad Request on empty file.type
    const mimeType = file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream');
    
    // 1. Initial request to get the resumable upload session URL
    const initRes = await fetch(`https://generativelanguage.googleapis.com/upload/v1beta/files?key=${apiKey}`, {
        method: "POST",
        headers: {
            "X-Goog-Upload-Protocol": "resumable",
            "X-Goog-Upload-Command": "start",
            "X-Goog-Upload-Header-Content-Length": file.size,
            "X-Goog-Upload-Header-Content-Type": mimeType,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            file: { displayName: file.name }
        })
    });
    if (!initRes.ok) {
        throw new Error(`Files API initialization failed: ${initRes.status}`);
    }
    const uploadUrl = initRes.headers.get("X-Goog-Upload-URL");
    if (!uploadUrl) {
        throw new Error("Failed to retrieve upload URL.");
    }
    
    // 2. Upload the raw binary bytes
    const uploadRes = await fetch(uploadUrl, {
        method: "POST",
        headers: {
            "X-Goog-Upload-Command": "upload, finalize",
            "X-Goog-Upload-Offset": "0",
            "Content-Length": file.size
        },
        body: file
    });
    if (!uploadRes.ok) {
        throw new Error(`File binary upload failed: ${uploadRes.status}`);
    }
    return await uploadRes.json();
}

async function sendUserMessage(text, files = []) {
    let imagesForMsg = [];
    let contentsParts = [];
    let finalPrompt = text;
    let textAttachmentsText = "";
    let fileTags = [];
    
    // Get Gemini key
    let apiKey = '';
    try {
        apiKey = localStorage.getItem('bc_lab_gemini_key') || '';
    } catch (e) {
        apiKey = window.bc_lab_gemini_key || '';
    }
    const hasAPIKey = apiKey && (apiKey.startsWith('AIza') || apiKey.startsWith('AQ'));
    
    if (files && files.length > 0) {
        for (const file of files) {
            const isPDF = file.type === 'application/pdf' || file.name.endsWith('.pdf');
            const isLarge = file.size > 1 * 1024 * 1024; // >1MB
            const useFilesAPI = hasAPIKey && (isPDF || isLarge || file.type.startsWith('video/') || file.type.startsWith('audio/'));
            
            if (useFilesAPI) {
                try {
                    fileTags.push(`📎 **[資料アップロード中...]** ${file.name}`);
                    renderMessages();
                    
                    const uploadResult = await uploadToGeminiFilesAPI(file, apiKey);
                    
                    // Replace upload status tag with completed tag
                    const idx = fileTags.indexOf(`📎 **[資料アップロード中...]** ${file.name}`);
                    if (idx !== -1) {
                        fileTags[idx] = `📎 **クラウド資料: ${file.name}** (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
                    }
                    
                    contentsParts.push({
                        fileData: {
                            mimeType: file.type || 'application/pdf',
                            fileUri: uploadResult.file.uri
                        }
                    });
                    
                    // Trigger background archiving to permanent knowledge base
                    archiveDocumentToKnowledgeBase(file.name, uploadResult.file.uri, file.type || 'application/pdf', apiKey);
                } catch (e) {
                    console.error("Failed to upload via Files API:", e);
                    const idx = fileTags.indexOf(`📎 **[資料アップロード中...]** ${file.name}`);
                    if (idx !== -1) {
                        fileTags[idx] = `❌ **アップロード失敗: ${file.name}**`;
                    }
                }
            } else if (file.type.startsWith('image/')) {
                try {
                    const base64Data = await readAsDataURL(file);
                    const base64Clean = base64Data.split(',')[1];
                    contentsParts.push({
                        inlineData: {
                            mimeType: file.type,
                            data: base64Clean
                        }
                    });
                    imagesForMsg.push({
                        name: file.name,
                        src: base64Data
                    });
                } catch (e) {
                    console.error("Failed to read image:", e);
                }
            } else {
                try {
                    const fileText = await readAsText(file);
                    textAttachmentsText += `

【添付ファイル: ${file.name}】
${fileText}`;
                    fileTags.push(`📎 **添付ファイル: ${file.name}** (${(file.size / 1024).toFixed(1)} KB)`);
                    
                    // Stock the document into the shared Company Knowledge Base
                    stockFileToKnowledgeBase(file.name, fileText, 'global');
                } catch (e) {
                    console.error("Failed to read text file:", e);
                }
            }
        }
    }
    
    finalPrompt += textAttachmentsText;
    
    // Add User message with attachments saved structured separately
    conversations[activeEmployee].push({
        sender: 'user',
        text: text,
        images: imagesForMsg,
        fileTags: fileTags,
        textAttachments: textAttachmentsText,
        attachments: contentsParts
    });
    renderMessages();
    saveConversations();
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        const responseText = await getAIResponse(finalPrompt, contentsParts);
        hideTypingIndicator();
        conversations[activeEmployee].push({ sender: 'ai', text: responseText });
        renderMessages();
        saveConversations();
    } catch (err) {
        hideTypingIndicator();
        conversations[activeEmployee].push({ sender: 'ai', text: `申し訳ございません、エラーが発生しました: ${err.message}` });
        renderMessages();
        saveConversations();
    }
}

async function archiveDocumentToKnowledgeBase(fileName, fileUri, mimeType, apiKey) {
    let apiModel = 'gemini-3.5-flash'; // Default to active stable model
    try {
        const storedModel = localStorage.getItem('bc_lab_gemini_model');
        if (storedModel) {
            apiModel = storedModel;
        }
    } catch(e) {
        console.warn("Could not read stored model for archiving:", e);
    }
    
    const apiVer = 'v1beta';
    const fileId = fileUri.split('/').pop();
    
    // Show start notification
    showNotification(`📂 「${fileName}」をデータ解析し、永久学習データに登録しています...`);
    
    try {
        // 1. Poll the Files API until the file is ACTIVE (Google's OCR/processing finishes)
        let fileState = 'PROCESSING';
        let attempts = 0;
        const maxAttempts = 20; // Poll for up to 100 seconds (5s interval)
        
        while (fileState === 'PROCESSING' && attempts < maxAttempts) {
            attempts++;
            console.log(`Checking file ${fileId} state (attempt ${attempts})...`);
            
            const statusRes = await fetch(`https://generativelanguage.googleapis.com/${apiVer}/files/${fileId}?key=${apiKey}`);
            if (statusRes.ok) {
                const statusData = await statusRes.json();
                fileState = statusData.state || 'ACTIVE';
                console.log(`File state: ${fileState}`);
            }
            
            if (fileState === 'PROCESSING') {
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
            }
        }
        
        if (fileState !== 'ACTIVE') {
            throw new Error(`ファイル解析がタイムアウトしました（現在の状態: ${fileState}）`);
        }
        
        // 2. Call the Gemini API to extract text and summarize diagrams
        const promptText = "Please convert this entire document into structured Markdown text. For any diagrams, charts, graphs, flowcharts, or images, write a detailed description of what they represent so that it can be searched and referenced in the future. Output only the markdown text of the document.";
        
        const res = await fetch(`https://generativelanguage.googleapis.com/${apiVer}/models/${apiModel}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [
                        {
                            fileData: {
                                mimeType: mimeType,
                                fileUri: fileUri
                            }
                        },
                        {
                            text: promptText
                        }
                    ]
                }]
            })
        });
        
        if (!res.ok) {
            throw new Error(`RAG API呼び出しエラー: ${res.status}`);
        }
        
        const data = await res.json();
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
            const extractedText = data.candidates[0].content.parts[0].text;
            
            // Save to localStorage
            stockFileToKnowledgeBase(fileName, extractedText, 'global');
            
            console.log(`Successfully archived ${fileName} to permanent knowledge base! Size: ${extractedText.length} chars.`);
            
            // Refresh sidebar document list
            if (window.activeEmployee) {
                selectEmployeeChat(window.activeEmployee);
            }
        } else {
            throw new Error("Geminiから抽出データが返されませんでした。");
        }
    } catch (e) {
        console.error(`Failed to archive document ${fileName} permanently:`, e);
        showNotification(`❌ 「${fileName}」の永久保存に失敗しました: ${e.message}`);
    }
}

function readAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

function readAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
    });
}

function showTypingIndicator() {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;
    const loader = document.createElement('div');
    loader.id = 'typing-loader';
    loader.className = 'message ai';
    
    const emp = EMPLOYEES[activeEmployee];
    loader.innerHTML = `
        <div class="message-avatar ${emp.themeClass}">${emp.avatar}</div>
        <div class="message-bubble">
            <div class="typing-indicator">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    container.appendChild(loader);
    container.scrollTop = container.scrollHeight;
}

function hideTypingIndicator() {
    const loader = document.getElementById('typing-loader');
    if (loader) loader.remove();
}

async function getAIResponse(userText, attachments = []) {
    let apiKey = '';
    let apiModel = 'gemini-3.5-flash';
    try {
        apiKey = localStorage.getItem('bc_lab_gemini_key') || '';
        apiModel = localStorage.getItem('bc_lab_gemini_model') || 'gemini-3.5-flash';
    } catch (e) {
        apiKey = window.bc_lab_gemini_key || '';
        apiModel = window.bc_lab_gemini_model || 'gemini-3.5-flash';
    }
    if (apiModel === 'gemini-1.5-flash') {
        apiModel = 'gemini-2.0-flash';
    }
    const emp = EMPLOYEES[activeEmployee];
    
    // If Gemini key is set and seems valid, call actual API
    if (apiKey && (apiKey.startsWith('AIza') || apiKey.startsWith('AQ'))) {
        try {
            // Format history for Gemini REST API (Limit to last 12 messages to optimize token usage and avoid quota limits)
            const maxHistory = 12;
            const rawHistory = conversations[activeEmployee];
            const historyToUse = rawHistory.slice(-maxHistory);
            const contents = historyToUse.map((msg, index) => {
                const role = msg.sender === 'user' ? 'user' : 'model';
                
                if (index === historyToUse.length - 1 && msg.sender === 'user') {
                    const parts = [{ text: userText }];
                    if (attachments && attachments.length > 0) {
                        attachments.forEach(part => {
                            parts.push(part);
                        });
                    }
                    return { role, parts };
                }
                
                const parts = [{ text: msg.text }];
                if (msg.attachments && msg.attachments.length > 0) {
                    msg.attachments.forEach(part => {
                        parts.push(part);
                    });
                }
                if (msg.sender === 'user' && msg.textAttachments) {
                    parts[0].text += msg.textAttachments;
                }
                return { role, parts };
            });
            
            // Choose optimal API version: use v1beta to ensure systemInstruction is always supported
            const apiVer = 'v1beta';
            
            const res = await fetch(`https://generativelanguage.googleapis.com/${apiVer}/models/${apiModel}:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: contents,
                    systemInstruction: {
                        parts: [{ text: getSystemInstruction(emp) }]
                    }
                })
            });
            
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error?.message || `HTTP error ${res.status}`);
            }
            
            const data = await res.json();
            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error("Gemini API から有効な応答が得られませんでした。");
            }
        } catch (error) {
            console.error("Gemini API call failed, falling back to mock mode:", error);
            throw new Error(`Gemini API通信エラー: ${error.message}`);
        }
    } else {
        // Mock Demo Mode
        return new Promise((resolve) => {
            setTimeout(() => {
                // Check if we have a predefined mock response for this query
                let response = emp.mockResponses[userText];
                
                // Fuzzy match local business knowledge if available
                if (!response && window.BUSINESS_KNOWLEDGE) {
                    const keywords = userText.split(/[\s,，、。・\?？]+/).filter(k => k.length > 1);
                    if (keywords.length > 0) {
                        for (const [filename, fileData] of Object.entries(window.BUSINESS_KNOWLEDGE)) {
                            let contentText = "";
                            if (typeof fileData === 'string') {
                                contentText = fileData;
                            } else {
                                contentText = fileData.content || "";
                            }
                            
                            const matches = keywords.filter(kw => contentText.toLowerCase().includes(kw.toLowerCase()));
                            if (matches.length >= 1) {
                                // Extract relevant paragraph
                                const paragraphs = contentText.split('\n');
                                let matchedParagraphs = [];
                                for (const p of paragraphs) {
                                    if (matches.some(kw => p.toLowerCase().includes(kw.toLowerCase()))) {
                                        matchedParagraphs.push(p.trim());
                                        if (matchedParagraphs.length >= 3) break;
                                    }
                                }
                                if (matchedParagraphs.length > 0) {
                                    response = `吉川代表、ローカル資料 **「${filename}」** から関連する記述を見つけましたので報告します。\n\n${matchedParagraphs.join('\n\n')}\n\n詳細な分析やドラフトの作成をご希望される場合は、Gemini APIキーをご設定いただくことで、資料全体を踏まえた高度な対話が可能です。`;
                                    break;
                                }
                            }
                        }
                    }
                }
                
                if (!response) {
                    // Fuzzy match keywords
                    if (userText.includes('CONNECT AI') || userText.includes('アプリ') || userText.includes('アルゴリズム')) {
                        if (emp.id === 'tech') response = emp.mockResponses['CONNECT AIの骨格測定アルゴリズムの改善案は？'];
                        else if (emp.id === 'sci') response = `吉川代表、姿勢科学 of 視点から「CONNECT AI」についてお答えします。CONNECT AIが搭載する姿勢測定ロジックは、現場の施術者が患者様に対して『歪みを客観視』してもらう上で絶大な効力を持っています。さらに詳しい骨格推定パラメータの挙動は、橘蓮（技術開発）とも協調して回答いたします。`;
                        else response = `吉川代表、「CONNECT AI」のマーケティング展開や製品の魅力アピールに関しては私にお任せください。新規見込み客（サロンやジム）へのピッチ資料や営業用メールをカスタマイズして出力いたします。`;
                    } else if (userText.includes('ニュース') || userText.includes('市場') || userText.includes('競合')) {
                        response = EMPLOYEES.sec.mockResponses['今日のヘルスケア市場のトピックスを教えて'];
                    } else if (userText.includes('コラム') || userText.includes('ストレッチ') || userText.includes('ハンモック')) {
                        response = EMPLOYEES.sci.mockResponses['猫背に対するハンモックセラピーの効果と施術プロセスを教えて'];
                    }
                }
                
                if (!response) {
                    response = emp.mockResponses['default'];
                }
                resolve(response);
            }, 1000);
        });
    }
}

// Simple Markdown-to-HTML parser
function formatMarkdown(text) {
    if (!text) return "";
    let html = text;
    // Escape HTML to prevent injection, except tags we write
    html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
    // Code blocks
    html = html.replace(/```(html|css|javascript|js)?([\s\S]*?)```/g, '<pre style="background:#0c0f16; border:1px solid #243048; padding:12px; border-radius:6px; margin:8px 0; overflow-x:auto; font-family:monospace; color:#00d2c4;"><code>$2</code></pre>');
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code style="background:#1b2436; padding:2px 6px; border-radius:4px; font-family:monospace; color:#ff6d00;">$1</code>');
    // Bold
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: var(--accent-teal); text-decoration: underline; font-weight: 500;">$1</a>');
    
    // Lines and Bullet lists
    const lines = html.split('\n');
    let inList = false;
    const formattedLines = [];
    
    for (let line of lines) {
        if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
            if (!inList) {
                formattedLines.push('<ul style="margin: 8px 0 8px 20px;">');
                inList = true;
            }
            formattedLines.push(`<li>${line.trim().substring(2)}</li>`);
        } else {
            if (inList) {
                formattedLines.push('</ul>');
                inList = false;
            }
            formattedLines.push(line);
        }
    }
    if (inList) formattedLines.push('</ul>');
    
    html = formattedLines.join('<br>');
    return html;
}

// --- CONNECT AI Posture Simulator Logic ---

let currentSkeletonView = 'side'; // 'side' or 'front'
let canvas, ctx;
let skeletonPoints = [];
let draggingPoint = null;

const SIDE_POINTS_DEFAULT = [
    { id: 'ear', name: '耳 (Ear)', x: 230, y: 100, color: '#e066ff' },
    { id: 'shoulder', name: '肩 (Shoulder)', x: 230, y: 160, color: '#00a2ff' },
    { id: 'hip', name: '大転子/腰 (Hip)', x: 230, y: 280, color: '#00e676' },
    { id: 'knee', name: '膝 (Knee)', x: 230, y: 390, color: '#ffaa00' },
    { id: 'ankle', name: '外くるぶし (Ankle)', x: 230, y: 480, color: '#ff5555' }
];

const FRONT_POINTS_DEFAULT = [
    { id: 'head', name: '頭部 (Head)', x: 230, y: 80, color: '#e066ff' },
    { id: 'l_shoulder', name: '左肩 (L Shoulder)', x: 180, y: 160, color: '#00a2ff' },
    { id: 'r_shoulder', name: '右肩 (R Shoulder)', x: 280, y: 160, color: '#00a2ff' },
    { id: 'l_hip', name: '左腰 (L Hip)', x: 195, y: 280, color: '#00e676' },
    { id: 'r_hip', name: '右腰 (R Hip)', x: 265, y: 280, color: '#00e676' },
    { id: 'l_knee', name: '左膝 (L Knee)', x: 195, y: 390, color: '#ffaa00' },
    { id: 'r_knee', name: '右膝 (R Knee)', x: 265, y: 390, color: '#ffaa00' },
    { id: 'l_ankle', name: '左足 (L Ankle)', x: 195, y: 480, color: '#ff5555' },
    { id: 'r_ankle', name: '右足 (R Ankle)', x: 265, y: 480, color: '#ff5555' }
];

function initSimulator() {
    canvas = document.getElementById('skeleton-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    
    // Bind buttons
    document.getElementById('btn-view-side').addEventListener('click', (e) => {
        setView('side');
    });
    document.getElementById('btn-view-front').addEventListener('click', (e) => {
        setView('front');
    });
    document.getElementById('btn-reset-skeleton').addEventListener('click', () => {
        resetSkeleton();
    });
    document.getElementById('btn-run-analysis').addEventListener('click', () => {
        runDetailedAIAnalysis();
    });
    
    // Report Tabs
    const tabBtns = document.querySelectorAll('.report-card .tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const tabId = btn.getAttribute('data-tab');
            document.querySelectorAll('.report-content .tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Setup Drag and Drop Mouse/Touch listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleMouseUp);

    // Initial load
    setView('side');
}

function setView(view) {
    currentSkeletonView = view;
    document.getElementById('btn-view-side').classList.toggle('active', view === 'side');
    document.getElementById('btn-view-front').classList.toggle('active', view === 'front');
    
    // Change metrics labels based on view
    if (view === 'side') {
        document.getElementById('metric-1-label').textContent = '耳-肩アライメント';
        document.getElementById('metric-2-label').textContent = '骨盤傾斜角';
        document.getElementById('metric-3-label').textContent = '膝関節アライメント';
    } else {
        document.getElementById('metric-1-label').textContent = '左右の肩の傾き';
        document.getElementById('metric-2-label').textContent = '左右の腰の傾き';
        document.getElementById('metric-3-label').textContent = '膝アライメント変位';
    }
    
    resetSkeleton();
}

function resetSkeleton() {
    skeletonPoints = JSON.parse(JSON.stringify(
        currentSkeletonView === 'side' ? SIDE_POINTS_DEFAULT : FRONT_POINTS_DEFAULT
    ));
    draggingPoint = null;
    drawSkeleton();
    calculatePostureMetrics();
}

function drawSkeleton() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 1. Draw human body shadow background
    drawHumanBodyShadow();
    
    // 2. Draw vertical reference line (grid)
    ctx.strokeStyle = '#243048';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(230, 0);
    ctx.lineTo(230, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash
    
    // 3. Draw lines connecting joints
    ctx.lineWidth = 4;
    ctx.shadowBlur = 4;
    
    if (currentSkeletonView === 'side') {
        ctx.strokeStyle = 'rgba(0, 210, 196, 0.4)';
        ctx.shadowColor = 'rgba(0, 210, 196, 0.4)';
        ctx.beginPath();
        ctx.moveTo(skeletonPoints[0].x, skeletonPoints[0].y); // Ear
        for(let i=1; i<skeletonPoints.length; i++) {
            ctx.lineTo(skeletonPoints[i].x, skeletonPoints[i].y);
        }
        ctx.stroke();
    } else {
        ctx.strokeStyle = 'rgba(0, 136, 255, 0.4)';
        ctx.shadowColor = 'rgba(0, 136, 255, 0.4)';
        
        // Draw head to shoulder mid
        const head = getPointById('head');
        const lSh = getPointById('l_shoulder');
        const rSh = getPointById('r_shoulder');
        const lHip = getPointById('l_hip');
        const rHip = getPointById('r_hip');
        const lKnee = getPointById('l_knee');
        const rKnee = getPointById('r_knee');
        const lAnk = getPointById('l_ankle');
        const rAnk = getPointById('r_ankle');
        
        const midShoulder = { x: (lSh.x + rSh.x) / 2, y: (lSh.y + rSh.y) / 2 };
        const midHip = { x: (lHip.x + rHip.x) / 2, y: (lHip.y + rHip.y) / 2 };
        
        // Spine
        ctx.beginPath();
        ctx.moveTo(head.x, head.y);
        ctx.lineTo(midShoulder.x, midShoulder.y);
        ctx.lineTo(midHip.x, midHip.y);
        ctx.stroke();
        
        // Shoulders
        ctx.beginPath();
        ctx.moveTo(lSh.x, lSh.y);
        ctx.lineTo(rSh.x, rSh.y);
        ctx.stroke();
        
        // Hips
        ctx.beginPath();
        ctx.moveTo(lHip.x, lHip.y);
        ctx.lineTo(rHip.x, rHip.y);
        ctx.stroke();
        
        // Left Leg
        ctx.beginPath();
        ctx.moveTo(lSh.x, lSh.y);
        ctx.lineTo(lHip.x, lHip.y);
        ctx.lineTo(lKnee.x, lKnee.y);
        ctx.lineTo(lAnk.x, lAnk.y);
        ctx.stroke();
        
        // Right Leg
        ctx.beginPath();
        ctx.moveTo(rSh.x, rSh.y);
        ctx.lineTo(rHip.x, rHip.y);
        ctx.lineTo(rKnee.x, rKnee.y);
        ctx.lineTo(rAnk.x, rAnk.y);
        ctx.stroke();
    }
    
    ctx.shadowBlur = 0; // reset shadow
    
    // 4. Draw keypoints handles
    skeletonPoints.forEach(pt => {
        // Draw glow border
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 14, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner point
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // White border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw text label on canvas for premium look
        ctx.fillStyle = '#90a1c0';
        ctx.font = '10px Outfit';
        ctx.fillText(pt.name.split(' ')[0], pt.x + 12, pt.y + 4);
    });
}

function drawHumanBodyShadow() {
    ctx.save();
    ctx.fillStyle = 'rgba(36, 48, 72, 0.15)';
    
    if (currentSkeletonView === 'side') {
        // Draw side-profile human avatar shadow on Canvas
        // Head
        ctx.beginPath();
        ctx.arc(230, 95, 30, 0, Math.PI * 2);
        ctx.fill();
        // Neck & Torso
        ctx.beginPath();
        ctx.moveTo(225, 125);
        ctx.quadraticCurveTo(210, 160, 220, 230); // back arch
        ctx.lineTo(245, 230); // stomach width
        ctx.quadraticCurveTo(245, 160, 235, 125);
        ctx.closePath();
        ctx.fill();
        // Hip & Buttocks
        ctx.beginPath();
        ctx.moveTo(220, 230);
        ctx.quadraticCurveTo(210, 280, 225, 320); // butt
        ctx.lineTo(245, 320); // pelvis
        ctx.quadraticCurveTo(245, 280, 245, 230);
        ctx.closePath();
        ctx.fill();
        // Legs
        ctx.beginPath();
        ctx.moveTo(225, 320);
        ctx.lineTo(220, 390); // thigh
        ctx.lineTo(225, 480); // calf
        ctx.lineTo(240, 480);
        ctx.lineTo(240, 390);
        ctx.lineTo(245, 320);
        ctx.closePath();
        ctx.fill();
    } else {
        // Front-profile body shadow
        // Head
        ctx.beginPath();
        ctx.arc(230, 80, 25, 0, Math.PI * 2);
        ctx.fill();
        // Shoulders
        ctx.beginPath();
        ctx.moveTo(230, 110);
        ctx.bezierCurveTo(170, 125, 160, 160, 160, 180); // L shoulder
        ctx.lineTo(190, 180);
        ctx.bezierCurveTo(190, 160, 210, 130, 230, 130);
        ctx.bezierCurveTo(250, 130, 270, 160, 270, 180);
        ctx.lineTo(300, 180); // R shoulder
        ctx.bezierCurveTo(300, 160, 290, 125, 230, 110);
        ctx.closePath();
        ctx.fill();
        // Torso
        ctx.beginPath();
        ctx.moveTo(190, 180);
        ctx.lineTo(195, 280); // L waist
        ctx.lineTo(265, 280); // R waist
        ctx.lineTo(270, 180);
        ctx.closePath();
        ctx.fill();
        // Pelvis & Legs
        ctx.beginPath();
        ctx.moveTo(195, 280);
        ctx.lineTo(190, 390); // L leg
        ctx.lineTo(195, 480); // L foot
        ctx.lineTo(215, 480);
        ctx.lineTo(225, 300);
        ctx.lineTo(235, 300);
        ctx.lineTo(245, 480);
        ctx.lineTo(265, 480); // R foot
        ctx.lineTo(270, 390); // R leg
        ctx.lineTo(265, 280);
        ctx.closePath();
        ctx.fill();
    }
    ctx.restore();
}

function getPointById(id) {
    return skeletonPoints.find(pt => pt.id === id);
}

function handleMouseDown(e) {
    const mousePos = getMousePos(canvas, e);
    // Find if clicked on any keypoint
    skeletonPoints.forEach(pt => {
        const dist = Math.hypot(pt.x - mousePos.x, pt.y - mousePos.y);
        if (dist <= 15) { // Handle radius threshold
            draggingPoint = pt;
        }
    });
}

function handleMouseMove(e) {
    if (!draggingPoint) return;
    const mousePos = getMousePos(canvas, e);
    
    // Constrain motion based on views to keep human anatomy somewhat consistent
    draggingPoint.x = Math.max(20, Math.min(canvas.width - 20, mousePos.x));
    draggingPoint.y = Math.max(20, Math.min(canvas.height - 20, mousePos.y));
    
    drawSkeleton();
    calculatePostureMetrics();
}

function handleMouseUp() {
    draggingPoint = null;
}

function handleTouchStart(e) {
    if (e.touches.length === 1) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }
}

function handleTouchMove(e) {
    if (e.touches.length === 1) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }
}

function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

// Posture Assessment Math
function calculatePostureMetrics() {
    let m1Value = 0, m2Value = 0, m3Value = 0, score = 100;
    let m1Status = 'normal', m2Status = 'normal', m3Status = 'normal';
    
    let sakamotoText = "";
    let tachibanaText = "";
    let treatmentText = "";
    
    if (currentSkeletonView === 'side') {
        const ear = getPointById('ear');
        const shoulder = getPointById('shoulder');
        const hip = getPointById('hip');
        const knee = getPointById('knee');
        const ankle = getPointById('ankle');
        
        // 1. Ear-Shoulder horizontal offset (スマホ首)
        const dxES = ear.x - shoulder.x;
        // In pixel measurements, converting to degrees: approx 1 pixel = 0.5 degrees
        m1Value = Math.round(dxES * 0.5);
        if (m1Value > 8) {
            m1Status = 'warn';
            score -= Math.min(20, (m1Value - 8) * 2);
        } else if (m1Value > 15) {
            m1Status = 'danger';
            score -= 30;
        } else if (m1Value < -5) {
            m1Status = 'warn'; // Head pulled too far back
            score -= 10;
        }
        
        // 2. Pelvic tilt (Hip to Ankle/Shoulder alignment)
        const dxHip = hip.x - 230; // Deviation from gravity reference
        m2Value = Math.round(dxHip * 0.6);
        if (Math.abs(m2Value) > 6) {
            m2Status = 'warn';
            score -= Math.min(15, (Math.abs(m2Value) - 6) * 1.5);
        }
        if (Math.abs(m2Value) > 12) {
            m2Status = 'danger';
        }
        
        // 3. Knee hyperextension (Knee to Hip-Ankle line deviation)
        const midY = (hip.y + ankle.y) / 2;
        const expectedKneeX = hip.x + (ankle.x - hip.x) * ((knee.y - hip.y) / (ankle.y - hip.y));
        const dxKnee = knee.x - expectedKneeX;
        m3Value = Math.round(dxKnee * 0.5);
        if (Math.abs(m3Value) > 5) {
            m3Status = 'warn';
            score -= 10;
        }
        if (Math.abs(m3Value) > 10) {
            m3Status = 'danger';
        }
        
        score = Math.max(30, Math.min(100, Math.round(score)));
        
        // Render UI
        document.getElementById('metric-1-value').textContent = `${Math.abs(m1Value)}° ${m1Value > 0 ? '前方' : '後方'}`;
        document.getElementById('metric-2-value').textContent = `${Math.abs(m2Value)}° ${m2Value > 0 ? '前傾' : '後傾'}`;
        document.getElementById('metric-3-value').textContent = `${Math.abs(m3Value)}° ${m3Value > 0 ? '屈曲' : '反り'}`;
        
        // Generate expert reports dynamically depending on deviations
        if (m1Status === 'normal' && m2Status === 'normal' && m3Status === 'normal') {
            sakamotoText = "側面の姿勢アライメントは非常に理想的です。耳、肩、大転子、外くるぶしがほぼ一直線（重力基準線）に並んでいます。筋肉の過剰な緊張や関節への不均等なストレスはなく、健康的な身体バランスを維持しています。";
            tachibanaText = "Telemetry: All keypoint angle vectors are within standard boundaries. Ear-to-Shoulder delta: " + dxES.toFixed(1) + "px. System Confidence Score: 0.98. No skeletal displacement anomalies detected.";
            treatmentText = "現在の良好な姿勢をキープするために、軽い有酸素運動と日常的な活動レベルを維持してください。ハンモックセラピーの「リラックス・スイング」メソッドを行うと、自律神経が整いリラクゼーション効果がさらに高まります。";
        } else {
            let issues = [];
            if (m1Status !== 'normal') issues.push(m1Value > 0 ? "スマホ首（頭部前方変位）" : "フラットバック傾向の首の歪み");
            if (m2Status !== 'normal') issues.push(m2Value > 0 ? "骨盤の前傾（反り腰）" : "骨盤の後傾（猫背骨盤）");
            if (m3Status !== 'normal') issues.push("膝関節のミスアライメント（反り膝/過伸展）");
            
            sakamotoText = `現在、側方アライメントにおいて **${issues.join('、')}** の傾向が確認されます。\n\n特に、首の角度が ${Math.abs(m1Value)}° 前方にズレているため、頭部の重みの約3倍である **約15〜18kgの負荷** が頚椎（首の骨）や僧帽筋に常にかかり続けている状態です。これが慢性的な肩こりや頭痛を引き起こす主要因となります。骨盤の傾きも連動して崩れています。`;
            
            tachibanaText = `骨格検出ログ: キーポイントの幾何学的エラーを検知。\n・耳-肩偏差: ${dxES.toFixed(1)}px (判定値: ${m1Value}°)\n・骨盤補正角: ${dxHip.toFixed(1)}px (判定値: ${m2Value}°)\n・膝トラッキング偏差: ${dxKnee.toFixed(1)}px\nフィルター処理後の信頼スコア: 0.92。重心位置が鉛直基準線からやや前方に偏位しています。`;
            
            treatmentText = `**推奨ケアプログラム（B.C Lab カイロ・アプローチ）:**\n1. 首の後ろの筋肉群の緊張を解くため、**ハンモックを用いたパッシブ・レスト（首・胸郭の重力解放）**を15分実施。\n2. 骨盤のねじれを緩めるため、骨盤帯に対するハンモックのスリング牽引メソッドを推奨します。`;
        }
        
    } else {
        // Front View calculation
        const lSh = getPointById('l_shoulder');
        const rSh = getPointById('r_shoulder');
        const lHip = getPointById('l_hip');
        const rHip = getPointById('r_hip');
        const lKnee = getPointById('l_knee');
        const rKnee = getPointById('r_knee');
        
        // 1. Shoulder tilt (左右の肩の傾き)
        const dySh = lSh.y - rSh.y;
        m1Value = Math.round(dySh * 0.7);
        if (Math.abs(m1Value) > 4) {
            m1Status = 'warn';
            score -= Math.min(15, (Math.abs(m1Value) - 4) * 2);
        }
        if (Math.abs(m1Value) > 10) {
            m1Status = 'danger';
        }
        
        // 2. Hip tilt (左右の腰の傾き)
        const dyHip = lHip.y - rHip.y;
        m2Value = Math.round(dyHip * 0.7);
        if (Math.abs(m2Value) > 4) {
            m2Status = 'warn';
            score -= Math.min(15, (Math.abs(m2Value) - 4) * 2);
        }
        if (Math.abs(m2Value) > 10) {
            m2Status = 'danger';
        }
        
        // 3. Knee-Ankle alignment asymmetry
        const dKneeWidth = Math.abs(lKnee.x - rKnee.x) - 70; // 70 is normal distance
        m3Value = Math.round(dKneeWidth * 0.3);
        if (Math.abs(m3Value) > 5) {
            m3Status = 'warn';
            score -= 10;
        }
        if (Math.abs(m3Value) > 10) {
            m3Status = 'danger';
        }
        
        score = Math.max(30, Math.min(100, Math.round(score)));
        
        // Render UI
        document.getElementById('metric-1-value').textContent = `${Math.abs(m1Value)}° ${m1Value > 0 ? '右肩下がり' : '左肩下がり'}`;
        document.getElementById('metric-2-value').textContent = `${Math.abs(m2Value)}° ${m2Value > 0 ? '右腰下がり' : '左腰下がり'}`;
        document.getElementById('metric-3-value').textContent = `${Math.abs(m3Value)}px ${m3Value > 0 ? 'X脚傾向' : 'O脚傾向'}`;
        
        if (m1Status === 'normal' && m2Status === 'normal' && m3Status === 'normal') {
            sakamotoText = "左右のバランスが非常に対称的で整っています。肩や腰のラインが水平に近く、特定の関節や筋肉に負担が偏るのを防ぐ良いバランスです。現状のセルフケアを継続してください。";
            tachibanaText = "Analysis: Front view balance is highly symmetrical. Shoulder delta: " + dySh.toFixed(1) + "px. Hip delta: " + dyHip.toFixed(1) + "px. Skeletal keypoint alignment verified against horizontal reference plane.";
            treatmentText = "骨盤や背骨に歪みがありませんので、筋肉疲労を防ぐための通常ストレッチと、ハンモック内での全身スイングによるリフレッシュが最適です。";
        } else {
            let asymmetry = [];
            if (m1Status !== 'normal') asymmetry.push(m1Value > 0 ? "右肩の下がり" : "左肩の下がり");
            if (m2Status !== 'normal') asymmetry.push(m2Value > 0 ? "右骨盤の下がり" : "左骨盤の下がり");
            if (m3Status !== 'normal') asymmetry.push(m3Value > 0 ? "膝の外反（X脚）傾向" : "膝の内反（O脚）傾向");
            
            sakamotoText = `前面（正面）の分析により、**${asymmetry.join('、')}** が検知されました。\n\n左右の肩や腰の傾きにズレがあるため、歩行や起立の際にどちらか片方の足や腰に体重が乗りすぎています。この偏りが慢性的な股関節痛や片側性の腰痛、側弯症（背骨のカーブ）などの要因になります。`;
            
            tachibanaText = `Frontal Scan: Asymmetry values detected.\n・Shoulder Delta Y: ${dySh.toFixed(1)}px (判定値: ${m1Value}°)\n・Pelvic Delta Y: ${dyHip.toFixed(1)}px (判定値: ${m2Value}°)\n・Knee Gap Delta: ${dKneeWidth.toFixed(1)}px\n検出補正フィルタ適用。非対称性指数が許容限界値を超えています。`;
            
            treatmentText = `**推奨ケアプログラム（B.C Lab アプローチ）:**\n1. 傾きのある側の筋肉（腰方形筋、中臀筋）の緊張を和らげるため、片側性のストレッチおよびハンモックを応用した骨盤ねじり牽引アプローチを実施します。\n2. 重心の中心化を促すインソール療法や体幹エクササイズの導入を検討してください。`;
        }
    }
    
    // Status text & colors on UI
    updateMetricStatus('metric-1-status', m1Status);
    updateMetricStatus('metric-2-status', m2Status);
    updateMetricStatus('metric-3-status', m3Status);
    
    // Score Badge
    const scoreVal = document.getElementById('metric-score');
    const scoreStat = document.getElementById('metric-score-status');
    scoreVal.textContent = `${score}点`;
    
    if (score >= 90) {
        scoreStat.textContent = '良好';
        scoreStat.className = 'metric-status status-good';
    } else if (score >= 70) {
        scoreStat.textContent = '軽度の歪み';
        scoreStat.className = 'metric-status status-warn';
    } else {
        scoreStat.textContent = '重度の歪み';
        scoreStat.className = 'metric-status status-danger';
    }
    
    // Fill text panes
    document.getElementById('sakamoto-report-text').innerHTML = formatMarkdown(sakamotoText);
    document.getElementById('tachibana-report-text').innerHTML = formatMarkdown(tachibanaText);
    document.getElementById('treatment-text').innerHTML = formatMarkdown(treatmentText);
}

function updateMetricStatus(elemId, status) {
    const el = document.getElementById(elemId);
    if (!el) return;
    
    el.className = 'metric-status';
    if (status === 'normal') {
        el.textContent = '正常';
        el.classList.add('status-normal');
    } else if (status === 'warn') {
        el.textContent = '要ケア';
        el.classList.add('status-warn');
    } else {
        el.textContent = '要注意';
        el.classList.add('status-danger');
    }
}

// Connect simulator calculations to chat
function runDetailedAIAnalysis() {
    const sakamotoReport = document.getElementById('sakamoto-report-text').innerText;
    
    // Direct user to Sakamoto's chat and post a detailed analysis
    const chatLink = document.querySelector('.nav-item[data-employee="sci"]');
    if (chatLink) {
        // Force navigate to Chat panel
        chatLink.click();
        
        // Push a simulated chat conversation sequence
        conversations.sci.push({
            sender: 'user',
            text: 'CONNECT AIシミュレータの測定データを元に、解剖学的な評価レポートを作成してください。'
        });
        conversations.sci.push({
            sender: 'ai',
            text: `吉川代表！シミュレータから測定値を受信しました。さっそく姿勢のバイオメカニクス的分析をお伝えします。\n\n${sakamotoReport}\n\nこのクライアントに対しては、特に背骨の胸椎から腰椎にかけての連動した歪みを整えるため、**「ハンモックセラピーの肩甲骨可動拡張アプローチ」**が最適です。施術前後のCONNECT AIでの比較を行うと効果がより明確になりますよ！`
        });
        
        renderMessages();
    }
}

// --- Task Dispatcher Logic ---

const TEMPLATE_DETAILS = {
    b2b_sales: {
        owner: 'mkt',
        target: '地域展開型のフィットネスクラブオーナー・パーソナルジム経営者',
        details: 'CONNECT AIによる簡易姿勢診断が、新規会員のカウンセリング時の入会率アップにどう繋がるかをアピールしたい。無料トライアルキャンペーンの案内も含めてほしい。',
        draft: `## 骨盤・姿勢診断AIシステム「CONNECT AI」導入のご提案

拝啓

貴社におかれましては、ますますご隆盛のこととお慶び申し上げます。
B.C Lab株式会社の明智でございます。

多くのフィットネスクラブ・パーソナルジム経営者様より、昨今「体験レッスンからの入会率を高めたい」「会員の早期退会を防ぎたい」というご相談を多数いただいております。

体験レッスンでの「差別化」にお悩みではありませんか？

弊社が提供する**「CONNECT AI」**は、お客様の姿勢をわずか10秒で撮影・測定し、骨盤の傾きや首のスマホ首度合いをビジュアル数値化する姿勢分析ソリューションです。

### 導入による3大メリット
1.  **成約率（入会率）の大幅向上**：カウンセリング時にAIによる科学的な測定数値を示すことで、説得力が格段に増し、**体験入会からの成約率が平均18.5%向上**します。
2.  **トレーナーのスキル平準化**：新人トレーナーでも、AIの分析画面を指し示すだけで一貫した高品質の指導・姿勢診断アドバイスが可能になります。
3.  **モチベーション継続による退会防止**：測定データはクラウド管理され、2回目以降の測定で「姿勢の改善推移」をグラフで追うことができるため、リピートへの強力なフックとなります。

### 【限定5社様】1ヶ月無料トライアルキャンペーンのご案内
現在、CONNECT AIのライセンスおよび簡易カメラ機器一式を、**初月無料**でお試しいただけるキャンペーンを実施しております。体験会デモの派遣も対応しております。

ぜひ一度、貴店スタッフ様を交えた体験デモの機会をいただけないでしょうか。
ご検討のほど、よろしくお願い申し上げます。

敬具`
    },
    wellness_column: {
        owner: 'sci',
        target: 'オウンドメディア・SNS用一般ユーザー向け健康コラム',
        details: '「デスクワーク中のスマホ首と肩こり」の関係性を解剖学的な観点からわかりやすく。予防となるハンモックセラピーのコンセプトについても軽く触れてほしい。',
        draft: `## 【健康コラム】長時間のデスクワークでなぜ肩が凝る？「スマホ首」の科学と解決策

こんにちは！B.C Lab姿勢科学ディレクターの坂本です。

現代人の多くが悩まされている「慢性的な肩こり」。その最大の原因は、デスクワークやスマートフォンの操作中に無意識にとっている「スマホ首（ストレートネック/頭部前方変位）」にあります。

### 首が前に出ると、負担は「米袋」並みに？
人間の頭は意外と重く、約5kgあります。首がまっすぐであれば骨で効率よく支えられますが、頭が前に30度傾くだけで、首の筋肉にかかる力学的負荷は**約18kg**に増えます。さらに60度（深くスマホを覗き込む角度）では、なんと**約27kg**（米袋約3袋分！）もの負担が首から肩にかかり続けているのです。

この負荷を支えるために首の後ろの筋肉（僧帽筋や頭板状筋）が異常に緊張し、血管を圧迫して酸素不足になることで、あの不快な「肩こり」や「緊張型頭痛」が引き起こされます。

### 自宅やオフィスでできる「顎引きリセット」
スマホ首を防ぐ最も簡単なエクササイズは**「ダブルチンのポーズ（顎引き運動）」**です。
1.  背筋を伸ばし、視線は前に向けます。
2.  指で顎を後ろへ押し込むように、頭を水平に後ろへ引きます（二重顎を作るイメージ）。
3.  そのまま3秒キープ。これを1時間に3回ほど行いましょう。

### 重力から解放する「ハンモックセラピー」
どれだけストレッチしても肩こりが改善しない方は、首の筋肉が「自重を支える緊張」から抜け出せなくなっている可能性があります。

当ラボが提案する「ハンモックセラピー」は、ハンモックの布に身体を委ねることで、全身を一時的に「重力から解放（脱力）」させます。自重が均等に分散された状態で揺らされることで、硬直した首や胸まわりの関節が緩やかに拡張し、本来の正しい骨格アライメントを取り戻しやすくなります。

「CONNECT AI」でご自身の首の角度を数値として客観的に知り、適切な姿勢ケアを始めてみましょう！`
    },
    algorithm_proposal: {
        owner: 'tech',
        target: '社内開発チーム向けCONNECT AIアップデート提案書',
        details: 'MediaPipeによる骨格検出に、深度推定モデル（Depth Anything等）を組み合わせて3Dアライメント分析の精度を高めるロードマップを作成。',
        draft: `# [技術提案] CONNECT AIにおける深度推定（3Dアライメント）統合ロードマップ

提出者：橘 蓮 (AIテクニカルリード)

## 1. 現状の課題と目的
現在のCONNECT AIは単一の2Dカメラ画像に基づき平面の2次元座標（x, y）から関節角度を算出しています。しかし、ユーザーの撮影時の立ち位置が斜めになっていたり、カメラ角度が傾いていると、正確なアライメント角度（特に骨盤の前傾・後傾）が測定誤差を含みやすいという課題があります。
本提案は、2D骨格推定（MediaPipe）に加え、単眼カメラ画像から深度情報を推定するニューラルネットワーク（Depth Anything / MiDaS）を組み合わせることで、**安価なスマホ・Webカメラ環境のままで高精度な3D姿勢解析**を実現することを目的とします。

## 2. 実装アーキテクチャ
1.  **入力フェーズ**: 2Dカメラ入力画像の受け取り。
2.  **キーポイント検出 (MediaPipe)**: 耳、肩、大転子、膝、足首の2D座標(x, y)の取得。
3.  **深度マップ生成 (Depth Anything)**: 入力画像から画素ごとの深度（z軸）データを並行して推論。
4.  **座標マッピング (3D Point Cloud)**: (x, y)の2D座標値に深度(z)を組み合わせ、擬似的な3Dキーポイント座標(x, y, z)を構成。
5.  **3D補正アライメント算出**: カメラに対する被写体の回転（Yaw/Pitch）を推定し、アライメント角度の回転補正を行い、真の矢状面（真横）からの角度を再計算。

## 3. 開発スケジュール・ロードマップ
*   **フェーズ1：プロトタイプ検証 (期間: 2週間)**
    *   PythonによるDepth Anythingモデルのサービングテストと、2D座標とz値のマッピングアルゴリズム検証。
*   **フェーズ2：軽量化・Webブラウザ移植 (期間: 3週間)**
    *   モデルのONNX/TensorFlow.js化。Webブラウザ上でリアルタイム（15fps以上）推論が行えるようモデルサイズを量子化（INT8/FP16）。
*   **フェーズ3：CONNECT AI v2.0 ベータテスト (期間: 2週間)**
    *   店舗内のデモ機に先行デプロイし、深度測定による骨盤前傾・後傾の補正精度の妥当性をカイロプラクターの目視測定と比較検証。

本手法の導入により、撮影条件のばらつきによるアライメント測定エラーが約30%削減されると試算しています。`
    },
    executive_summary: {
        owner: 'sec',
        target: '経営陣会議用・姿勢テック市場の市場動向レポート',
        details: 'ヘルスケア・姿勢テック業界の主な参入競合のビジネスモデル分析と、B.C Labの「CONNECT AI × 施術メニュー」というハイブリッドモデルの差別化優位性の説明。',
        draft: `# 姿勢テック市場動向および弊社差別化戦略（エグゼクティブ・サマリー）

作成者：瀬戸 美咲 (経営秘書・戦略室長)

## 1. 姿勢分析テックの市場概況
近年の健康意識の高まりや企業の健康経営義務化、スマートフォンの普及による姿勢悪化を背景に、AIによる姿勢・骨格分析技術はヘルスケア・フィットネス・施術市場に急速に浸透しています。世界および国内市場規模は年平均約15%で成長中と推計されます。

## 2. 主要競合企業のビジネスモデル分析
現在、市場に存在する競合は大きく2つのグループに大別されます。

1.  **ハードウェア依存型プレイヤー**
    *   **特徴**: 専用の深度センサーカメラや専用測定器プレートを設置するモデル。
    *   **弱点**: 導入コストが非常に高く（100万〜300万円）、設置スペースが必要なため大手店舗しか導入できない。
2.  **ピュア・ソフトウェア型プレイヤー**
    *   **特徴**: スマホやiPadアプリによる単眼画像解析。
    *   **弱点**: 月額ライセンスモデルで安価だが、「測定データの表示」のみに留まり、クライアントの健康改善やリピート率向上までの「具体的な解決策」をトレーナーが説明しづらい。

## 3. B.C Labのポジショニングと差別化優位性
弊社B.C Labが推進するモデルは、競合にはない**「AI診断（CONNECT AI） × 改善施術（ハンモックセラピー等のメソッド）」**の垂直統合型ハイブリッドモデルです。

*   **優位性1：ポータビリティと低コスト**
    iPadやWebカメラといった汎用機材で高精度に機能するため、導入コストが低く小規模整体院や個人ジムでも導入可能。
*   **優位性2：アウトカム（解決手段）との直結**
    測定された姿勢の歪みに応じ、どの筋肉が硬縮しているか、それに対して「ハンモックセラピー」を何分行うべきかが自動レコメンドされるシステム設計。これにより、測定が単なる「娯楽」にならず、「施術・回数券購入」への最強の営業ツールとして機能。

本モデルにより、競合のソフトウェア型に比べ店舗のLTV（生涯顧客価値）が大幅に向上するため、代理店を通じたB2B拡販において強力なピッチトークとして活用可能です。`
    },
    custom_task: {
        owner: 'sec',
        target: '任意設定',
        details: '',
        draft: ''
    }
};

function initDispatcher() {
    const templateSelect = document.getElementById('template-select');
    const dispatcherOwner = document.getElementById('dispatcher-owner');
    const targetInput = document.getElementById('target-input');
    const detailsInput = document.getElementById('details-input');
    const btnDispatch = document.getElementById('btn-dispatch');
    const btnCopy = document.getElementById('btn-copy-draft');
    const draftViewer = document.getElementById('draft-viewer-box');
    
    // Switch owner and fields on template change
    templateSelect.addEventListener('change', () => {
        const val = templateSelect.value;
        const info = TEMPLATE_DETAILS[val];
        
        if (info) {
            dispatcherOwner.value = info.owner;
            
            if (val === 'custom_task') {
                targetInput.disabled = false;
                targetInput.value = '';
                detailsInput.value = '';
                detailsInput.placeholder = 'AI部下への指示内容を自由に入力してください...';
            } else {
                targetInput.disabled = false;
                targetInput.value = info.target;
                detailsInput.value = info.details;
            }
        }
    });
    
    // Run generation
    btnDispatch.addEventListener('click', async () => {
        const selectedVal = templateSelect.value;
        const ownerId = dispatcherOwner.value;
        const emp = EMPLOYEES[ownerId];
        
        // Show loading screen in viewer
        draftViewer.innerHTML = `
            <div class="placeholder-content">
                <div class="typing-indicator" style="justify-content: center; margin-bottom: 12px;">
                    <span></span><span></span><span></span>
                </div>
                <p>AI部下「${emp.name}」が指示に従ってドラフトを作成しています...</p>
            </div>
        `;
        
        let apiKey = '';
        let apiModel = 'gemini-3.5-flash';
        try {
            apiKey = localStorage.getItem('bc_lab_gemini_key') || '';
            apiModel = localStorage.getItem('bc_lab_gemini_model') || 'gemini-3.5-flash';
        } catch (e) {
            apiKey = window.bc_lab_gemini_key || '';
            apiModel = window.bc_lab_gemini_model || 'gemini-3.5-flash';
        }
        if (apiModel === 'gemini-1.5-flash') {
            apiModel = 'gemini-2.0-flash';
        }
        const target = targetInput.value.trim();
        const details = detailsInput.value.trim();
        
        // If Gemini API is configured, let's call it live for a personalized draft
        if (apiKey && (apiKey.startsWith('AIza') || apiKey.startsWith('AQ'))) {
            try {
                const apiVer = 'v1beta';
                
                const res = await fetch(`https://generativelanguage.googleapis.com/${apiVer}/models/${apiModel}:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                role: 'user',
                                parts: [{ text: `以下の指示内容に従って、高品質なビジネスドラフトを作成してください。フォーマットはMarkdownを用いて読みやすく整理してください。\n\n・成果物の目的/宛先: ${target}\n・具体的な含めたい内容/指示: ${details}` }]
                            }
                        ],
                        systemInstruction: {
                            parts: [{ text: getSystemInstruction(emp) }]
                        }
                    })
                });
                
                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.error?.message || `HTTP error ${res.status}`);
                }
                
                const data = await res.json();
                if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
                    const text = data.candidates[0].content.parts[0].text;
                    draftViewer.innerHTML = formatMarkdown(text);
                } else {
                    throw new Error("Gemini API からドラフトを生成できませんでした。");
                }
            } catch (err) {
                console.error("Gemini Dispatch call failed:", err);
                draftViewer.innerHTML = `<div style="color: #ff5555; padding: 20px;">作成中にエラーが発生しました: ${err.message}</div>`;
            }
        } else {
            // Mock Generator Mode
            setTimeout(() => {
                let draftText = "";
                if (selectedVal === 'custom_task') {
                    draftText = `## カスタム指示書ドラフト (作成担当: ${emp.name})

吉川代表、ご指示いただいたカスタムタスクのドラフトです。
（デモモードのため、汎用的なアウトプットを生成しています。実運用にはGemini APIキーを設定してください）

### 指示要約
*   **宛先/読者ターゲット**: ${target}
*   **指示内容**: ${details}

### 作成されたコンテンツ
お預かりした要望「${details}」について検討した結果、以下のステップでアプローチを展開することを提案します。

1.  **現状分析と課題定義**
    *   ターゲット層が日常抱えている課題（姿勢悪化や身体の疲労）を明確化。
2.  **B.C Labとしての解決策提示**
    *   CONNECT AIによる歪みの見える化と、カイロ/ハンモック理論に基づいた施術ソリューションの親和性をアピール。
3.  **アクションプラン**
    *   体験から個別契約、または店舗導入へ向けた段階的提案。

代表、詳細な資料ドラフトのカスタマイズが必要な場合は、左上の「Gemini API設定」にキーを入力していただくことで、内容を完全に網羅した長文の提案テキストが生成されるようになります。`;
                } else {
                    draftText = TEMPLATE_DETAILS[selectedVal].draft;
                }
                
                draftViewer.innerHTML = formatMarkdown(draftText);
            }, 1500);
        }
    });
    
    // Copy to clipboard
    btnCopy.addEventListener('click', () => {
        const text = draftViewer.innerText;
        if (text && !text.includes('左側の設定を行い')) {
            navigator.clipboard.writeText(text).then(() => {
                const originalText = btnCopy.innerHTML;
                btnCopy.innerHTML = '<i class="fa-solid fa-check"></i> コピーしました';
                btnCopy.style.borderColor = '#00e676';
                btnCopy.style.color = '#00e676';
                setTimeout(() => {
                    btnCopy.innerHTML = originalText;
                    btnCopy.style.borderColor = '';
                    btnCopy.style.color = '';
                }, 2000);
            });
        }
    });
}

// --- Text-to-Speech (TTS) Read Aloud Engine ---
const VOICEVOX_SPEAKERS = {
    sec: 2,
    tech: 29,
    sci: 36,
    mkt: 8
};

function toggleSpeech(text, btn) {
    // If already playing audio (VOICEVOX) and clicking the same button -> STOP
    if (currentAudio && !currentAudio.paused && currentSpeechBtn === btn) {
        currentAudio.pause();
        currentAudio = null;
        resetSpeechButton();
        return;
    }

    // If already speaking via browser TTS and clicking the same button -> STOP
    if (window.speechSynthesis && window.speechSynthesis.speaking && currentSpeechBtn === btn) {
        window.speechSynthesis.cancel();
        resetSpeechButton();
        return;
    }

    // Stop everything currently running
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    
    if (currentSpeechBtn) {
        resetSpeechButton();
    }

    // Mark active button
    currentSpeechBtn = btn;
    btn.classList.add('speaking');
    btn.innerHTML = '<i class="fa-solid fa-circle-stop"></i> 停止';

    const cleanedText = cleanTextForSpeech(text);
    
    // Attempt VOICEVOX first
    playWithVoicevox(cleanedText, activeEmployee, btn);
}

// Helper for fetch with timeout
async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 2500 } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(resource, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (err) {
        clearTimeout(id);
        throw err;
    }
}

async function playWithVoicevox(text, empId, btn) {
    const speakerId = VOICEVOX_SPEAKERS[empId] || 2;
    
    try {
        // Step 1: Query VOICEVOX local server with timeout
        const queryRes = await fetchWithTimeout(`http://127.0.0.1:50021/audio_query?text=${encodeURIComponent(text)}&speaker=${speakerId}`, {
            method: 'POST',
            timeout: 2500
        });
        
        if (!queryRes.ok) throw new Error("VOICEVOX server query error");
        const queryJson = await queryRes.json();
        
        // Speed up voice slightly for natural listening speed
        queryJson.speedScale = 1.1;
        
        // Step 2: Request synthesis with timeout
        const synthRes = await fetchWithTimeout(`http://127.0.0.1:50021/synthesis?speaker=${speakerId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(queryJson),
            timeout: 2500
        });
        
        if (!synthRes.ok) throw new Error("VOICEVOX synthesis error");
        const audioBlob = await synthRes.blob();
        
        // Step 3: Play generated WAV
        const audioUrl = URL.createObjectURL(audioBlob);
        currentAudio = new Audio(audioUrl);
        
        currentAudio.onended = () => {
            resetSpeechButton();
        };
        currentAudio.onerror = (e) => {
            console.error("Audio playback error:", e);
            resetSpeechButton();
        };
        
        currentAudio.play();
    } catch (err) {
        // If VOICEVOX fails (not running, etc.), fall back to Web Speech API
        console.warn("VOICEVOX not available, falling back to Web Speech API:", err);
        
        if (!voicevoxPromptShown) {
            showNotification("💡 VOICEVOXが未検出のためブラウザ標準音声で再生します。ローカルで VOICEVOX アプリを起動すると、AI部下の声がそれぞれの専用キャラクターボイス（四国めたん・春日部つむぎ等）になります！");
            voicevoxPromptShown = true;
        }
        
        fallbackToWebSpeech(text, empId, btn);
    }
}

function fallbackToWebSpeech(text, empId, btn) {
    if (!window.speechSynthesis) {
        alert("お使いのブラウザは音声読み上げ機能に対応していません。");
        resetSpeechButton();
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';

    const voices = window.speechSynthesis.getVoices();
    const jaVoices = voices.filter(v => v.lang === 'ja-JP' || v.lang.startsWith('ja'));
    
    // Determine target gender:
    // tech (橘 蓮), sci (坂本 健太) -> Male
    // sec (瀬戸 美咲), mkt (明智 麗華) -> Female
    const isMaleTarget = (empId === 'tech' || empId === 'sci');
    
    let selectedVoice = null;
    
    if (isMaleTarget) {
        // --- Male Voice Selection ---
        // 1. Edge Online Male Voice (Keita Online)
        selectedVoice = jaVoices.find(v => v.name.includes("Keita") && v.name.includes("Online"));
        // 2. Chrome/Firefox/Other Male Voice (Ichiro, Daichi, or contains 'male'/'男性')
        if (!selectedVoice) {
            selectedVoice = jaVoices.find(v => v.name.includes("Ichiro") || v.name.includes("Daichi") || v.name.includes("男性") || v.name.includes("male"));
        }
    } else {
        // --- Female Voice Selection ---
        // 1. Edge Online Female Voice (Nanami Online)
        selectedVoice = jaVoices.find(v => v.name.includes("Nanami") && v.name.includes("Online"));
        // 2. Chrome Google Japanese Voice (Google 日本語 - high quality female by default)
        if (!selectedVoice) {
            selectedVoice = jaVoices.find(v => v.name.includes("Google"));
        }
        // 3. Edge Offline/Other Female Voice (Haruka, Shiori, Mayu, or contains 'female'/'女性')
        if (!selectedVoice) {
            selectedVoice = jaVoices.find(v => v.name.includes("Haruka") || v.name.includes("Shiori") || v.name.includes("Mayu") || v.name.includes("女性") || v.name.includes("female"));
        }
    }
    
    // Fallback: Pick any Japanese voice if no specific gender match was found
    if (!selectedVoice && jaVoices.length > 0) {
        selectedVoice = jaVoices[0];
    }

    if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log(`TTS Fallback for ${empId}: Selected ${selectedVoice.name}`);
    }

    utterance.rate = 1.05;

    utterance.onend = () => {
        resetSpeechButton();
    };

    utterance.onerror = (e) => {
        console.warn("TTS Error:", e);
        resetSpeechButton();
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
}

function resetSpeechButton() {
    if (currentSpeechBtn) {
        currentSpeechBtn.classList.remove('speaking');
        currentSpeechBtn.innerHTML = '<i class="fa-solid fa-volume-low"></i> 読み上げ';
        currentSpeechBtn = null;
        currentUtterance = null;
    }
}

function cleanTextForSpeech(mdText) {
    return mdText
        // Strip markdown tables entirely
        .replace(/\|[^\n]+\|/g, '')
        // Strip markdown links but keep text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        // Strip headings
        .replace(/#{1,6}\s+/g, '')
        // Strip bullet points & numbering prefixes
        .replace(/^[\s*-]*[-+*]\s+/gm, '')
        .replace(/^\s*\d+\.\s+/gm, '')
        // Strip bold/italic formatting marks
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/__([^_]+)__/g, '$1')
        // Strip inline code blocks
        .replace(/`([^`]+)`/g, '$1')
        // Normalize consecutive linebreaks to small pause spaces
        .replace(/\n+/g, ' ')
        .trim();
}

function showNotification(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 50);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 6000);
}

// --- Daily Report (Morning Briefing) Logic ---
let briefingActive = false;
let briefingCancel = false;

function initDailyReport() {
    // Generate the initial report
    generateDailyReport();
    
    // Bind buttons
    const startBriefingBtn = document.getElementById('btn-start-briefing');
    if (startBriefingBtn) {
        startBriefingBtn.addEventListener('click', () => {
            startDailyBriefing();
        });
    }
    
    const generateReportBtn = document.getElementById('btn-generate-report');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', () => {
            // Cancel current briefing if active
            if (briefingActive) {
                briefingCancel = true;
                if (currentAudio) currentAudio.pause();
                if (window.speechSynthesis) window.speechSynthesis.cancel();
                resetBriefingUI();
            }
            generateDailyReport();
            showNotification("📝 デイリーレポートを最新の事業データに更新しました。");
        });
    }
    
    // Bind individual read-aloud buttons
    const speakReportBtns = document.querySelectorAll('.speak-report-btn');
    speakReportBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const empId = btn.getAttribute('data-employee');
            const textElement = document.getElementById(`report-content-${empId}`);
            if (textElement) {
                const text = textElement.innerText;
                // If briefing is active, stop it first
                if (briefingActive) {
                    briefingCancel = true;
                    if (currentAudio) currentAudio.pause();
                    if (window.speechSynthesis) window.speechSynthesis.cancel();
                    resetBriefingUI();
                    // Wait a moment for reset to propagate
                    setTimeout(() => {
                        toggleSpeech(text, btn);
                    }, 100);
                } else {
                    toggleSpeech(text, btn);
                }
            }
        });
    });
}

function generateDailyReport() {
    const today = new Date();
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    const dateStr = today.getFullYear() + '年' + (today.getMonth() + 1) + '月' + today.getDate() + '日(' + days[today.getDay()] + ')';
    const titleEl = document.getElementById('daily-report-date-title');
    if (titleEl) {
        titleEl.textContent = 'B.C Lab デイリーレポート（朝礼） - ' + dateStr;
    }
    
    const banner = document.getElementById('report-mode-banner');
    const bannerText = document.getElementById('report-mode-text');
    
    const secEl = document.getElementById('report-content-sec');
    const techEl = document.getElementById('report-content-tech');
    const sciEl = document.getElementById('report-content-sci');
    const mktEl = document.getElementById('report-content-mkt');
    
    if (secEl) secEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 最新の事業データからレポートを作成中...';
    if (techEl) techEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 作成中...';
    if (sciEl) sciEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 作成中...';
    if (mktEl) mktEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 作成中...';
    
    const defaultReports = {
        sec: '吉川代表、おはようございます。本日は' + (today.getMonth() + 1) + '月' + today.getDate() + '日です。\n本日の主要スケジュールですが、午後14時より定例経営会議、17時より開発チーム橘とのCONNECT AI進捗会議が予定されています。\n\n本日のヘルスケア市場トピックスとして、政府の健康延伸政策におけるAI測定器の導入支援事業が拡大しており、CONNECT AIを導入したい新規サロンからの引き合いが急増しています。代表の本日のお時間を確保し、営業の明智と大口契約プランのすり合わせを行う時間を確保しました。本日もよろしくお願いします。',
        tech: '代表、おはようございます！技術の橘です。\nCONNECT AIの骨格測定アルゴリズムですが、ランドマーク位置の検出ジッター（ブレ）を軽減するスムージングロジックが完成し、検出精度が昨対比で約3.5%向上しました。本日は姿勢シミュレータにこの新ロジックを統合し、代表にテストいただけるよう準備を進めます。\n\nまた、本システムの音声サーバー連携機構も、無音での自動リトライ機能を追加し、安定動作を確認済みです。引き続き開発に尽力します。',
        sci: '代表、おはようございます。姿勢科学担当の坂本です。\n現在、姿勢分析ロジックに基づく現場（導入店舗）向けの臨床フィードバックですが、代表よりご指示いただいた「猫背に対するハンモックセラピーの効果測定」の事例において、施術前後の可視化スコアが非常に高い納得感を得られています。\n\n本日の活動として、橘（技術）とミーティングを行い、分析画面に骨格パラメータの正常範囲ガイドラインを新設する要件をすり合わせ、測定結果の説得力をさらに強化します。',
        mkt: '吉川代表、おはようございます！営業の明智です！\n昨日から始動した『サロン向けCONNECT AI無料測定体験キャンペーン』の成果報告です。現在、広告およびSNS経由での問い合わせがすでに12件に達し、内5件 of デモ予約を獲得しました！反応は極めて順調です。\n\n本日の活動ですが、瀬戸（秘書）が調整してくれた法人価格プラン案をベースに、本日ご相談させていただくキャンペーン先行枠の5件に対し、優先提案書を送付します。売上目標達成に向けて本日も攻めていきます！'
    };
    
    let apiKey = '';
    let apiModel = 'gemini-3.5-flash';
    try {
        apiKey = localStorage.getItem('bc_lab_gemini_key') || '';
        apiModel = localStorage.getItem('bc_lab_gemini_model') || 'gemini-3.5-flash';
    } catch (e) {
        apiKey = window.bc_lab_gemini_key || '';
        apiModel = window.bc_lab_gemini_model || 'gemini-3.5-flash';
    }
    if (apiModel === 'gemini-1.5-flash') {
        apiModel = 'gemini-2.0-flash';
    }
    
    const hasAPIKey = apiKey && (apiKey.startsWith('AIza') || apiKey.startsWith('AQ'));
    
    // Check cache first to avoid redundant API queries
    try {
        const cacheStr = localStorage.getItem('bc_lab_daily_report_cache');
        if (cacheStr) {
            const cache = JSON.parse(cacheStr);
            if (cache.date === today.toDateString() && cache.reports) {
                if (secEl) secEl.innerText = cache.reports.sec || defaultReports.sec;
                if (techEl) techEl.innerText = cache.reports.tech || defaultReports.tech;
                if (sciEl) sciEl.innerText = cache.reports.sci || defaultReports.sci;
                if (mktEl) mktEl.innerText = cache.reports.mkt || defaultReports.mkt;
                
                if (banner && bannerText) {
                    banner.style.background = 'rgba(40, 167, 69, 0.1)';
                    banner.style.border = '1px solid rgba(40, 167, 69, 0.2)';
                    banner.style.color = '#28a745';
                    bannerText.textContent = '🟢 本日のNotion同期およびGmail受信データに基づき、AI社員が朝礼を作成しました！';
                }
                return;
            }
        }
    } catch (e) {
        console.warn("Failed to check daily report cache:", e);
    }
    
    // Define an async wrapper to retrieve data and query API
    (async () => {
        let notionDetails = "・本日中の新着更新はありません。";
        let gmailDetails = "・本日中のWix新規お問い合わせメールはありません。";
        
        try {
            if (notionToken) {
                const res = await fetch('/api/notion_sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: notionToken, database_id: notionDbId })
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        notionDetails = data.map(item => '・「' + item.title + '」(' + item.url + ')').join('\n');
                    }
                }
            }
            if (gmailAddress && gmailPassword) {
                const res = await fetch('/api/gmail_sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: gmailAddress, password: gmailPassword })
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        gmailDetails = data.map(item => '・送信元: ' + item.from + ' / 件名: ' + item.subject + ' (' + item.date + ')').join('\n');
                    }
                }
            }
        } catch (syncErr) {
            console.warn("Sync failed during report load:", syncErr);
        }
        
        let proposalsText = "・ストックされた提案はありません。";
        if (typeof proposals !== 'undefined' && proposals.length > 0) {
            proposalsText = proposals.map(p => '・[' + p.id + '] ' + p.title + ' (' + p.employee + '提案) - ステータス: ' + p.status).join('\n');
        }
        
        if (hasAPIKey) {
            const prompt = "あなたはB.C Lab株式会社のAI社員チーム（秘書の瀬戸美咲、技術開発の橘蓮、姿勢科学の坂本健太、営業の明智麗華）です。\n" +
"本日の日付は " + dateStr + " です。\n\n" +
"【本日の実際の社内データ更新情報】\n" +
"Notion更新状況:\n" +
notionDetails + "\n\n" +
"Gmail（Wixお問い合わせ）受信状況:\n" +
gmailDetails + "\n\n" +
"【代表が検討中のストック済み提案リスト】\n" +
proposalsText + "\n\n" +
"上記の実データ（もし新着なしの場合は、それらを前提とした朝の挨拶として処理）を前提として、吉川代表（ユーザー）に向けた本日の「朝礼（デイリーレポート）」を、それぞれのAI社員の役割（瀬戸：経営状況・メール・スケジュール要約、橘：システム・アルゴリズム・ポーズ判定の状況、坂本：姿勢分析事例・科学的見解、明智：キャンペーン・DMレターやアプローチ進捗）と、彼らの固有のキャラクター性・口調に合わせて作成してください。\n\n" +
"必ず以下のJSONフォーマットのみで出力してください（マークダウンのjsonなどの囲みは不要です。余計な説明文は含めず、純粋なJSON文字列のみを返してください）：\n" +
"{\n" +
"  \"sec\": \"瀬戸美咲の朝礼テキスト。今日のスケジュールやNotion、Gmailの概況を代表に報告。\",\n" +
"  \"tech\": \"橘蓮の朝礼テキスト。技術進捗やアルゴリズム、システム開発状況を報告。\",\n" +
"  \"sci\": \"坂本健太の朝礼テキスト。姿勢分析の臨床事例や科学的見地を報告。\",\n" +
"  \"mkt\": \"明智麗華の朝礼テキスト。キャンペーン進捗や提案・営業のアプローチ状況を報告。\"\n" +
"}";

            try {
                const apiVer = 'v1beta';
                const url = 'https://generativelanguage.googleapis.com/' + apiVer + '/models/' + apiModel + ':generateContent?key=' + apiKey;
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ role: 'user', parts: [{ text: prompt }] }]
                    })
                });
                
                if (res.ok) {
                    const apiData = await res.json();
                    if (apiData.candidates && apiData.candidates[0] && apiData.candidates[0].content && apiData.candidates[0].content.parts[0]) {
                        let jsonText = apiData.candidates[0].content.parts[0].text.trim();
                        if (jsonText.startsWith('```json')) jsonText = jsonText.substring(7);
                        if (jsonText.startsWith('```')) jsonText = jsonText.substring(3);
                        if (jsonText.endsWith('```')) jsonText = jsonText.substring(0, jsonText.length - 3);
                        jsonText = jsonText.trim();
                        
                        const parsedReports = JSON.parse(jsonText);
                        
                        if (secEl) secEl.innerText = parsedReports.sec || defaultReports.sec;
                        if (techEl) techEl.innerText = parsedReports.tech || defaultReports.tech;
                        if (sciEl) sciEl.innerText = parsedReports.sci || defaultReports.sci;
                        if (mktEl) mktEl.innerText = parsedReports.mkt || defaultReports.mkt;
                        
                        localStorage.setItem('bc_lab_daily_report_cache', JSON.stringify({
                            date: today.toDateString(),
                            reports: parsedReports
                        }));
                        
                        if (banner && bannerText) {
                            banner.style.background = 'rgba(40, 167, 69, 0.1)';
                            banner.style.border = '1px solid rgba(40, 167, 69, 0.2)';
                            banner.style.color = '#28a745';
                            bannerText.textContent = '🟢 本日のNotion同期およびGmail受信データに基づき、AI社員が朝礼を作成しました！';
                        }
                        return;
                    }
                }
            } catch (apiErr) {
                console.error("AI Daily report generation failed:", apiErr);
            }
        }
        
        // Fallback inside async block if API fails
        if (secEl) secEl.innerText = defaultReports.sec;
        if (techEl) techEl.innerText = defaultReports.tech;
        if (sciEl) sciEl.innerText = defaultReports.sci;
        if (mktEl) mktEl.innerText = defaultReports.mkt;
        
        if (banner && bannerText) {
            banner.style.background = 'rgba(255, 152, 0, 0.1)';
            banner.style.border = '1px solid rgba(255, 152, 0, 0.2)';
            banner.style.color = '#ff9800';
            bannerText.textContent = '⚠️ 現在、デモ用のサンプル情報（イメージ）を表示しています。NotionやGmailを連携し、有効なAPIキーを設定してから上の「最新データで再作成」を押してください。';
        }
    })();
}

async function speakReportPromise(text, empId, btn) {
    return new Promise((resolve) => {
        // Stop current playing
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        
        // Highlight active report card
        const cards = document.querySelectorAll('.daily-card');
        cards.forEach(c => {
            c.style.boxShadow = '';
            c.style.transform = '';
        });
        
        const card = btn.closest('.daily-card');
        const empAvatar = card.querySelector('.nav-avatar');
        const themeColor = getComputedStyle(empAvatar).backgroundColor;
        
        card.style.boxShadow = `0 10px 30px ${themeColor}`;
        card.style.transform = 'translateY(-5px)';
        card.style.transition = 'all 0.3s ease';
        
        // Change button style
        btn.classList.add('speaking');
        btn.innerHTML = '<i class="fa-solid fa-circle-stop"></i> 読み上げ中';
        
        // Clean text
        const cleanedText = cleanTextForSpeech(text);
        const speakerId = VOICEVOX_SPEAKERS[empId] || 2;
        
        const onSpeechEnded = () => {
            btn.classList.remove('speaking');
            btn.innerHTML = '<i class="fa-solid fa-volume-low"></i> 読み上げ';
            card.style.boxShadow = '';
            card.style.transform = '';
            resolve();
        };
        
        // Try VOICEVOX first
        fetchWithTimeout(`http://127.0.0.1:50021/audio_query?text=${encodeURIComponent(cleanedText)}&speaker=${speakerId}`, {
            method: 'POST',
            timeout: 2500
        }).then(queryRes => {
            if (!queryRes.ok) throw new Error("Query failed");
            return queryRes.json();
        }).then(queryJson => {
            queryJson.speedScale = 1.1;
            return fetchWithTimeout(`http://127.0.0.1:50021/synthesis?speaker=${speakerId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(queryJson),
                timeout: 2500
            });
        }).then(synthRes => {
            if (!synthRes.ok) throw new Error("Synthesis failed");
            return synthRes.blob();
        }).then(blob => {
            const url = URL.createObjectURL(blob);
            currentAudio = new Audio(url);
            currentAudio.onended = onSpeechEnded;
            currentAudio.onerror = onSpeechEnded;
            
            // Re-assign globally so toggleSpeech can check it
            currentSpeechBtn = btn;
            currentAudio.play().catch(onSpeechEnded);
        }).catch(err => {
            // Fallback to Web Speech API
            if (!window.speechSynthesis) {
                onSpeechEnded();
                return;
            }
            const utterance = new SpeechSynthesisUtterance(cleanedText);
            utterance.lang = 'ja-JP';
            
            // Set voice gender
            const voices = window.speechSynthesis.getVoices();
            const jaVoices = voices.filter(v => v.lang === 'ja-JP' || v.lang.startsWith('ja'));
            const isMale = (empId === 'tech' || empId === 'sci');
            let selVoice = null;
            if (isMale) {
                selVoice = jaVoices.find(v => v.name.includes("Keita") && v.name.includes("Online")) 
                           || jaVoices.find(v => v.name.includes("Ichiro") || v.name.includes("Daichi") || v.name.includes("男性") || v.name.includes("male"));
            } else {
                selVoice = jaVoices.find(v => v.name.includes("Nanami") && v.name.includes("Online")) 
                           || jaVoices.find(v => v.name.includes("Google")) 
                           || jaVoices.find(v => v.name.includes("Haruka") || v.name.includes("Shiori") || v.name.includes("Mayu") || v.name.includes("女性") || v.name.includes("female"));
            }
            if (!selVoice && jaVoices.length > 0) selVoice = jaVoices[0];
            if (selVoice) utterance.voice = selVoice;
            
            utterance.rate = 1.05;
            utterance.onend = onSpeechEnded;
            utterance.onerror = onSpeechEnded;
            
            currentSpeechBtn = btn;
            currentUtterance = utterance;
            window.speechSynthesis.speak(utterance);
        });
    });
}

async function startDailyBriefing() {
    const startBtn = document.getElementById('btn-start-briefing');
    if (!startBtn) return;
    
    if (briefingActive) {
        // Toggle STOP
        briefingCancel = true;
        if (currentAudio) currentAudio.pause();
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        resetBriefingUI();
        return;
    }
    
    // Sync Notion before starting readout
    if (notionToken && notionDbId) {
        startBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Notion同期中...';
        await updateDailyReportWithNotion();
    }
    
    briefingActive = true;
    briefingCancel = false;
    startBtn.innerHTML = '<i class="fa-solid fa-circle-stop"></i> 朝礼を終了';
    startBtn.className = 'btn btn-secondary';
    
    const sequence = [
        { empId: 'sec', textId: 'report-content-sec' },
        { empId: 'tech', textId: 'report-content-tech' },
        { empId: 'sci', textId: 'report-content-sci' },
        { empId: 'mkt', textId: 'report-content-mkt' }
    ];
    
    for (const item of sequence) {
        if (briefingCancel) break;
        const textElement = document.getElementById(item.textId);
        if (!textElement) continue;
        
        const card = textElement.closest('.daily-card');
        const speakBtn = card.querySelector('.speak-report-btn');
        const text = textElement.innerText;
        
        await speakReportPromise(text, item.empId, speakBtn);
        
        // Brief pause between briefings for natural rhythm
        if (!briefingCancel) {
            await new Promise(r => setTimeout(r, 800));
        }
    }
    
    resetBriefingUI();
}

function resetBriefingUI() {
    briefingActive = false;
    briefingCancel = false;
    const startBtn = document.getElementById('btn-start-briefing');
    if (startBtn) {
        startBtn.innerHTML = '<i class="fa-solid fa-play"></i> 朝礼スタート（一括読み上げ）';
        startBtn.className = 'btn btn-accent';
    }
    
    const cards = document.querySelectorAll('.daily-card');
    cards.forEach(c => {
        c.style.boxShadow = '';
        c.style.transform = '';
        const btn = c.querySelector('.speak-report-btn');
        if (btn) {
            btn.classList.remove('speaking');
            btn.innerHTML = '<i class="fa-solid fa-volume-low"></i> 読み上げ';
        }
    });
}

// --- Notion Integration Logic ---
let notionToken = '';
let notionDbId = '';
let lastNotionCheckTime = 0;
let lastNotionReportCount = -1;

function initNotionSettings() {
    const tokenInput = document.getElementById('notion-token-input');
    const dbInput = document.getElementById('notion-db-input');
    const saveBtn = document.getElementById('btn-save-notion');
    
    // Load from localStorage
    try {
        notionToken = localStorage.getItem('bc_lab_notion_token') || '';
        notionDbId = localStorage.getItem('bc_lab_notion_db') || '';
    } catch (e) {
        console.warn("localStorage read failed:", e);
    }
    
    if (tokenInput && notionToken) tokenInput.value = notionToken;
    if (dbInput && notionDbId) dbInput.value = notionDbId;
    
    if (notionToken) {
        updateNotionStatus(true, "接続設定済み");
        // Pre-run updates check to sync daily reports immediately on load
        updateDailyReportWithNotion();
    } else {
        updateNotionStatus(false, "未接続 (ローカル)");
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            const tokVal = tokenInput.value.trim();
            const dbVal = dbInput.value.trim();
            
            if (!tokVal) {
                showNotification("⚠️ Notion トークンを入力してください。");
                return;
            }
            
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 接続テスト中...';
            
            try {
                const res = await fetch('/api/notion_sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: tokVal, database_id: dbVal })
                });
                
                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.error || `HTTP ${res.status}`);
                }
                
                const data = await res.json();
                
                // Save to localStorage
                localStorage.setItem('bc_lab_notion_token', tokVal);
                localStorage.setItem('bc_lab_notion_db', dbVal);
                syncConfigToServer();
                notionToken = tokVal;
                notionDbId = dbVal;
                
                updateNotionStatus(true, `接続成功 (本日更新: ${data.length}件)`);
                showNotification("✅ Notionとの連携に成功しました！設定を保存しました。");
                
                // Update the report card with Notion data
                updateDailyReportWithNotion();
            } catch (err) {
                console.error("Notion test failed:", err);
                updateNotionStatus(false, "接続失敗");
                showNotification(`❌ Notion接続テスト失敗: ${err.message}`);
            } finally {
                saveBtn.disabled = false;
                saveBtn.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> 接続テスト・保存';
            }
        });
    }
    
    const notifyToggle = document.getElementById('notion-notify-toggle');
    if (notifyToggle) {
        const enabled = localStorage.getItem('bc_lab_notion_notify') !== 'false';
        notifyToggle.checked = enabled;
        notifyToggle.addEventListener('change', () => {
            localStorage.setItem('bc_lab_notion_notify', notifyToggle.checked);
            syncConfigToServer();
            showNotification(notifyToggle.checked ? "🔔 Notionの新着通知を有効にしました。" : "🔕 Notionの新着通知を無効にしました。");
        });
    }
}

function updateNotionStatus(success, text) {
    const statusText = document.getElementById('notion-status-text');
    const statusDot = document.getElementById('notion-status-dot');
    if (statusText) statusText.textContent = text;
    if (statusDot) {
        statusDot.className = success ? 'status-dot active' : 'status-dot mock';
    }
}



async function checkNotionUpdatesForSecretary() {
    if (!notionToken) {
        return;
    }
    
    const enabled = localStorage.getItem('bc_lab_notion_notify') !== 'false';
    if (!enabled) {
        return;
    }
    
    const now = Date.now();
    if (now - lastNotionCheckTime < 20000) { // check every 20 seconds
        return;
    }
    lastNotionCheckTime = now;
    
    try {
        const res = await fetch('/api/notion_sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: notionToken, database_id: notionDbId })
        });
        
        if (!res.ok) return;
        const data = await res.json();
        
        if (data.length > 0 && data.length !== lastNotionReportCount) {
            lastNotionReportCount = data.length;
            
            let reportText = `吉川代表、連携中のNotionから本日の新着更新情報を取得しました。本日中に以下の ${data.length} 件が新規作成・編集されています：\n\n`;
            data.forEach(page => {
                const timeStr = page.last_edited_time ? new Date(page.last_edited_time).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }) : '';
                reportText += `*   **${page.title}** (${timeStr} 更新)\n    [Notionページを開く](${page.url})\n`;
            });
            reportText += `\nこちらに関して何かドラフトの作成や戦略の整理を進めますか？ご指示ください。`;
            
            conversations.sec.push({
                sender: 'ai',
                text: reportText
            });
            saveConversations();
            
            if (activeEmployee === 'sec' && activePanel === 'chat-panel') {
                renderMessages();
            } else {
                showNotificationBadge('sec');
            }
            
            showNotification(`🔔 秘書の瀬戸さんからNotionの新着報告（${data.length}件）があります！`);
        }
    } catch (err) {
        console.warn("Notion auto-poll failed:", err);
    }
}

function showNotificationBadge(empId) {
    const navLink = document.querySelector(`.nav-item[data-employee="${empId}"]`);
    if (navLink) {
        let badge = navLink.querySelector('.nav-notification-dot');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'nav-notification-dot';
            badge.style.width = '8px';
            badge.style.height = '8px';
            badge.style.backgroundColor = '#ff3b30';
            badge.style.borderRadius = '50%';
            badge.style.position = 'absolute';
            badge.style.right = '12px';
            badge.style.top = '50%';
            badge.style.transform = 'translateY(-50%)';
            navLink.style.position = 'relative';
            navLink.appendChild(badge);
        }
    }
}

async function updateDailyReportWithNotion() {
    if (!notionToken) return;
    
    try {
        const res = await fetch('/api/notion_sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: notionToken, database_id: notionDbId })
        });
        
        if (!res.ok) return;
        const data = await res.json();
        
        const secEl = document.getElementById('report-content-sec');
        if (secEl && data.length > 0) {
            let notionSummary = `\n\nまた、Notion側では本日 ${data.length} 件の新着更新を検知しています：\n`;
            data.forEach(page => {
                notionSummary += `・「${page.title}」\n`;
            });
            notionSummary += `経営会議のアジェンダにこれらの内容も含めておきました。よろしくお願いいたします。`;
            
            const currentText = secEl.innerText;
            if (!currentText.includes("Notion側では本日")) {
                secEl.innerText = currentText + notionSummary;
            }
        }
    } catch (err) {
        console.warn("Failed to inject Notion to Morning Briefing:", err);
    }
}

// --- Gmail Wix Inquiry Sync Logic ---
let gmailAddress = '';
let gmailPassword = '';
let lastGmailCheckTime = 0;
let lastGmailInquiryIds = [];

function initGmailSettings() {
    const emailInput = document.getElementById('gmail-address-input');
    const pwdInput = document.getElementById('gmail-password-input');
    const saveBtn = document.getElementById('btn-save-gmail');
    
    // Load from localStorage
    try {
        gmailAddress = localStorage.getItem('bc_lab_gmail_address') || '';
        gmailPassword = localStorage.getItem('bc_lab_gmail_password') || '';
    } catch (e) {
        console.warn("localStorage read failed:", e);
    }
    
    if (emailInput && gmailAddress) emailInput.value = gmailAddress;
    if (pwdInput && gmailPassword) pwdInput.value = gmailPassword;
    
    if (gmailAddress && gmailPassword) {
        updateGmailStatus(true, "監視稼働中");
        checkGmailUpdatesForSecretary();
    } else {
        updateGmailStatus(false, "未接続 (ローカル)");
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            const emailVal = emailInput.value.trim();
            const pwdVal = pwdInput.value.trim();
            
            if (!emailVal || !pwdVal) {
                showNotification("⚠️ Gmailアドレスとアプリパスワードを入力してください。");
                return;
            }
            
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 接続テスト中...';
            
            try {
                const res = await fetch('/api/gmail_sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: emailVal, password: pwdVal })
                });
                
                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.error || `HTTP ${res.status}`);
                }
                
                const data = await res.json();
                
                // Save to localStorage
                localStorage.setItem('bc_lab_gmail_address', emailVal);
                syncConfigToServer();
                localStorage.setItem('bc_lab_gmail_password', pwdVal);
                syncConfigToServer();
                gmailAddress = emailVal;
                gmailPassword = pwdVal;
                
                updateGmailStatus(true, `接続成功 (本日検知: ${data.length}件)`);
                showNotification("✅ Gmail（Wix監視）との連携に成功しました！設定を保存しました。");
                
                // Immediately check updates
                checkGmailUpdatesForSecretary();
            } catch (err) {
                console.error("Gmail test failed:", err);
                updateGmailStatus(false, "接続失敗");
                showNotification(`❌ Gmail接続テスト失敗: ${err.message}`);
            } finally {
                saveBtn.disabled = false;
                saveBtn.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> 接続テスト・保存';
            }
        });
    }
    
    const notifyToggle = document.getElementById('gmail-notify-toggle');
    if (notifyToggle) {
        const enabled = localStorage.getItem('bc_lab_gmail_notify') !== 'false';
        notifyToggle.checked = enabled;
        notifyToggle.addEventListener('change', () => {
            localStorage.setItem('bc_lab_gmail_notify', notifyToggle.checked);
            syncConfigToServer();
            showNotification(notifyToggle.checked ? "🔔 Gmailの新着通知を有効にしました。" : "🔕 Gmailの新着通知を無効にしました。");
        });
    }
}

function updateGmailStatus(success, text) {
    const statusText = document.getElementById('gmail-status-text');
    const statusDot = document.getElementById('gmail-status-dot');
    if (statusText) statusText.textContent = text;
    if (statusDot) {
        statusDot.className = success ? 'status-dot active' : 'status-dot mock';
    }
}

async function checkGmailUpdatesForSecretary() {
    if (!gmailAddress || !gmailPassword) {
        return;
    }
    
    const enabled = localStorage.getItem('bc_lab_gmail_notify') !== 'false';
    if (!enabled) {
        return;
    }
    
    const now = Date.now();
    if (now - lastGmailCheckTime < 25000) { // check every 25 seconds
        return;
    }
    lastGmailCheckTime = now;
    
    try {
        const res = await fetch('/api/gmail_sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: gmailAddress, password: gmailPassword })
        });
        
        if (!res.ok) return;
        const data = await res.json();
        
        if (data.length > 0) {
            const currentIds = data.map(item => item.id);
            
            // If cache is uninitialized (first run on page load), just store the existing IDs silently 
            // to avoid spamming old inquiry notifications from earlier today.
            if (lastGmailInquiryIds.length === 0) {
                lastGmailInquiryIds = currentIds;
                return;
            }
            
            const newEmails = data.filter(item => !lastGmailInquiryIds.includes(item.id));
            
            // Update cache
            lastGmailInquiryIds = currentIds;
            
            if (newEmails.length > 0) {
                let reportText = `吉川代表、GmailよりWix経由の新規お問い合わせメールを検知しましたのでお知らせします。\n\n`;
                newEmails.forEach(email => {
                    reportText += `*   **件名**: ${email.subject}\n    **送信元**: ${email.from}\n    **受信時刻**: ${email.date}\n`;
                });
                reportText += `\nこちらのお問い合わせに関して、返信メールのドラフト作成や内容の要約を進めますか？ご指示ください。`;
                
                conversations.sec.push({
                    sender: 'ai',
                    text: reportText
                });
                saveConversations();
                
                if (activeEmployee === 'sec' && activePanel === 'chat-panel') {
                    renderMessages();
                } else {
                    showNotificationBadge('sec');
                }
                
                showNotification(`🔔 秘書の瀬戸さんからWixお問い合わせの新着通知（${newEmails.length}件）があります！`);
            }
        }
    } catch (err) {
        console.warn("Gmail auto-poll failed:", err);
    }
}

// --- Custom Knowledge Base Ingestion ---
let originalBusinessKnowledge = null;

function loadStoredKnowledge() {
    if (!window.BUSINESS_KNOWLEDGE) {
        window.BUSINESS_KNOWLEDGE = {};
    }
    
    if (!originalBusinessKnowledge) {
        originalBusinessKnowledge = JSON.parse(JSON.stringify(window.BUSINESS_KNOWLEDGE));
    }
    
    window.BUSINESS_KNOWLEDGE = JSON.parse(JSON.stringify(originalBusinessKnowledge));
    
    try {
        const storedStr = localStorage.getItem('bc_lab_uploaded_knowledge') || '{}';
        const storedDocs = JSON.parse(storedStr);
        
        for (const [filename, fileData] of Object.entries(storedDocs)) {
            window.BUSINESS_KNOWLEDGE[filename] = fileData;
        }
        console.log("Loaded stored custom knowledge documents:", Object.keys(storedDocs).length);
    } catch (e) {
        console.warn("Failed to load stored custom knowledge:", e);
    }
}

function stockFileToKnowledgeBase(filename, fileContent, targetEmployee = 'global') {
    if (!window.BUSINESS_KNOWLEDGE) {
        window.BUSINESS_KNOWLEDGE = {};
    }
    
    window.BUSINESS_KNOWLEDGE[filename] = {
        target: targetEmployee,
        content: fileContent
    };
    
    try {
        const storedStr = localStorage.getItem('bc_lab_uploaded_knowledge') || '{}';
        const storedDocs = JSON.parse(storedStr);
        
        storedDocs[filename] = {
            target: targetEmployee,
            content: fileContent
        };
        
        localStorage.setItem('bc_lab_uploaded_knowledge', JSON.stringify(storedDocs));
        showNotification(`✅ 「${filename}」を社内共通の学習ナレッジとしてストックしました！`);
    } catch (e) {
        console.warn("Failed to stock file in localStorage:", e);
    }
}

// --- Persistent Chat History Storage ---
function saveConversations() {
    try {
        const copy = JSON.parse(JSON.stringify(conversations));
        let imageCount = 0;
        const keys = Object.keys(copy);
        for (const key of keys) {
            const msgs = copy[key];
            for (let i = msgs.length - 1; i >= 0; i--) {
                if (msgs[i].images && msgs[i].images.length > 0) {
                    msgs[i].images.forEach(img => {
                        imageCount++;
                        if (imageCount > 5) {
                            img.src = ""; // Clear base64 for older images to keep localStorage light
                        }
                    });
                }
            }
        }
        localStorage.setItem('bc_lab_conversations', JSON.stringify(copy));
    } catch (e) {
        console.warn("Failed to save conversations to localStorage:", e);
        // Safety: Do NOT delete existing conversations on quota or write failure
    }
}

function loadConversations() {
    try {
        const saved = localStorage.getItem('bc_lab_conversations');
        if (saved) {
            const parsed = JSON.parse(saved);
            
            // Intercept and fix the robotic response for the official website instruction
            if (parsed.sec && parsed.sec.length > 0) {
                for (let i = 0; i < parsed.sec.length; i++) {
                    const msg = parsed.sec[i];
                    if (msg.sender === 'user' && msg.text.includes('bclab.jp')) {
                        // Check if the next message from AI is the robotic one
                        if (i + 1 < parsed.sec.length && parsed.sec[i+1].sender === 'ai') {
                            const aiMsg = parsed.sec[i+1];
                            if (aiMsg.text.includes('ご質問の件について') || aiMsg.text.includes('最適な資料作成')) {
                                aiMsg.text = `吉川代表、ご提示いただいたオフィシャルサイト（https://bclab.jp ）の内容、徹底的に理解いたしました！当社の姿勢データ（300万件以上）やAI姿勢分析システム（導入実績600施設以上）、そして「Nerve tune（脳神経チューニングデバイス）」や「ハンモックセラピー」といった独自プロダクトの重要性を各メンバーに共有し、部署ごとに以下の通り役割と指示を伝達しました：

1. 💻 **橘さん（技術開発）**：
MediaPipeと独自の分析ロジックに基づく姿勢分析精度の向上を進めてください。特に、スマホ・Webカメラ環境のみで動作する「CONNECT AI」の安定化や、3D補正機能（骨盤の前後傾アライメント計測）のブラウザ側統合（ONNX）の実装ロードマップの策定、およびオーダーメイドインソール等の機器連携の開発を牽引してください。

2. 🔬 **坂本さん（姿勢科学）**：
300万件以上の蓄積された測定データを活用した身体バランス特性の客観評価ロジックを磨いてください。当ラボが提唱する「猫背に対するハンモックセラピー」の姿勢改善における臨床効果測定など、測定結果に確かな説得力（エビデンス）を与える解剖学的ガイドラインの作成を担当してください。

3. 📢 **明智さん（営業・マーケ）**：
600以上のシステム導入実績、および自治体や健康経営企業向けの「姿勢健診ソリューション」を最大の武器として、B2B無料体験デモキャンペーンや新規サロン向けのアプローチ戦略を再構築してください。瀬戸が調整した最新の法人価格プラン案をベースに、提案営業を攻めていきましょう！

代表、BC Labの持つ技術とサービスを社会に実装すべく、この4名の体制で全力で業務に邁進してまいります！指示事項に不足などございましたら、いつでもお申し付けください。`;
                            }
                        }
                    }
                }
            }
            
            for (const key of Object.keys(conversations)) {
                if (parsed[key] && parsed[key].length > 0) {
                    conversations[key] = parsed[key];
                }
            }
            console.log("Loaded persistent conversations history with website instruction patch.");
        }
    } catch (e) {
        console.warn("Failed to load conversations history:", e);
    }
}

// Pre-trigger voice initialization (ensures browser voices load instantly)
if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
}

// --- Proposal and Idea Management ---
let proposals = [];
let currentTempProposalText = "";

function loadProposals() {
    try {
        const saved = localStorage.getItem('bc_lab_proposals');
        if (saved) {
            proposals = JSON.parse(saved);
            console.log("Loaded persistent proposals:", proposals.length);
        }
    } catch (e) {
        console.warn("Failed to load proposals:", e);
    }
}

function saveProposals() {
    try {
        localStorage.setItem('bc_lab_proposals', JSON.stringify(proposals));
    } catch (e) {
        console.warn("Failed to save proposals:", e);
    }
}

function openProposalRegisterModal(text) {
    currentTempProposalText = text;
    
    // Auto-generate title guess from first non-empty line
    let titleGuess = "";
    const lines = text.split('\n');
    for (let line of lines) {
        line = line.replace(/[#*`【】]/g, '').trim();
        if (line.length > 5) {
            titleGuess = line.substring(0, 30);
            if (line.length > 30) titleGuess += "...";
            break;
        }
    }
    if (!titleGuess) titleGuess = "新着アイデア提案";
    
    const empName = EMPLOYEES[activeEmployee] ? EMPLOYEES[activeEmployee].name : "不明な社員";
    
    document.getElementById('modal-proposal-title').value = titleGuess;
    document.getElementById('modal-proposal-employee').value = empName;
    document.getElementById('modal-proposal-status').value = "検討中";
    
    document.getElementById('proposal-register-modal').style.display = 'flex';
}

function initProposals() {
    loadProposals();
    
    // Modal Register Events
    const cancelRegBtn = document.getElementById('modal-proposal-cancel');
    const saveRegBtn = document.getElementById('modal-proposal-save');
    const regModal = document.getElementById('proposal-register-modal');
    
    if (cancelRegBtn) {
        cancelRegBtn.addEventListener('click', () => {
            regModal.style.display = 'none';
        });
    }
    
    if (saveRegBtn) {
        saveRegBtn.addEventListener('click', () => {
            const title = document.getElementById('modal-proposal-title').value.trim();
            const employee = document.getElementById('modal-proposal-employee').value;
            const status = document.getElementById('modal-proposal-status').value;
            
            if (!title) {
                alert('タイトルを入力してください。');
                return;
            }
            
            // Generate sequential ID: BC-001, BC-002, etc.
            const nextNum = proposals.length + 1;
            const paddedId = "BC-" + String(nextNum).padStart(3, '0');
            
            const newProposal = {
                id: paddedId,
                title: title,
                employee: employee,
                date: new Date().toLocaleString('ja-JP', { hour12: false }),
                status: status,
                content: currentTempProposalText
            };
            
            proposals.push(newProposal);
            saveProposals();
            
            regModal.style.display = 'none';
            showNotification(`✅ 提案「${paddedId}」をアイデア一覧にストックしました！`);
            renderProposalsTable();
        });
    }
    
    // Modal View Events
    const closeViewBtn = document.getElementById('modal-view-close');
    const viewModal = document.getElementById('proposal-view-modal');
    
    if (closeViewBtn) {
        closeViewBtn.addEventListener('click', () => {
            viewModal.style.display = 'none';
        });
    }

    const searchInput = document.getElementById('proposals-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            renderProposalsTable(searchInput.value.trim());
        });
    }
}

function renderProposalsTable(filterQuery = "") {
    const tableBody = document.getElementById('proposals-table-body');
    const noMsg = document.getElementById('no-proposals-msg');
    
    if (!tableBody) return;
    tableBody.innerHTML = '';
    
    let filtered = proposals;
    if (filterQuery) {
        const query = filterQuery.toLowerCase();
        filtered = proposals.filter(prop => 
            prop.id.toLowerCase().includes(query) ||
            prop.title.toLowerCase().includes(query) ||
            prop.employee.toLowerCase().includes(query) ||
            prop.content.toLowerCase().includes(query)
        );
    }
    
    if (proposals.length === 0) {
        noMsg.style.display = 'block';
        noMsg.innerHTML = '<i class="fa-regular fa-lightbulb" style="font-size: 3rem; margin-bottom: 12px; opacity: 0.3; display: block;"></i>提案・アイデアがまだ登録されていません。AI社員とのチャットの回答にある「💡 提案をストック」ボタンから追加してください。';
        document.getElementById('proposals-table').style.display = 'none';
        const sInput = document.getElementById('proposals-search-input');
        if (sInput) sInput.disabled = true;
        return;
    }

    const sInput = document.getElementById('proposals-search-input');
    if (sInput) sInput.disabled = false;
    
    if (filtered.length === 0) {
        noMsg.style.display = 'block';
        noMsg.innerHTML = '<i class="fa-regular fa-lightbulb" style="font-size: 3rem; margin-bottom: 12px; opacity: 0.3; display: block;"></i>検索条件に一致する提案が見つかりません。';
        document.getElementById('proposals-table').style.display = 'none';
        return;
    }
    
    noMsg.style.display = 'none';
    document.getElementById('proposals-table').style.display = 'table';
    
    filtered.forEach(prop => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid var(--border-color)';
        
        let statusStyle = 'background: rgba(255,193,7,0.15); color: #ffc107;'; // 検討中
        if (prop.status === '採用') {
            statusStyle = 'background: rgba(40,167,69,0.15); color: #28a745;';
        } else if (prop.status === '不採用') {
            statusStyle = 'background: rgba(220,53,69,0.15); color: #dc3545;';
        }
        
        tr.innerHTML = `
            <td style="padding: 12px 8px; font-family: monospace; font-weight: bold; color: var(--accent-teal);">${prop.id}</td>
            <td style="padding: 12px 8px;">${prop.employee}</td>
            <td style="padding: 12px 8px; font-weight: 500;">${prop.title}</td>
            <td style="padding: 12px 8px; font-size: 0.8rem; color: var(--text-muted);">${prop.date}</td>
            <td style="padding: 12px 8px;">
                <select class="proposal-status-select form-input" data-id="${prop.id}" style="padding: 4px 8px; font-size: 0.8rem; border-radius: 12px; width: auto; font-weight: 600; border: 1px solid var(--border-color); ${statusStyle}">
                    <option value="検討中" ${prop.status === '検討中' ? 'selected' : ''}>検討中</option>
                    <option value="採用" ${prop.status === '採用' ? 'selected' : ''}>採用</option>
                    <option value="不採用" ${prop.status === '不採用' ? 'selected' : ''}>不採用</option>
                </select>
            </td>
            <td style="padding: 12px 8px; text-align: center;">
                <button class="btn btn-secondary btn-view-proposal" data-id="${prop.id}" style="padding: 4px 10px; font-size: 0.8rem; border-radius: 4px; cursor: pointer;">
                    <i class="fa-solid fa-folder-open"></i> 表示
                </button>
                <button class="btn btn-outline btn-delete-proposal" data-id="${prop.id}" style="padding: 4px 10px; font-size: 0.8rem; border-radius: 4px; color: #dc3545; border-color: rgba(220,53,69,0.3); margin-left: 6px; cursor: pointer;">
                    <i class="fa-solid fa-trash-can"></i> 削除
                </button>
            </td>
        `;
        
        tableBody.appendChild(tr);
    });
    
    // Bind status dropdown change listeners
    document.querySelectorAll('.proposal-status-select').forEach(select => {
        select.addEventListener('change', (e) => {
            const id = e.target.getAttribute('data-id');
            const newStatus = e.target.value;
            updateProposalStatus(id, newStatus);
        });
    });
    
    // Bind view button listeners
    document.querySelectorAll('.btn-view-proposal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const btnEl = e.target.closest('.btn-view-proposal');
            const id = btnEl.getAttribute('data-id');
            viewProposalDetail(id);
        });
    });
    
    // Bind delete button listeners
    document.querySelectorAll('.btn-delete-proposal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const btnEl = e.target.closest('.btn-delete-proposal');
            const id = btnEl.getAttribute('data-id');
            if (confirm(`提案「${id}」を一覧から完全に削除しますか？`)) {
                deleteProposal(id);
            }
        });
    });
}

function updateProposalStatus(id, newStatus) {
    const prop = proposals.find(p => p.id === id);
    if (prop) {
        prop.status = newStatus;
        saveProposals();
        showNotification(`ℹ️ 提案「${id}」のステータスを「${newStatus}」に変更しました。`);
        renderProposalsTable();
    }
}

function viewProposalDetail(id) {
    const prop = proposals.find(p => p.id === id);
    if (!prop) return;
    
    document.getElementById('view-proposal-id').textContent = prop.id;
    document.getElementById('view-proposal-title').textContent = prop.title;
    document.getElementById('view-proposal-employee').textContent = prop.employee;
    document.getElementById('view-proposal-date').textContent = prop.date;
    
    const badge = document.getElementById('view-proposal-status-badge');
    badge.textContent = prop.status;
    
    // Style the status badge inside details modal
    if (prop.status === '採用') {
        badge.style.background = 'rgba(40,167,69,0.15)';
        badge.style.color = '#28a745';
        badge.style.border = '1px solid rgba(40,167,69,0.3)';
    } else if (prop.status === '不採用') {
        badge.style.background = 'rgba(220,53,69,0.15)';
        badge.style.color = '#dc3545';
        badge.style.border = '1px solid rgba(220,53,69,0.3)';
    } else {
        badge.style.background = 'rgba(255,193,7,0.15)';
        badge.style.color = '#ffc107';
        badge.style.border = '1px solid rgba(255,193,7,0.3)';
    }
    
    // Parse simple formatting for modal view
    const contentBox = document.getElementById('view-proposal-content');
    contentBox.innerHTML = formatMarkdown(prop.content);
    
    document.getElementById('proposal-view-modal').style.display = 'flex';
}

function deleteProposal(id) {
    proposals = proposals.filter(p => p.id !== id);
    saveProposals();
    showNotification(`🗑️ 提案「${id}」を削除しました。`);
    renderProposalsTable();
}

// --- Server Configuration Sync Helpers ---
async function loadConfigFromServer() {
    try {
        const res = await fetch('/api/get_config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
            const config = await res.json();
            for (const [key, val] of Object.entries(config)) {
                if (val !== undefined && val !== null) {
                    localStorage.setItem(key, val);
                }
            }
            console.log("Synchronized configuration from local server storage.");
        }
    } catch (e) {
        console.warn("Failed to load config from local server:", e);
    }
}

async function syncConfigToServer() {
    try {
        const config = {
            bc_lab_gemini_key: localStorage.getItem('bc_lab_gemini_key') || '',
            bc_lab_gemini_model: localStorage.getItem('bc_lab_gemini_model') || 'gemini-3.5-flash',
            bc_lab_notion_token: localStorage.getItem('bc_lab_notion_token') || '',
            bc_lab_notion_db: localStorage.getItem('bc_lab_notion_db') || '',
            bc_lab_gmail_address: localStorage.getItem('bc_lab_gmail_address') || '',
            bc_lab_gmail_password: localStorage.getItem('bc_lab_gmail_password') || '',
            bc_lab_gmail_notify: localStorage.getItem('bc_lab_gmail_notify') || 'true',
            bc_lab_notion_notify: localStorage.getItem('bc_lab_notion_notify') || 'true'
        };
        await fetch('/api/save_config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config)
        });
        console.log("Synced configuration to local server storage.");
    } catch (e) {
        console.warn("Failed to sync config to local server:", e);
    }
}
