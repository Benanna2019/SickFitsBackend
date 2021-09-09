import { config } from "@keystone-next/keystone";
import { statelessSessions } from "@keystone-next/keystone/session";
import { createAuth } from "@keystone-next/auth";
import { lists } from "./schema";
import "dotenv/config";
import { permissionsList } from "./schemas/fields";
import { insertSeedData } from "./seed-data/index";
import { extendGraphqlSchema } from "./mutations";

let sessionSecret = `${process.env.COOKIE_SECRET}`;

// if (!sessionSecret) {
//   if (process.env.NODE_ENV === "production") {
//     throw new Error(
//       "The SESSION_SECRET environment variable must be set in production"
//     );
//   } else {
//     sessionSecret = "-- DEV COOKIE SECRET; CHANGE ME --";
//   }
// }

let sessionMaxAge = 60 * 60 * 24 * 30; // 30 days

const { withAuth } = createAuth({
  listKey: "User",
  identityField: "email",
  secretField: "password",
  sessionData: `id name email role { ${permissionsList.join(" ")} }`,
  initFirstItem: {
    fields: ["name", "email", "password"],
  },
  // passwordResetLink: {
  //   async sendToken(args) {
  //     // send the email
  //     await sendPasswordResetEmail(args.token, args.identity)
  //   }
  // }
});

const sessionConfig = {
  maxAge: sessionMaxAge,
  secret: sessionSecret,
};

export default withAuth(
  config({
    server: {
      cors: {
        origin: "*",
        credentials: true,
      },
    },
    db: {
      adapter: "prisma_postgresql",
      url: `${process.env.DATABASE_URL}`,
      // enableLogging: true,
      async onConnect(context) {
        console.log("Connected to the database!");
        if (process.argv.includes("--seed-data")) {
          await insertSeedData(context);
        }
      },
    },
    ui: {
      isAccessAllowed: ({ session }) => {
        console.log("This is the console logged session data", session);
        return !!session?.data;
      },
    },
    lists,
    extendGraphqlSchema,
    session: statelessSessions(sessionConfig),
  })
);
