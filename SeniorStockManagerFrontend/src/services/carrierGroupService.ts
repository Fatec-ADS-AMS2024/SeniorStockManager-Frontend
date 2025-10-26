import Carrier from "../types/models/Carrier";
import GenericService from "./genericService";

export default class CarrierGroupService extends GenericService<Carrier> {

    constructor() {
        super('Carrier');
    }
}