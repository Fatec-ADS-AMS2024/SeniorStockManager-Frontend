import UnitOfMeasure from "../types/models/UnitOfMeasure";
import GenericService from "./genericService";

export default class UnitOfMeasureService extends GenericService<UnitOfMeasure> {

    constructor() {
        super('UnitOfMeasure');
    }
}