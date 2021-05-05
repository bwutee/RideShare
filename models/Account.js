const { Model } = require("objection");
const { hash, compare } = require("bcrypt");

const SALT_ROUNDS = 10;

class Account extends Model {
  static get tableName() {
    return "Account";
  }
  static get relationMappings() {
    const driver = require('./Driver');
    const ride = require('./Ride');
    return {
        driver: {
            relation: Model.HasManyRelation,
            modelClass: driver,
            join: {
                from: 'Account.id',
                to: 'Driver.userId'
            }
        },
        ride: {
            relation: Model.ManyToManyRelation,
            modelClass: ride,
            join: {
                from: 'Account.id',
                through: {
                    from: 'Passenger.userId',
                    to: 'Passenger.rideId'
                },
                to: 'Ride.id'
            }
            
        }
    };

}
  // Encrypt the password before storing it in the database.
  // SHOULD ALSO DO THIS ON UPDATE!

  // eslint-disable-next-line no-unused-vars
  async $beforeInsert(queryContext) {
    this.password = await hash(this.password, SALT_ROUNDS);
  }
  async $beforeUpdate(queryContext) {
    this.password = await hash(this.password, SALT_ROUNDS);
  }

  async verifyPassword(plainTextPassword) {
    return compare(plainTextPassword, this.password);
  }
}

module.exports = Account;
