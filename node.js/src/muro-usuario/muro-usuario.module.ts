"use strict";

import { Express } from "express";
import * as muroUsuario from "./muro-usuario.service";
import * as passport from "passport";

import * as security from "../security/security.service";

/**
 * Configura e inicializa los contenidos del Modulo
 */
export function init(app: Express) {
  // Rutas del controler
  app.route("/muroUsuario")
    .get(muroUsuario.list)
    .put(passport.authenticate("jwt", { session: false }), muroUsuario.validateUpdate, muroUsuario.update);

  app.route("/muroUsuario/:muroUsuarioId")
    .get(muroUsuario.list);
}
