#!/usr/bin/env node

/**
 * 簡易「お腹すいた」システム
 * Simple "I'm hungry" system
 */

function printHungryMessage() {
  console.log('お腹すいた');
}

// スクリプトとして直接実行された場合にメッセージを表示
if (import.meta.url === `file://${process.argv[1]}`) {
  printHungryMessage();
}

export { printHungryMessage };