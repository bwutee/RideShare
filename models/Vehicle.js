const { Model } = require("objection");
class Vehicle extends Model {
    static get tableName() {
        return "Vehicle";
    }
    static get relationMappings() {
        const driver = require("./Driver");
        const vehicleType = require("./VehicleType");
        const ride = require("./Ride");
        const state = require("./State")
        return {
            drivers: {
                relation: Model.ManyToManyRelation,
                modelClass: driver,
                join: {
                    from: "Vehicle.id",
                    through: {
                        from: "Authorization.vehicleId",
                        to: "Authorization.driverId"
                    },
                    to: "Driver.id"
                }
            },
            vehicleTypes: {
                relation: Model.BelongsToOneRelation,
                modelClass: vehicleType,
                join: {
                    from: "Vehicle.vehicleTypeId",
                    to: "VehicleType.id"
                }
                
            },
            rides: {
                relation: Model.HasManyRelation,
                modelClass: ride,
                join: {
                    from: "Vehicle.id",
                    to: "Ride.vehicleId"
                }
                
            },
            states: {
                relation: Model.BelongsToOneRelation,
                modelClass: state,
                join: {
                    from: "Vehicle.licenseState",
                    to: "State.abbreviation"
                }
                
            }
        };

    }
}

module.exports = Vehicle;