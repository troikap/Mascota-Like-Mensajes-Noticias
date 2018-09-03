"use strict";

import { Express } from "express";
import * as passport from "passport";
import * as user from "../user/user.service";
import * as like from "./like.service";
import * as security from "../security/security.service";

/**
 * Modulo de seguridad, login/logout, cambio de contraseñas, etc
 */
export function init(app: Express) {
  app.route("/nuevolike")
    .post(passport.authenticate("jwt", { session: false }), security.validateUserRole , like.crearLike);

  app.route("/like/:usuario/:mascota")
    // .get(passport.authenticate("jwt", { session: false }), security.validateUserRole , like.findChatByCurrentUser, like.findChatWithCurrentUser) , like.findExistingLike
    .delete(passport.authenticate("jwt", { session: false }), security.validateUserRole,   like.remove)
    .get(passport.authenticate("jwt", { session: false }), like.buscarLike ); // like.buscarExistenciaLike);

  app.route("/like/:mascota")
    .get(passport.authenticate("jwt", { session: false }), security.validateUserRole, like.buscarLikePorMascota);

  app.route("/likes/:mascota")
    .get(passport.authenticate("jwt", { session: false }), security.validateUserRole, like.buscarLike);

}
