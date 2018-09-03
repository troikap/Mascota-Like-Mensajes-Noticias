"use strict";

import { Express } from "express";
import * as pet from "./pet.service";
import * as security from "../security/security.service";
import * as passport from "passport";

export function init(app: Express) {
  /*app
    .route("/pet")
    .get(pet.list);
*/
  // Routas de acceso a mascotas
  app
    .route("/pet")
    .get(passport.authenticate("jwt", { session: false }), pet.findByCurrentUser)
    .post(passport.authenticate("jwt", { session: false }), pet.validateUpdate, pet.update);

  app
    .route("/pet/:petId")
    .get(pet.read)
    .put(passport.authenticate("jwt", { session: false }), pet.validateOwner, pet.validateUpdate, pet.update)
    .delete(passport.authenticate("jwt", { session: false }), pet.validateOwner, pet.remove);

  app
    .route("/pets/petId")
    .get(passport.authenticate("jwt", { session: false }), );
  // Filtro que agrega la mascota cuando se pasa como parametro el id

  app
    .route("/usuario/:userId")
    .get(pet.findByParamUser);
  app
    .param("petId", pet.findByID);
  app
    .route("/todamascota")
    .get(pet.list);
}
