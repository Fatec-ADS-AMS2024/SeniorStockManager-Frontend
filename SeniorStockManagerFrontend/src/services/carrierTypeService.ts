import CarrierType from "../types/models/CarrierType";
import GenericService from "./genericService";

export default class CarrierTypeService extends GenericService<CarrierType> {

    constructor() {
        super('CarrierType');
    }
}