"use strict";

import * as mongoose from "mongoose";

export interface IComentarios extends mongoose.Document {

  description: string;
  user: mongoose.Schema.Types.ObjectId;
  news: mongoose.Schema.Types.ObjectId;
  created: Number;
  enabled: Boolean;


}

/**
 * Esquema de Mascotas
 */
export let ComentariosSchema = new mongoose.Schema({

  description: {
    type: String,
    default: "",
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: "Usuario es requerido"
  },
  news: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: "Usuario es requerido"
  },
  created: {
    type: Date,
    default: Date.now()
  },
  enabled: {
    type: Boolean,
    default: true
  }

}, { collection: "comentarioss" });

/**
 * Antes de guardar
 */
ComentariosSchema.pre("save", function (this: IComentarios, next) {
  next();
});

export let Comentarios = mongoose.model<IComentarios>("Comentarios", ComentariosSchema);
