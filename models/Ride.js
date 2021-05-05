const { Model } = require("objection");
class Ride extends Model {
    static get tableName() {
        return "Ride";
    }
    static get relationMappings() {
        const user = require("./Account");
        const driver = require("./Driver");
        const vehicle = require("./Vehicle");
        const location = require("./Location");
        return {
            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: user,
                join: {
                    from: "Ride.id",
                    through: {
                        from: "Passenger.rideId",
                        to: "Passenger.userId"
                    },
                    to: "Account.id"
                }
            },
            drivers: {
                relation: Model.ManyToManyRelation,
                modelClass: driver,
                join: {
                    from: "Ride.id",
                    through: {
                        from: "Drivers.rideId",
                        to: "Drivers.driverId"
                    },
                    to: "Driver.id"
                }
                
            },
            vehicles: {
                relation: Model.BelongsToOneRelation,
                modelClass: vehicle,
                join: {
                    from: "Ride.vehicleId",
                    to: "Vehicle.id"
                }
                
            },
            locations: {
                relation: Model.BelongsToOneRelation,
                modelClass: location,
                join: {
                    from: "Ride.fromLocationId",
                    to: "Location.id"
                }
                
            },
            locations: {
                relation: Model.BelongsToOneRelation,
                modelClass: location,
                join: {
                    from: "Ride.toLocationId",
                    to: "Location.id"
                }
                
            }
        };

    }
}

module.exports = Ride;    