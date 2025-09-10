import ManuFacturer from "../types/models/ManuFacturer";
import GenericService from "./genericService";

export default class ManuFacturerService extends GenericService<ManuFacturer> {

    constructor() {
        super('ManuFacturer');
    }
}