export async function registerSettings(){

  game.settings.register(`${DINTP.moduleName}`, 'lastPoop', 
  {
    name: 'lastPoop',
    scope: 'world',
    type: Object,
    default: {},
    config: false
  })
  game.settings.register(`${DINTP.moduleName}`, 'trackPoopin', {
    name: game.i18n.localize(`settingsTrackPoop`),
    hint: game.i18n.localize(`settingsTrackPoopHint`),
    scope: 'world',
    type: Boolean,
    default: true,
    config: true
  });
  game.settings.register(`${DINTP.moduleName}`, 'pooTrackerData', {
    scope: 'world',
    type: Object,
    default: {},
    config: false
  });
  game.settings.register(`${DINTP.moduleName}`, 'lastPooMessage', {
    scope: 'world',
    type: Object,
    default: {},
    config: false
  });

};