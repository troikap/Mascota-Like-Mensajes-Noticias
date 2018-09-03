"use strict";

import { NextFunction } from "express-serve-static-core";
import { Comentarios, IComentarios } from "./comentariosschema";
import { IUserSession, IUserSessionRequest } from "../security/security.service";

import * as mongoose from "mongoose";
import * as errorHandler from "../utils/error.handler";
import * as express from "express";
import * as escape from "escape-html";

/**
 * Retorna los datos de la mascota
 */
export interface IReadRequest extends IUserSessionRequest {
  comentarios: IComentarios;
}
export function read(req: IReadRequest, res: express.Response) {
  res.json(req.comentarios);
}



export interface IUpdateRequest extends IUserSessionRequest {
  comentarios: IComentarios;
}
export function validateUpdate(req: IUpdateRequest, res: express.Response, next: NextFunction) {

  if (req.body.description) {
    req.check("description", "Hasta 1024 caracteres solamente.").isLength({ max: 1024 });
    req.sanitize("description").escape();
  }

  if (req.body.imagen) {
    req.check("imagen", "No es v&aacute;lido").isLength({ min: 1 });
    req.sanitize("imagen").escape();
  }
  req.getValidationResult().then(function (result) {
    if (!result.isEmpty()) {
      return errorHandler.handleExpressValidationError(res, result);
    }
    next();
  });
}
export function update(req: IUpdateRequest, res: express.Response) {
  let comentarios = req.comentarios;
  if (!comentarios) {
    comentarios = new Comentarios();
    comentarios.user = req.user._id;
  }


  if (req.body.description) {
    comentarios.description = req.body.description;
  }

  if (req.body.news) {
    comentarios.news = req.body.news;
  }
  comentarios.save(function (err: any) {
    if (err) return errorHandler.handleError(res, err);

    res.json(comentarios);
  });
}


export interface IRemoveRequest extends IUserSessionRequest {
  comentarios: IComentarios;
}
export function remove(req: IRemoveRequest, res: express.Response) {
  const comentarios = <IComentarios>req.comentarios;

  comentarios.enabled = false;
  comentarios.save(function (err: any) {
    if (err) return errorHandler.handleError(res, err);

    res.send();
  });
}


export function findByCurrentUser(req: IUserSessionRequest, res: express.Response, next: NextFunction) {
  Comentarios.find({
    user: req.user._id,
    enabled: true
  }).exec(function (err, comentarioss) {
    if (err) return next();
    res.json(comentarioss);
  });
}




export interface IFindByIdRequest extends express.Request {
  comentarios: IComentarios;
}
export function findByID(req: IFindByIdRequest, res: express.Response, next: NextFunction) {
  const id = req.params.newsId;

  Comentarios.find({
    news: escape(id),
    enabled: true
  })

  .exec(function (err, comentarios) {
    if (err) return next();
    res.json(comentarios);
  });

    // function (err, comentarios) {
    //   if (err) return errorHandler.handleError(res, err);

    //   if (!comentarios) {
    //     return errorHandler.sendError(res, errorHandler.ERROR_NOT_FOUND, "No se pudo cargar la mascota " + id);
    //   }

    //   req.comentarios = comentarios;
    //   next();
    // });
}
/**
 * Autorizacion, el unico que puede modificar el mascota es el dueño
 */
export interface IValidateOwnerRequest extends IUserSessionRequest {
  comentarios: IComentarios;
}
export function validateOwner(req: IValidateOwnerRequest, res: express.Response, next: NextFunction) {
  if (!((req.comentarios.user as any).equals(req.user._id))) {
    return errorHandler.sendError(res, errorHandler.ERROR_UNAUTHORIZED_METHOD, "User is not authorized");
  }
  next();
}
