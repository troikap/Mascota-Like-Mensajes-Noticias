import { IUserSessionRequest, IUserSession } from "../security/security.service";
import * as express from "express";
import { NextFunction } from "express-serve-static-core";
import { Like, ILike } from "./like.schema";
import * as errorHandler from "../utils/error.handler";
import * as mongoose from "mongoose";
import { IUser, User } from "../security/user.schema";
import { IPet, Pet } from "../pet/pet.schema";
import { INSPECT_MAX_BYTES } from "buffer";

export interface ILikeRequest extends express.Request {
    // user: IUser;
    mascota: IPet;
    like: ILike;
    likes: ILike[];
}

/**
 * @api {put} /nuevolike Crear Like
 * @apiName Crear Like
 * @apiGroup Likes
 *
 * @apiDescription Crea Like sobre una mascota de una usuario, asignandolo al mismo usuario logeado. Si ya existe cambia estados.
 *
 * @apiSuccessExample {json} Like
 *  [
 *      "usuarioName":"Lucas Perez Gracia",
 *      "mascotaName": "Tutus",
 *      "description: "Esa una Gatita muy buena.",
 *      "created": "",
 *      "enabled": [true|false],
 *      "usuario": "",
 *      "mascota": ""
 * ]
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */

/**
 * @api {get} /like/:mascota Cantidad de Like de Mascota
 * @apiName Cantidad de Like de Mascota
 * @apiGroup Likes
 *
 * @apiDescription Obtiene el número de Likes que tiene dicha Mascota.
 *
 * @apiParamExample {json} Like
 *    {
 *      "mascota": "",
 *      "enabled": true
 *    }
 * @apiSuccessExample {json} Cantidad
 *  [
 *    "cant": 3
 *  ]
 *
 * @apiUse AuthHeader
 * @apiUse 200OK
 * @apiUse OtherErrors
 */

/**
 * @api {get} likes/:mascota Listar Likes
 * @apiName Listar Likes
 * @apiGroup Likes
 *
 * @apiDescription Obtiene Likes relacionados con dicha Mascota.
 *
 * @apiParamExample {json} Like
 *    {
 *      "mascota": "",
 *      "enabled": true
 *    }
 * @apiSuccessExample {json} Like
 *  [
 *    {
 *      "usuarioName":"Lucas Perez Gracia",
 *      "mascotaName": "Tutus",
 *      "description: "Esa una Gatita muy buena.",
 *      "created": "",
 *      "enabled": [true|false],
 *      "usuario": "",
 *      "mascota": ""
 *    } ... ,
 *  ]
 *
 * @apiUse AuthHeader
 * @apiUse 200OK
 * @apiUse OtherErrors
 */

/**
 * @api {delete} /like/:usuario/:mascota Eliminar Like
 * @apiName Eliminar Like
 * @apiGroup Likes
 *
 * @apiDescription Buscar Like por Mascota y Usuario y le cambia el estado a falso.
 *
 * @apiParamExample {json} Like
 *    {
 *      "mascota": "",
 *      "usuario": "",
 *      "enabled": true
 *    }
 * @apiSuccessExample {json} Like
 *  [
 *    {
 *      "usuarioName":"Lucas Perez Gracia",
 *      "mascotaName": "Tutus",
 *      "description: "Esa una Gatita muy buena.",
 *      "created": "",
 *      "enabled": true,
 *      "usuario": "",
 *      "mascota": ""
 *    } ... ,
 *  ]
 *
 * @apiUse AuthHeader
 * @apiUse 200OK
 * @apiUse OtherErrors
 */

export function buscarLikePorMascota(req: ILikeRequest, res: express.Response, next: NextFunction) {
  Like.count({
    mascota: req.params.mascota,
    enabled: true
  }).exec(function (err, CANTIDAD) {
    if (err) return next();
    res.json(CANTIDAD);
    return CANTIDAD;
  });
}
export function remove(req: ILikeRequest, res: express.Response, next: NextFunction) {
  Like.findOne({
    usuario: req.params.usuario,
    mascota: req.params.mascota  })
    .exec(function (err, likeamodificar) {
      if (err) return next();
      likeamodificar.enabled = false;
      likeamodificar.save( function (err: any) {
        if (err) return errorHandler.handleError(res, err);
      });
    });
  }
export function crearLike(req: ILikeRequest, res: express.Response) {
    Like.findOne({
      usuario: req.body.usuario,
      mascota: req.body.mascota,
    }).exec(function (err , likebuscado) {
      if (likebuscado) {
      if (likebuscado.enabled == true) {
        likebuscado.enabled = false;
      }
      else {
        likebuscado.enabled = true;
      }
      likebuscado.save( function (err: any) {
        if (err) return errorHandler.handleError(res, err);
        res.json(likebuscado);
      });
      } else {
        likebuscado = new Like();
        likebuscado.usuario = req.body.usuario;
        likebuscado.mascota = req.body.mascota;
        likebuscado.usuarioName = req.body.usuarioName;
        likebuscado.mascotaName = req.body.mascotaName;
        likebuscado.enabled = true;
        likebuscado.save(function (err: any) {
          if (err) return errorHandler.handleError(res, err);
          res.json(likebuscado);
            }
          );
        }
      }
    );
  }
export function buscarLike(req: ILikeRequest, res: express.Response, next: NextFunction) {
  Like.find({
    mascota: req.params.mascota,
    enabled: true,
  }).exec(function (err, like) {
    if (err) return next();
    res.json(like);
    }
  );
}