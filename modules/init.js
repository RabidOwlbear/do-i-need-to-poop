import {registerSettings} from './settings.js';
import {registerPoop} from './poop.js';

window.DINTP = {
  moduleName: `do-i-need-to-poop`
}

Hooks.on('init',async  ()=>{

  await registerSettings();
  await registerPoop();
  
  DINTP.socket.register('trackMyPoopin', DINTP.trackMyPoopin);
  DINTP.socket.register('updateSetting', DINTP.updateSetting);
});
Hooks.once('socketlib.ready', () => {
  DINTP.socket = socketlib.registerModule(DINTP.moduleName);

})

Hooks.on('updateWorldTime', async () => {
  let trackPoop = await game.settings.get(DINTP.moduleName, 'trackPoopin')
  if(trackPoop){
    DINTP.pooCheck()
  }
})
