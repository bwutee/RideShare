// Knex
const knex = require("knex")({
  client: "pg",
  connection: {
    host: "faraday.cse.taylor.edu", // PostgreSQL server
    user: "min_lee", // Your user name
    password: "pegediju", // Your password
    database: "min_lee", // Your database name
  },
});

// Objection
const objection = require("objection");
objection.Model.knex(knex);

// Models
const Account = require("./models/Account");
const Driver = require("./models/Driver");
const Authorization = require("./models/Authorization");
const Drivers= require("./models/Drivers");
const Location = require("./models/Location");
const Passenger= require("./models/Passenger");
const Ride = require("./models/Ride");
const State = require("./models/State");
const Vehicle = require("./models/Vehicle");
const VehicleType = require("./models/VehicleType");
// Hapi
const Joi = require("@hapi/joi"); // Input validation
const Hapi = require("@hapi/hapi"); // Server

const server = Hapi.server({
  host: "localhost",
  port: 3000,
  routes: {
    cors: true,
  },
});

async function init() {
  // Show routes at startup.
  await server.register(require("blipp"));

  // Output logging information.
  await server.register({
    plugin: require("hapi-pino"),
    options: {
      prettyPrint: true,
    },
  });

  // Configure routes.
  server.route([
    {
      method: "POST",
      path: "/accounts",
      config: {
        description: "Sign up for an account",
        validate: {
          payload: Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
          }),
        },
      },
      handler: async (request, h) => {
        const existingAccount = await Account.query()
          .where("email", request.payload.email)
          .first();
        if (existingAccount) {
          return {
            ok: false,
            msge: `Account with email '${request.payload.email}' is already in use`,
          };
        }

        const newAccount = await Account.query().insert({
          first_name: request.payload.firstName,
          last_name: request.payload.lastName,
          email: request.payload.email,
          password: request.payload.password,
        });

        if (newAccount) {
          return {
            ok: true,
            msge: `Created account '${request.payload.email}'`,
          };
        } else {
          return {
            ok: false,
            msge: `Couldn't create account with email '${request.payload.email}'`,
          };
        }
      },
    },

    {
      method: "POST",
      path: "/driver",
      config: {
        description: "Sign up for a driver",
        validate: {
          payload: Joi.object({
            licenseNumber: Joi.string().required(),
            licenseState: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
          }),
        },
      },
      handler: async (request, h) => {
        const existingAccount = await Account.query()
          .where("email", request.payload.email)
          .first();
        
          if (!existingAccount) {
          return {
            ok: false,
            msge: `Account with email '${request.payload.email}' does not exist`,
          };
        }

        const accountId = await Account.query()
          .where("email", request.payload.email)
          .select("id");
        if(accountId){
          const newDriver = await accountId.$relatedQuery().insert({
            userId: accountId,
            licenseNumber: request.payload.licenseNumber,
            licenseState: request.payload.licenseState,
          });
        }

        if (newDriver) {
          return {
            ok: true,
            msge: `Congratulation! You are now a driver`,
          };
        } else {
          return {
            ok: false,
            msge: `Couldn't assign to a driver with email '${request.payload.email}'`,
          };
        }
      },
    },
	
	{
      method: "PUT",
      path: "/reset-password",
      config: {
        description: "Reset account password",
        validate: {
          payload: Joi.object({
            email: Joi.string().email().required(),
            currentPassword: Joi.string().required(),
            newPassword: Joi.string().required(),
            confirmPassword: Joi.string().required(),
          }),
        },
      },
      handler: async (request, h) => {
        const existingAccount = await Account.query()
          .where("email", request.payload.email)
          .first();
        if (!existingAccount) {
          return {
            ok: false,
            msge: `Account with email '${request.payload.email}' does not exist`,
          };
        }
        if(request.payload.newPassword != request.payload.confirmPassword){
          return{
            ok: false,
            msge: "Plese confirm if new password match"
          };
        }
        
        const account = await Account.query()
          .where("email", request.payload.email)
          .first();
        if (!await account.verifyPassword(request.payload.currentPassword) ){
          return{
            ok: false,
            msge: "Wrong current password"
          };
        }
        
        const updatePassword = await Account.query()
			.where("email", request.payload.email)
			.patch({
			password: request.payload.newPassword,
			});
			

        if (updatePassword) {
          return {
            ok: true,
            msge: `Updated account '${request.payload.email}' password`,
          };
        } else {
          return {
            ok: false,
            msge: `Couldn't update account'${request.payload.email}'`,
          };
        }
      },
    },
    {
      method: "GET",
      path: "/drivers",
      config: {
        description: "Retrieve all drivers",
      },
      handler: (request, h) => {
        return Driver.query();
      }
    },
    {
      method: "GET",
      path: "/drivers/{id}",
      config: {
        description: "Retrieve specific driver by Id",
      },
      handler: (request, h) => {
        const driver = Driver.query().where("userId",request.params.id);
        if(!driver){
          return {
            ok: false,
            msge: "driver not found"
          }
        }else{
          return driver;
        }
      }
    },
    {
      method: "GET",
      path: "/accounts",
      config: {
        description: "Retrieve all accounts",
      },
      handler: (request, h) => {
        return Account.query();
      },
    },

    {
      method: "GET",
      path: "/locations",
      config: {
        description: "Retrieve all locations",
      },
      handler: (request, h) => {
        return Location.query();
      },
    },

    {
      method: "DELETE",
      path: "/accounts/{id}",
      config: {
        description: "Delete an account",
      },
      handler: (request, h) => {
        return Account.query()
          .deleteById(request.params.id)
          .then((rowsDeleted) => {
            if (rowsDeleted === 1) {
              return {
                ok: true,
                msge: `Deleted account with ID '${request.params.id}'`,
              };
            } else {
              return {
                ok: false,
                msge: `Couldn't delete account with ID '${request.params.id}'`,
              };
            }
          });
      },
    },

    {
      method: "POST",
      path: "/login",
      config: {
        description: "Log in",
        validate: {
          payload: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required(),
          }),
        },
      },
      handler: async (request, h) => {
        const account = await Account.query()
          .where("email", request.payload.email)
          .first();
        if (
          account &&
          (await account.verifyPassword(request.payload.password))
        ) {
          return {
            ok: true,
            msge: `Logged in successfully as '${request.payload.email}'`,
            details: {
              id: account.id,
              firstName: account.first_name,
              lastName: account.last_name,
              email: account.email,
            },
          };
        } else {
          return {
            ok: false,
            msge: "Invalid email or password",
          };
        }
      },
    },
  ]);

  // Start the server.
  await server.start();
}

// Go!
init();
