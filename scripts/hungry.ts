#!/usr/bin/env ts-node

/**
 * Simple script to print "お腹すいた" (I'm hungry) to the console
 */
function printHungryMessage(): void {
  console.log('お腹すいた');
}

// Execute if this script is run directly
if (require.main === module) {
  printHungryMessage();
}

export { printHungryMessage };