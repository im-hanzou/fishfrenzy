import { loadTokensFromFile, loadProxiesFromFile } from './utils/file.js';
import { getNextProxy } from './utils/proxy.js';
import { getUserInfo, verifyQuest, getSocialQuests, claimDailyReward, buyFishing, useItem, completeTutorial, getInventory } from './utils/api.js';
import { banner } from './utils/banner.js';
import { logger } from './utils/logger.js';
import { fishing } from './utils/game.js';
import readline from 'readline';

const askQuestion = (query) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve) => rl.question(query, (answer) => {
        rl.close();
        resolve(answer);
    }));
};

async function main() {
  logger(banner, 'debug')
  const tokens = loadTokensFromFile('tokens.txt');
  const proxies = loadProxiesFromFile('proxy.txt');
  let type = await askQuestion('Choose Your fishing type\n1. short_range  \n2. mid_range \n3. long_range \nEnter your choice (1 2 3): ');

  if (proxies.length === 0) {
    logger('No proxies found. Exiting...', 'error');
    return;
  }

  let proxyIndex = 0;

    while (true) {
        let counter = 1
        for (const token of tokens) {
        const { proxy, nextIndex } = getNextProxy(proxies, proxyIndex);
        proxyIndex = nextIndex;

        logger(`Using proxy: ${proxy}`);
        const profile = await getUserInfo(token, proxy);
        if (!profile) {
          logger(`Failed to fetch profile for Account #${counter}: `, 'error');
          counter++;
          continue;
        }
        const isCompleteTutorial = profile.isCompleteTutorial
        const isClaimedDailyReward = profile.isClaimedDailyReward
        const userId = profile.id;
        logger(`Account #${counter} | EXP Points: ${profile.fishPoint} | Gold: ${profile.gold} | Energy: ${profile.energy}`, 'debug');
        if (!isCompleteTutorial) {
          await completeTutorial(token, proxy, userId)
          
        } else if (!isClaimedDailyReward) {
          logger('Daily Signin...')
          await claimDailyReward(token, proxy)
          const quests = await getSocialQuests(token, proxy);
          const ids = quests
              .filter(item => item.status === "UnClaimed")
              .map(item => item.id);
          for (const id of ids) {
            if (id === '670f3bb8193d51c460247600' || id === '670f3c40193d51c460247623' || id === '670f3c76193d51c46024762c') {
              continue;
            }
            logger(`Account #${counter} | Claim Quests ID:`, 'info', id)
            await verifyQuest(token, id, proxy);
          }
        } else if (profile.gold > 1500) {
          const itemId = '66b1f692aaa0b594511c2db2'
          const buy = await buyFishing(token, proxy, itemId, userId)
          if (buy) {
            logger(`Account #${counter} | Buy and Use Exp Schroll for user ${userId}`)
            await useItem(token, proxy, itemId, userId)
          };
        };

          if (type === '1' && profile.energy > 0) {
            await fishing(token, type, proxy);
          } else if (type === '2' && profile.energy > 1) {
            await fishing(token, type, proxy);
          } else if (type === '3' && profile.energy > 2) { 
            await fishing(token, type, proxy);
          } else {
            logger(`Account #${counter} | Not Enought Energy to start fishing...`, 'warn');
            logger(`Account #${counter} | Checking inventory...`);
            const inventory = await getInventory(token, proxy);
            if (inventory && inventory.list_item_info[0]) { 
              const itemName = inventory.list_item_info[0].name;
              const itemsid = inventory.list_item_info[0].id;
              const description = inventory.list_item_info[0].description;
              logger(`Account #${counter} | Found ${itemName} in inventory. Let's use it...`, 'info');
              const use = await useItem(token, proxy, itemsid, userId);
              if (use) { 
                  logger(`Account #${counter} | Used ${itemName} ${description}`, 'info');
              };
            } else {
                logger(`Account #${counter} | not found any Items in inventory...`, 'warn');
            };    
          };
          counter++;
          await new Promise(resolve => setTimeout(resolve, 1000));
      };

    logger('Waiting 1 minute before Fishing again...');
    await new Promise(resolve => setTimeout(resolve, 60000)); 
  };
};

main().catch(error => {
  logger('Error in main loop:', 'error');
});
