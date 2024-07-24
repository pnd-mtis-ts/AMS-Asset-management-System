import express from "@feathersjs/express";
import { feathers } from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio";
import cors from "cors";
import dotenv from "dotenv";
import AssetRelocationRoute from "./routes/AssetRelocationRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import EntitasBisnisRoute from "./routes/EntitasBisnisRoute.js";
import EntityRoute from "./routes/EntityRoute.js";
import FixedGroupRoute from "./routes/FixedGroupRoute.js";
import FixedRoute from "./routes/FixedRoute.js";
import LocationRoute from "./routes/LocationRoute.js";
import PermissionRoute from "./routes/PermissionRoute.js";
import RoleRoute from "./routes/RoleRoute.js";
import UnitRoute from "./routes/UnitRoute.js";
import UserRoleRoute from "./routes/UserRoleRoute.js";
import UserRoute from "./routes/UserRoute.js";

dotenv.config();

const app = express(feathers());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

//#this is to sync the database with the models
// (async () => {
//     await db.sync();
// })();

// Parse JSON
app.use(express.json());

// Config SocketIO Realtime API
app.configure(socketio());

// Routes
app.use(UserRoute, RoleRoute, AuthRoute, EntitasBisnisRoute, EntityRoute, FixedGroupRoute, LocationRoute, FixedRoute, UnitRoute, PermissionRoute, UserRoleRoute, AssetRelocationRoute);

// App Listen
app.listen(process.env.APP_PORT, () => {
  console.log(`Server Listening on PORT ${process.env.APP_PORT}`);
});
