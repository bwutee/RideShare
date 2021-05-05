const { Model } = require("objection");
class Authorization extends Model {
    static get tableName() {
        return "Authorization";
    }
    static get relationMappings() {
        const driver = require('./Driver');
        const vehicle = require('./Vehicle');
        return {
            driver: {
                relation: Model.BelongsToOneRelation,
                modelClass: driver,
                join: {
                    from: 'Authorization.driverId',
                    to: 'Driver.id'
                }
            },
            ride: {
                relation: Model.BelongsToOneRelation,
                modelClass: vehicle,
                join: {
                    from: 'Authorization.vehicleId',
                    to: 'Vehicle.id'
                }
                
            }
        };

    }
}
module.exports = Authorization;