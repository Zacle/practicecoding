"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const Plateform_service_1 = require("../plateform/Plateform.service");
/*
 *  Create a specific plateform as specified by the user
 *  from the query
*/
let PlateformBuilding = class PlateformBuilding {
    constructor(codeforces, livearchive, uva, all) {
        this.codeforces = codeforces;
        this.livearchive = livearchive;
        this.uva = uva;
        this.all = all;
    }
    createPlateform(typeOfPlateform) {
        if (typeOfPlateform == "Codeforces")
            return this.codeforces;
        else if (typeOfPlateform == "Uva")
            return this.uva;
        else if (typeOfPlateform == "Live Archive")
            return this.livearchive;
        else
            return this.all;
    }
};
PlateformBuilding = __decorate([
    common_1.Service(),
    __metadata("design:paramtypes", [Plateform_service_1.Codeforces,
        Plateform_service_1.LiveArchive,
        Plateform_service_1.Uva,
        Plateform_service_1.AllPlateforms])
], PlateformBuilding);
exports.default = PlateformBuilding;
//# sourceMappingURL=PlateformBuilding.service.js.map