import { pooEuph } from './poo-db.js';
import { pooSwatches } from './poo-db.js';
export async function registerPoop() {
  DINTP.trackMyPoopin = async function (uuid, pooFreq) {
    if(pooFreq <= 0 ){
      ui.notifications.warn(game.i18n.localize(`pooFreqWarn`))
      return
    }
    pooFreq = Math.floor(86400 / pooFreq);
    let actor = await fromUuid(uuid);

    let trackedPoo = await deepClone(game.settings.get(DINTP.moduleName, 'pooTrackerData'));
    if (trackedPoo[uuid]) {
      ui.notifications.warn(game.i18n.localize(`poopWarningA`));
      return;
    }
    if (!trackedPoo[actor.id]) {
      let pooTimeCalc = DINTP.pooTimeCalc(pooFreq);
      let pooData = {
        pooDate: game.time.worldTime,
        pooUser: game.user,
        pooName: actor.name,
        pooFreq,
        nextPoo: pooTimeCalc
      };
      trackedPoo[actor.uuid] = pooData;
      await DINTP.socket.executeAsGM(`updateSetting`, `pooTrackerData`, trackedPoo);
      ui.notifications.notify(game.i18n.localize(`trackinYourPoo`));
    }
  };
  DINTP.pooTimeCalc = function (pooFreq, digMod = 0) {
    if (!digMod) {
      return pooFreq - Math.floor(pooFreq * 0.1) + Math.floor(Math.random() * Math.floor(pooFreq * 0.1));
    }
    // fiber ahoy
    if (digMod == 1) {
      let base = pooFreq - Math.floor(pooFreq * 0.1) + Math.floor(Math.random() * Math.floor(pooFreq * 0.1));
      return Math.floor(base * 0.6);
    }
  };
  DINTP.pooCheck = async function () {
    let poops = await deepClone(game.settings.get(DINTP.moduleName, `pooTrackerData`));
    let pooMsgData = await deepClone(game.settings.get(DINTP.moduleName, `lastPooMessage`));
    for (let poopKey in poops) {
      let poop = poops[poopKey];
      let curTime = game.time.worldTime;
      let timeTilPoo =
        poop.nextPoo == 'inf' ? null : Math.floor(poop.nextPoo / 60) - Math.floor((curTime - poop.pooDate) / 60);
      console.log(timeTilPoo, poop, poop.nextPoo / 60);
      if (timeTilPoo <= 0 && timeTilPoo !== null) {
        console.log('poo now');
        if (pooMsgData[poopKey] && game.time.worldTime - pooMsgData[poopKey].lastMsg < 60) {
          return;
        }
        let messageData = {
          user: poop.pooUser.id,
          flavor: `<h3 style="text-align: center;">${game.i18n.localize(`pooMessageHeaderA`)}${
            game.i18n.localize(pooEuph[Math.floor(Math.random() * pooEuph.length)])
          }</h3>`,
          content: await renderTemplate(`./modules/do-i-need-to-poop/template/poo-msg.html`, {
            actorName: poop.pooName,
            color: pooSwatches[Math.floor(Math.random() * pooSwatches.length)]
          }),
          whisper: [poop.pooUser]
        };

        ChatMessage.create(messageData);
        if (!pooMsgData[poopKey]) pooMsgData[poopKey] = {};

        pooMsgData[poopKey].lastMsg = game.time.worldTime;
        await await DINTP.socket.executeAsGM('updateSetting', `lastPooMessage`, pooMsgData);
      }
    }
  };
  DINTP.updateSetting = async function (setting, data) {
    await game.settings.set(DINTP.moduleName, setting, data);
  };
  DINTP.simpleEat = async function (uuid, food, digMod = 0) {
    console.log('fired')
    let actor = await fromUuid(uuid);
    let poops = await deepClone(game.settings.get(DINTP.moduleName, `pooTrackerData`));
    let poop = poops?.[uuid];
    if (poop) {
      poop.pooDate = game.time.worldTime;
      poop.nextPoo = poop.nextPoo == 'inf' ? DINTP.pooTimeCalc(poop.pooFreq, digMod) : poop.nextPoo;
      await DINTP.socket.executeAsGM(`updateSetting`, `pooTrackerData`, poops);
      let msgData = {
        user: game.user,
        content: `${actor.name} Ate: </br>
      ${food}`,
        whisper: [game.user]
      };
      ChatMessage.create(msgData);
    }
  };
  DINTP.poop = async function (uuid) {
    let actor = await fromUuid(uuid);
    let poops = await deepClone(game.settings.get(DINTP.moduleName, `pooTrackerData`));
    let poop = poops?.[uuid];
    console.log(poop);
    if (poop) {
      poop.nextPoo = 'inf';
    }
    await DINTP.socket.executeAsGM('updateSetting', `pooTrackerData`, poops);
    let msgData = {
      user: game.user,
      content: `${actor.name} Pooped: </br>
      You feel better.`,
      whisper: [game.user]
    };
    ChatMessage.create(msgData);
  };
  DINTP.stopWatchinMePoo = async function (uuid) {
    let actor = await fromUuid(uuid);
    let trackedPoo = await deepClone(game.settings.get(DINTP.moduleName, 'pooTrackerData'));
    let actorPoo = trackedPoo[uuid];
    if (actorPoo) delete trackedPoo[uuid];
    await await DINTP.socket.executeAsGM('updateSetting', `pooTrackerData`, trackedPoo);
    let msgData = {
      user: game.user,
      content: `${game.i18n.localize(`stopWatchin`)} ${actor.name}.`,
      whisper: [game.user]
    };
    ChatMessage.create(msgData);
  };
  DINTP.doINeedToPoop = async function (uuid) {
    let actor = await fromUuid(uuid);
    let trackedPoo = await deepClone(game.settings.get(DINTP.moduleName, 'pooTrackerData'));
    let curTime = game.time.worldTime
    let poop = trackedPoo[uuid];
    if (poop) {
      let msgData = {
        user: game.user,
        whisper: [game.user],

      }
      let timeTilPoo =
        poop.nextPoo == 'inf' ? null : Math.floor(poop.nextPoo / 60) - Math.floor((curTime - poop.pooDate) / 60);
      if(timeTilPoo == null){
        msgData.content = `${actor.name} won't need to poop until they eat again.`
      } else {
        if(timeTilPoo > 60) msgData.content = `${actor.name} ${game.i18n.localize(`needToPoop.1`)}`
        if(timeTilPoo < 60 && timeTilPoo > 30) msgData.content = `${actor.name} ${game.i18n.localize(`needToPoop.2`)}`
        if(timeTilPoo < 30 && timeTilPoo > 10) msgData.content = `${actor.name} ${game.i18n.localize(`needToPoop.3`)}`
        if(timeTilPoo < 10 && timeTilPoo > 0) msgData.content = `${actor.name} ${game.i18n.localize(`needToPoop.4`)}`
        if(timeTilPoo <= 0) msgData.content = `${actor.name} ${game.i18n.localize(`needToPoop.5`)}`
       
      }
      ChatMessage.create(msgData)
    }
  };
  DINTP.singleSelected = function () {
    if (canvas.tokens.controlled.length != 1) {
      ui.notifications.warn(game.i18n.localize('singleSelectedWarn'));
      return false;
    }
    if (canvas.tokens.controlled.length == 1) {

      return canvas.tokens.controlled[0];
    }
  };
}
