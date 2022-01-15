import { libWrapper } from "../lib/libWrapper/shim";
const MODULE_NAME = '5e-dm-character-sheet';

Hooks.on("init", function () {
    if (typeof libWrapper === 'function') {
        /* libWrapper is available in global scope and can be used */
        libWrapper.register(MODULE_NAME, "CONFIG.Actor.entityClass.prototype.prepareData", function patchedPrepareData(wrapped, ...args) {
            wrapped(...args);

            //const skills = this.data.data.skills;

            // for (let key in skills) {
            //   //  console.log(JSON.stringify(key));
            // }
        });
    }
    else {
        /* libWrapper is not available in global scope and can't be used */
    }
});
