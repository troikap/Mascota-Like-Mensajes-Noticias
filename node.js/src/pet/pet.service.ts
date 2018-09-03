"use strict";

import { NextFunction } from "express-serve-static-core";
import { Pet, IPet } from "./pet.schema";
import { IUserSession, IUserSessionRequest } from "../security/security.service";

import * as mongoose from "mongoose";
import * as errorHandler from "../utils/error.handler";
import * as express from "express";
import * as escape from "escape-html";
import { User, IUser }  from "../security/user.schema";

export interface IReadRequest extends IUserSessionRequest {
  pet: IPet;
}
export function read(req: IReadRequest, res: express.Response) {
  res.json(req.pet);
}

export interface IUpdateRequest extends IUserSessionRequest {
  pet: IPet;
}
export interface IUSUARIO extends express.Request {             // mio
  user: IUser;
}
export function findByParamUser(req: IUSUARIO, res: express.Response, next: NextFunction) {
  Pet.find({
      user: req.params.userId,
      enabled: true})
    .exec(function (err, pets) {
        if (err) return next();
        res.json(pets);
    });
}


export function validateUpdate(req: IUpdateRequest, res: express.Response, next: NextFunction) {
  if (req.body.name) {
    req.check("name", "Hasta 256 caracteres solamente.").isLength({ max: 256 });
    req.sanitize("name").escape();
  }
  if (req.body.description) {
    req.check("description", "Hasta 1024 caracteres solamente.").isLength({ max: 1024 });
    req.sanitize("description").escape();
  }
  if (req.body.birthDate) {
    req.check("birthDate", "No es v&aacute;lido").isLength({ min: 1 });
    req.sanitize("birthDate").escape();
  }

  if (req.body.image) {
    req.check("image", "No es v&aacute;lido").isLength({ min: 1 });
    req.sanitize("image").escape();
  }

  req.getValidationResult().then(function (result) {
    if (!result.isEmpty()) {
      return errorHandler.handleExpressValidationError(res, result);
    }
    next();
  });
}
export function update(req: IUpdateRequest, res: express.Response) {
  let pet = req.pet;
  if (!pet) {
    pet = new Pet();
    pet.user = req.user._id;
  }

  if (req.body.name) {
    pet.name = req.body.name;
  }
  if (req.body.description) {
    pet.description = req.body.description;
  }
  if (req.body.image) {
    pet.image = req.body.image;
  }
  if (req.body.birthDate) {
    pet.birthDate = req.body.birthDate;
  }

  pet.save(function (err: any) {
    if (err) return errorHandler.handleError(res, err);

    res.json(pet);
  });
}

/**
 * @api {delete} /pet/:petId Eliminar Mascota
 * @apiName Eliminar Mascota
 * @apiGroup Mascotas
 *
 * @apiDescription Eliminar una mascota.
 *
 * @apiUse AuthHeader
 * @apiUse 200OK
 * @apiUse OtherErrors
 */
export interface IRemoveRequest extends IUserSessionRequest {
  pet: IPet;
}
export function remove(req: IRemoveRequest, res: express.Response) {
  const pet = <IPet>req.pet;

  pet.enabled = false;
  pet.save(function (err: any) {
    if (err) return errorHandler.handleError(res, err);

    res.send();
  });
}

/**
 * @api {get} /pet Listar Mascota
 * @apiName Listar Mascota
 * @apiGroup Mascotas
 *
 * @apiDescription Obtiene un listado de las mascotas del usuario actual.
 *
 * @apiSuccessExample {json} Mascota
 *  [
 *    {
 *      "name": "Nombre de la masctoa",
 *      "description": "Descripcion de la mascota",
 *      "user": "Id de usuario",
 *      "birthDate": date (DD/MM/YYYY),
 *      "updated": date (DD/MM/YYYY),
 *      "created": date (DD/MM/YYYY),
 *      "enabled": [true|false]
 *    }, ...
 *  ]
 *
 * @apiUse AuthHeader
 * @apiUse 200OK
 * @apiUse OtherErrors
 */

/**
 * @api {put} /pet/:petId Crear Mascota
 * @apiName Crear Mascota
 * @apiGroup Mascotas
 *
 * @apiDescription Busca si la mascota que intenta crearse ya existe
 * si no existe la crea.
 *
 * @apiSuccessExample {json} Mascota
 *  {
 *      "name":"Tutus",
 *      "birthDate: "",
 *      "description: "Esa una Gatita muy buena.",
 *      "update": "",
 *      "created": "",
 *      "enabled": true,
 *      "user": ""
 * }
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */

export function findByCurrentUser(req: IUserSessionRequest, res: express.Response, next: NextFunction) {
  Pet.find({
    user: req.user._id,
    enabled: true
  }).exec(function (err, pets) {
    if (err) return next();
    res.json(pets);
  });
}


export interface IFindByIdRequest extends express.Request {
  pet: IPet;
}
 export function findByID(req: IFindByIdRequest, res: express.Response, next: NextFunction, id: string) {
  Pet.findOne({
    _id: escape(id),
    enabled: true
  },
    function (err, pet) {
      if (err) return errorHandler.handleError(res, err);

      if (!pet) {
        return errorHandler.sendError(res, errorHandler.ERROR_NOT_FOUND, "No se pudo cargar la mascota " + id);
      }

      req.pet = pet;
      next();
    });
}

/**
 * Autorizacion, el unico que puede modificar el mascota es el dueño
 */
export interface IValidateOwnerRequest extends IUserSessionRequest {
  pet: IPet;
}
export function validateOwner(req: IValidateOwnerRequest, res: express.Response, next: NextFunction) {
  if (!((req.pet.user as any).equals(req.user._id))) {
    return errorHandler.sendError(res, errorHandler.ERROR_UNAUTORIZED_METHOD, "User is not authorized");
  }
  next();
}
export function list(req: express.Request, res: express.Response) {
  Pet.find({ enabled: true}).exec(function (err, mascota: IPet[]) {
    if (err) return errorHandler.handleError(res, err);

    return res.json(mascota);
  });
}


