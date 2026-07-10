@echo off
chcp 65001 > nul
echo ==========================================
echo B.C Lab Portal - GitHubデプロイ支援ツール
echo ==========================================
echo.
echo ※ 事前にGitHubで新しい空のリポジトリを作成しておいてください。
echo.
set /p REPO_URL="GitHubリポジトリURLを入力してください (例: https://github.com/ユーザー名/リポジトリ名.git): "
if "%REPO_URL%"=="" (
    echo [エラー] リポジトリURLが空です。処理を中止します。
    pause
    exit /b
)
echo.
echo [1/4] Gitの初期化中...
git init
if %errorlevel% neq 0 (
    echo [エラー] Gitがインストールされていないか、実行できません。
    pause
    exit /b
)

echo.
echo [2/4] ファイルのコミット準備中...
git add .
git commit -m "Initial commit of B.C Lab Portal"

echo.
echo [3/4] リモートリポジトリの設定中...
git branch -M main
git remote remove origin > nul 2>&1
git remote add origin %REPO_URL%

echo.
echo [4/4] GitHubへアップロード中...
echo ※ ブラウザ等での認証を求められた場合は、画面の指示に従ってください。
git push -u origin main --force

if %errorlevel% eq 0 (
    echo.
    echo ==========================================
    echo アップロードが正常に完了しました！
    echo ==========================================
    echo.
    echo 【GitHub Pages の有効化手順】
    echo 1. GitHubリポジトリのWebページを開きます。
    echo 2. 上部メニューの [Settings] をクリックします。
    echo 3. 左サイドバーの [Pages] をクリックします。
    echo 4. "Build and deployment" - "Source" で「Deploy from a branch」が選択されていることを確認します。
    echo 5. "Branch" で「main」と「/ (root)」を選択し、[Save] をクリックします。
    echo 6. 数分待つと、以下のURLで公開されます：
    echo    https://(ユーザー名).github.io/(リポジトリ名)/
    echo.
) else (
    echo.
    echo [エラー] アップロードに失敗しました。認証エラーかリポジトリ名を確認してください。
)
pause
