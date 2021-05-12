const { Model } = require("objection");

class Driver extends Model {
    static get tableName() {
        return "Driver";
    }
    static get relationMappings() {
        const user = require("./Account");
        const vehicle = require("./Vehicle");
        const ride = require("./Ride");
        const state = require("./State")
        return {
            accounts: {
                relation: Model.BelongsToOneRelation,
                modelClass: user,
                join: {
                    from: "Driver.id",
                    to: "Account.id"
                }
            },
            vehicles: {
                relation: Model.ManyToManyRelation,
                modelClass: vehicle,
                join: {
                    from: "Driver.id",
                    through: {
                        from: "Authorization.driverId",
                        to: "Authorization.vehicleId"
                    },
                    to: "Vehicle.id"
                }
                
            },
            rides: {
                relation: Model.ManyToManyRelation,
                modelClass: ride,
                join: {
                    from: "Driver.id",
                    through: {
                        from: "Drivers.driverId",
                        to: "Drivers.rideId"
                    },
                    to: "Ride.id"
                }
                
            },
            states: {
                relation: Model.BelongsToOneRelation,
                modelClass: state,
                join: {
                    from: "Driver.licenseState",
                    to: "State.abbreviation"
                }
                
            }
        };

    }
}

module.exports = Driver;