"use strict";

import { Express } from "express";
import * as passport from "passport";
import * as comentarios from "./comentariosservice";


export function init(app: Express) {
  // Rutas de acceso a mascotas

  app
    .route("/comentarios/:newsId")
    .get(comentarios.findByID)
    .put(passport.authenticate("jwt", { session: false }), comentarios.findByID, comentarios.validateOwner, comentarios.validateUpdate, comentarios.update);

  app
    .route("/comentarios")
    .post(passport.authenticate("jwt", { session: false }), comentarios.validateUpdate, comentarios.update);
  }
