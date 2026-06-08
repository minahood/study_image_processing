# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 画像処理クイズサイト

React + Vite + TypeScript で構築された、ブラウザ完結型の画像処理学習クイズサイト。画像処理はすべて Canvas API を使ってクライアントサイドで実装する。

## コマンド

```bash
npm install          # 依存関係インストール
npm run dev          # 開発サーバー起動
npm run build        # プロダクションビルド
npm run preview      # ビルド結果のプレビュー
npm run lint         # ESLint
npm run type-check   # TypeScript 型チェック（tsc --noEmit）
npm run test         # テスト実行（Vitest）
npm run test -- path/to/file  # 単一ファイルのテスト実行
```

## アーキテクチャ

### ディレクトリ構成

```
src/
  components/   # UIコンポーネント（表示・操作のみ、処理ロジックを持たない）
  quizzes/      # クイズ定義（カテゴリ別）
  processors/   # 画像処理ロジック（純粋関数）
  hooks/        # カスタムフック（processors と components を接続）
```

### 設計方針

**processors** はCanvas APIのピクセル操作に関する純粋関数のみを持つ。副作用・状態・UIへの依存はない。テスト容易性を最優先する。

**quizzes** はクイズのメタデータ（問題文・選択肢・正解・対応するprocessor）を定義する。カテゴリ別にファイルを分け、`src/quizzes/index.ts` でまとめてエクスポートする。

**hooks** がprocessorsを呼び出してCanvas操作を行い、コンポーネントに状態と操作関数を渡す。コンポーネントはhooksが返す値だけを使う。

### クイズカテゴリ

| カテゴリ | 内容 |
|---|---|
| 濃淡変換・空間フィルタリング | トーンカーブ（RGB別）、カーネルフィルタ（平滑化・鮮鋭化・エッジ検出）、周波数フィルタリング（ローパス・ハイパス） |
| 幾何学変換 | 平行移動・拡大縮小・回転・アフィン変換 |
| 二値化・形態学処理 | 大津の二値化・膨張・収縮 |

### Canvas API の使い方

画像処理はすべて `ImageData` のピクセル配列（RGBA各1バイト）を直接操作する。processors の関数シグネチャは原則 `(imageData: ImageData, params: XxxParams) => ImageData` の形にする。
