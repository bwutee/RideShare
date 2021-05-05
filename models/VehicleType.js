const { Model } = require("objection");
class VehicleType extends Model {
    static get tableName() {
        return "VehicleType";
    }
    static get relationMappings() {
        const vehicle = require('./Vehicle');
        return {
            vehicle: {
                relation: Model.HasManyRelation,
                modelClass: vehicle,
                join: {
                    from: 'VehicleType.id',
                    to: 'Vehicle.vehicleTypeId'
                }
            }
        };

    }
}
module.exports = VehicleType;