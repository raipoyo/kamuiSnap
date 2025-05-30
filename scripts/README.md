# お腹すいたシステム (Hungry System)

シンプルな「お腹すいた」メッセージをコンソールに表示するシステムです。

## 使用方法 (Usage)

### npm script として実行
```bash
npm run hungry
```

### 直接実行
```bash
# JavaScript版
node scripts/hungry.js

# TypeScript版（要tsx）
npx tsx scripts/hungry.ts
```

### ファイルをインポートして使用
```javascript
import { printHungryMessage } from './scripts/hungry.js';

printHungryMessage(); // => お腹すいた
```

## ファイル構成

- `hungry.js` - JavaScript版実行ファイル
- `hungry.ts` - TypeScript版実行ファイル（同じ機能）
- `README.md` - このファイル

## 出力

```
お腹すいた
```