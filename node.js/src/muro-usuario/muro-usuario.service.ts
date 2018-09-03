"use strict";

import { NextFunction } from "express-serve-static-core";
import { MuroUsuario, IMuroUsuario } from "./muro-usuario.schema";
import { IUserSession, IUserSessionRequest } from "../security/security.service";

import * as mongoose from "mongoose";
import * as errorHandler from "../utils/error.handler";
import * as express from "express";
import * as escape from "escape-html";
import { Pet, IPet } from "../pet/pet.schema";

/**
 * Busca una provincia
 */
export interface IReadRequest extends express.Request {
  muroUsuario: IMuroUsuario;
}
export function read(req: IReadRequest, res: express.Response) {
  res.json(req.muroUsuario);
}

export function list(req: express.Request, res: express.Response) {
  MuroUsuario.find({ enabled: true }).exec(function (err, usuarios: IMuroUsuario[]) {
    if (err) return errorHandler.handleError(res, err);

    return res.json(usuarios);
  });
}

export interface IFindByIdRequest extends express.Request {
  muroUsuario: IMuroUsuario;
}
export function findByID(req: IFindByIdRequest, res: express.Response, next: NextFunction, id: string) {
  MuroUsuario.findOne({
    _id: escape(id),
    enabled: true
  },
    function (err, muroUsuario: IMuroUsuario) {
      if (err) return errorHandler.handleError(res, err);

      if (!muroUsuario) {
        return errorHandler.sendError(res, errorHandler.ERROR_NOT_FOUND, "No se pudo encontrar la provincia " + id);
      }

      req.muroUsuario = muroUsuario;
      next();
    });
}

export interface IUpdateRequest extends IUserSessionRequest {
  muroUsuario: IMuroUsuario;
}
export function validateUpdate(req: IUpdateRequest, res: express.Response, next: NextFunction) {
  if (req.body.name) {
    req.check("name", "Hasta 256 caracteres solamente.").isLength({ max: 256 });
    req.sanitize("name").escape();
  }

  req.getValidationResult().then(function (result) {
    if (!result.isEmpty()) {
      return errorHandler.handleExpressValidationError(res, result);
    }
    next();
  });
}
export function update(req: IUpdateRequest, res: express.Response) {
  let muroUsuario = <IMuroUsuario>req.muroUsuario;
  if (!muroUsuario) {
    muroUsuario = new MuroUsuario();
  }

  if (req.body.name) {
    muroUsuario.name = req.body.name;
  }

  muroUsuario.save(function (err: any) {
    if (err) return errorHandler.handleError(res, err);

    res.json(muroUsuario);
  });
}


export interface IRemoveRequest extends IUserSessionRequest {
  muroUsuario: IMuroUsuario;
}
export function remove(req: IRemoveRequest, res: express.Response) {
  const muroUsuario = <IMuroUsuario>req.muroUsuario;

  muroUsuario.enabled = false;
  muroUsuario.save(function (err: any) {
    if (err) return errorHandler.handleError(res, err);

    res.send();
  });
}
export function findByUser(req: express.Request, res: express.Response, next: NextFunction) {
  Pet.find({
    user: req.params.id,
    enabled: true
  }).exec(function (err, pets) {
    if (err) return next();
    res.json(pets);
  });
}