#!/usr/bin/env node

/**
 * Simple script to print "お腹すいた" (I'm hungry) to the console
 */
function printHungryMessage() {
  console.log('お腹すいた');
}

// Execute if this script is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  printHungryMessage();
}

export { printHungryMessage };