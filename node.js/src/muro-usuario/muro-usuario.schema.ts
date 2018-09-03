"use strict";

import * as mongoose from "mongoose";


export interface IMuroUsuario extends mongoose.Document {
  name: string;
  enabled: Boolean;
}

export let MuroUsuarioSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "",
    trim: true,
    required: "Nombre no puede estar vacio."
  },
  enabled: {
    type: Boolean,
    default: true
  }
}, { collection: "users" });

export let MuroUsuario = mongoose.model<IMuroUsuario>("MuroUsuario", MuroUsuarioSchema);
