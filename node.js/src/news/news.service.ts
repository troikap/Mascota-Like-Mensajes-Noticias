"use strict";

import { NextFunction } from "express-serve-static-core";
import { News, INews } from "./news.schema";
import { IUserSession, IUserSessionRequest } from "../security/security.service";

import * as mongoose from "mongoose";
import * as errorHandler from "../utils/error.handler";
import * as express from "express";
import * as escape from "escape-html";

/**
 * Retorna los datos de la mascota
 */
export interface IReadRequest extends IUserSessionRequest {
  news: INews;
}
export function read(req: IReadRequest, res: express.Response) {
  res.json(req.news);
}



export interface IUpdateRequest extends IUserSessionRequest {
  news: INews;
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
  let news = req.news;
  if (!news) {
    news = new News();
    news.user = req.user._id;
  }


  if (req.body.description) {
    news.description = req.body.description;
  }

  if (req.body.imagen) {
    news.imagen = req.body.imagen;
  }
  news.save(function (err: any) {
    if (err) return errorHandler.handleError(res, err);

    res.json(news);
  });
}

/**
 * @api {delete} /news/:newsId Eliminar Noticia
 * @apiName Eliminar Noticia
 * @apiGroup Noticias
 *
 * @apiDescription Eliminar una noticia.
 *
 * @apiUse AuthHeader
 * @apiUse 200OK
 * @apiUse OtherErrors
 */
/**
 * @api {put} /news/:newsId Crear Noticia
 * @apiName Crear Noticia
 * @apiGroup Noticias
 *
 * @apiDescription Crea o actualiza una noticia.
 *
 * @apiParamExample {json} Noticia
 *    {
 *      "newsId": "",
 *      "enabled": [true]
 *    }
 *
 * @apiSuccessExample {json} Provincia
 *    {
 *      "description": "Es un Conejo Raro,,,,"
 *      "imagen": "",
 *      "created: "",
 *      "enabled": [true|false],
 *      "user": ""
 *    }
 *
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */

/**
 * @api {get} /newsList Listar Noticias
 * @apiName Listar Noticias
 * @apiGroup Noticias
 *
 * @apiDescription Obtiene un listado de las Noticias del Muro.
 *
 * @apiSuccessExample {json} Noticias
 *  [
 *     {
 *         "description": "Es un Conejo Raro,,,,",
 *         "imagen": "" ",
 *         "created": "2018-09-01T00:07:58.104Z",
 *         "enabled": true,
 *         "_id": "5b89d937a1767441987e3f26",
 *         "user": "5b313e7fdd15231454bd0031",
 *         "__v": 0
 *     }, ...
 * ]
 *
 * @apiUse AuthHeader
 * @apiUse 200OK
 * @apiUse OtherErrors
 */
export interface IRemoveRequest extends IUserSessionRequest {
  news: INews;
}
export function remove(req: IRemoveRequest, res: express.Response) {
  const news = <INews>req.news;

  news.enabled = false;
  news.save(function (err: any) {
    if (err) return errorHandler.handleError(res, err);

    res.send();
  });
}


export function findByCurrentUser(req: IUserSessionRequest, res: express.Response, next: NextFunction) {
  News.find({
    user: req.user._id,
    enabled: true
  }).exec(function (err, newss) {
    console.log("encontramos noticias: " + newss);
    if (err) return next();
    res.json(newss);
  });
}

export function list(req: express.Request, res: express.Response, next: NextFunction) {
  News.find({ enabled: true })
  .exec(function (err, newss: INews[]) {
    console.log("Pero en Realidad Ejecuta list: " + newss.length);
    if (err) return errorHandler.handleError(res, err);
    return res.json(newss);
  });
}
export function Otrolist(req: express.Request, res: express.Response, next: NextFunction) {
  News.find({
    enabled: true })
  .exec(function (err, noticias) {
    console.log("Me trajo estas noticias: " );
    if (err) return next();
    res.json(noticias);
  });
}
export interface IFindByIdRequest extends express.Request {
  news: INews;
}
export function findByID(req: IFindByIdRequest, res: express.Response, next: NextFunction) {
  const id = req.params.newsId;

  News.findOne({
    _id: escape(id),
    enabled: true
  },
    function (err, news) {
      if (err) return errorHandler.handleError(res, err);

      if (!news) {
        return errorHandler.sendError(res, errorHandler.ERROR_NOT_FOUND, "No se pudo cargar la mascota " + id);
      }

      req.news = news;
      next();
    });
}
/**
 * Autorizacion, el unico que puede modificar el mascota es el dueño
 */
export interface IValidateOwnerRequest extends IUserSessionRequest {
  news: INews;
}
export function validateOwner(req: IValidateOwnerRequest, res: express.Response, next: NextFunction) {
  if (!((req.news.user as any).equals(req.user._id))) {
    return errorHandler.sendError(res, errorHandler.ERROR_UNAUTHORIZED_METHOD, "User is not authorized");
  }
  next();
}
