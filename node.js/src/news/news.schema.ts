"use strict";

import * as mongoose from "mongoose";

export interface INews extends mongoose.Document {

  description: string;
  imagen: string;
  user: mongoose.Schema.Types.ObjectId;
  updated: Number;
  created: Number;
  enabled: Boolean;
}

/**
 * Esquema de Mascotas
 */
export let NewsSchema = new mongoose.Schema({

  description: {
    type: String,
    default: "",
    trim: true
  },
  imagen: {
    type: String,
    default: "",
    trim: true
  },
  user: {
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
}, { collection: "newss" });

/**
 * Antes de guardar
 */
NewsSchema.pre("save", function (this: INews, next) {
  next();
});

export let News = mongoose.model<INews>("News", NewsSchema);
