"use strict";

import { Express } from "express";
import * as passport from "passport";
import * as news from "./news.service";

export function init(app: Express) {
  // Rutas de acceso a mascotas
  app
    .route("/news")
    .get(passport.authenticate("jwt", { session: false }), news.findByCurrentUser)
    .post(passport.authenticate("jwt", { session: false }), news.validateUpdate, news.update);

  app
    .route("/news/:newsId")
    .get(news.findByID, news.read)
    .put(passport.authenticate("jwt", { session: false }), news.findByID, news.validateOwner, news.validateUpdate, news.update)
    .delete(passport.authenticate("jwt", { session: false }), news.findByID, news.validateOwner, news.remove);

  app
    .route("/newsList")
    .get(passport.authenticate("jwt", { session: false }), news.Otrolist);
  }
