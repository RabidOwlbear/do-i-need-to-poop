## Do I Need To Poop?

This module adds rudimentary alimentary function tracking to foundry VTT.

This module should work with any system that includes a uuid property on actor objects.

#### To Use:

The module functions are accessed via several included macros. 

- 'Track My Poop':  This macro will add the selected token actor to the poop tracker. This macro has a variable "pooFreq" that determined how oftern per 24 hour period the actor usually poops. By default this value is set to 1. Once clicked, a ui notification will be generated with the actor name being tracked. depending on the frequency value(above), the user that initiated the tracking will be notified via whispered chat message that the actor need to poop some time within 24 hours of 'game time' as tracked by game.time.worldTime.
- 'Do I need To Poop?' - this macro will out put a chat message detailing whether ot not the selected token actor needs to poop. This is based on the time since eating, and the frequency determined in the 'track my poop' macro.
- 'Poop' - this will cause the setected token actor to 'poop' clearing any need to poop warnings and disabling the poop tracking until more food is eaten.
- 'simple eat': This macro will 'feed' the selected token actor, and initiate poop tracking based on the setting determined by the 'track my poop' macro and the time logged when eating. 
- 'Stop Watchin Me poop': This macro removes the selected token actor from the poop tracker. To be added back to the tracker, one must use the 'Track My Poop' macro again.
