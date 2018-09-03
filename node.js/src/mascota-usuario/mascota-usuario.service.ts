"use strict";

import { NextFunction } from "express-serve-static-core";
import * as express from "express";
import { User, IUser }  from "../security/user.schema";
import { Pet, IPet } from "../pet/pet.schema";
import { IUserSession, IUserSessionRequest } from "../security/security.service";
import * as errorHandler from "../utils/error.handler";
export interface IUSUARIO extends express.Request {             // mio
  user: IUser;
}
export function encontrarMascotasUsuario(req: IUSUARIO, res: express.Response, next: NextFunction) {
  Pet.find({ user: req.params.mascotaUsuarioId })
     .exec(function (err, pets) {
        if (err) return next();
     res.json(pets);
  });
}

export function findByCurrentUser(req: IUserSessionRequest, res: express.Response, next: NextFunction) {
  Pet.find({
    user: req.user._id,
    enabled: true
  }).exec(function (err, pets) {
    if (err) return next();
    res.json(pets);
  });
}

export function list(req: express.Request, res: express.Response) {
  Pet.find({ enabled: true}).exec(function (err, mascota: IPet[]) {
    if (err) return errorHandler.handleError(res, err);

    return res.json(mascota);
  });
}