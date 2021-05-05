const { Model } = require("objection");
class Drivers extends Model {
    static get tableName() {
        return "Drivers";
    }
    static get relationMappings() {
        const driver = require('./Driver');
        const ride = require('./Ride');
        return {
            driver: {
                relation: Model.BelongsToOneRelation,
                modelClass: driver,
                join: {
                    from: 'Drivers.driverId',
                    to: 'Driver.id'
                }
            },
            ride: {
                relation: Model.BelongsToOneRelation,
                modelClass: ride,
                join: {
                    from: 'Drivers.rideId',
                    to: 'Ride.id'
                }
                
            }
        };

    }
}
module.exports = Drivers;