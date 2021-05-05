const { Model } = require("objection");
class Location extends Model {
    static get tableName() {
        return "Location";
    }
    static get relationMappings() {
        const state = require('./State');
        const ride = require('./Ride');
        return {
            state: {
                relation: Model.BelongsToOneRelation,
                modelClass: state,
                join: {
                    from: 'Location.state',
                    to: 'State.abbreviation'
                }
            },
            ride: {
                relation: Model.HasManyRelation,
                modelClass: ride,
                join: {
                    from: 'Location.id',
                    to: 'Ride.fromLocationId'
                }
                
            },
            ride: {
                relation: Model.HasManyRelation,
                modelClass: ride,
                join: {
                    from: 'Location.id',
                    to: 'Ride.toLocationId'
                }
                
            }
        };

    }
}
module.exports = Location;