"use strict";

import { Express } from "express";
import * as mascotaUsuario from "./mascota-usuario.service";
import * as passport from "passport";
import * as security from "../security/security.service";
import * as pet from "../pet/pet.service";
import * as muroUsuario from "../muro-usuario/muro-usuario.service";

/**
 * Configura e inicializa los contenidos del Modulo
 */
export function init(app: Express) {
  // Rutas del controler

  app
  .route("/mascotaUsuario/:mascotaUsuarioId")
  .get(passport.authenticate("jwt", { session: false }), mascotaUsuario.encontrarMascotasUsuario);

  app
  .route("/mascotaUsuario/:mascotaUsuarioId")
  .get(passport.authenticate("jwt", { session: false }), mascotaUsuario.encontrarMascotasUsuario);

  app
  .route("/mascotasUsuario")
  .get(mascotaUsuario.list);
}
