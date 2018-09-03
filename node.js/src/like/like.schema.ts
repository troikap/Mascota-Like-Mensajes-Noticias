"use strict";

import * as mongoose from "mongoose";

export interface ILike extends mongoose.Document {
  usuario: string;
  mascota: string;
  usuarioName: string;
  mascotaName: string;
  updated: Date;
  created: Date;
  enabled: Boolean;
}

/**
 * Esquema de Like
 */
export let LikeSchema = new mongoose.Schema({
  usuario: {
    type: String,
    ref: "User",
    required: "Usuario es requerido"
  },
  mascota: {
    type: String,
    ref: "Mascota",
    required: "Mascota es requerido"
  },
  usuarioName: {
    type: String,
    default: ""
  },
  mascotaName: {
    type: String,
    default: ""
  },
  updated: {
    type: Date,
    default: Date.now
  },
  created: {
    type: Date,
    default: Date.now
  },
  enabled: {
    type: Boolean,
    default: true
  }
}, { collection: "like" });

/**
 * Antes de guardar
 */
LikeSchema.pre("save", function (next: Function) {
  this.updated = Date.now;

  next();
});

export let Like = mongoose.model<ILike>("Like", LikeSchema);