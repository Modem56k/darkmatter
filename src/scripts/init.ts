import { libWrapper } from "../lib/libWrapper/shim.js";
import { MODULE_ID } from "../constants";

console.log("Hello World! This code runs immediately when the file is loaded.");

Hooks.once("setup", () => {
    patchActor5ePreparedData();
    //patchActor5eRollSkill();
});

Hooks.on("init", function () {
    console.log("This code runs once the Foundry VTT software begins its initialization workflow.");
});

Hooks.on("ready", function () {
    console.log("This code runs once core initialization is ready and game data is available.");
});


function patchActor5ePreparedData() {
    libWrapper.register(MODULE_ID, "CONFIG.Actor.entityClass.prototype.prepareData", function patchedPrepareData(wrapped, ...args) {
        wrapped(...args);
        const skills = this.data.data.skills;

        for (let skill in skills) {
            console.log(skill);
        }
    });
}