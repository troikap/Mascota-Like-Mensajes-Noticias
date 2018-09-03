import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { RestBaseService } from "../tools/rest.tools";
import "rxjs/add/operator/toPromise";
import { Image } from "../perfil/perfil.service";
import { LikeDTO } from "./mascota-usuario.component";

@Injectable()
export class MascotaUsuarioService extends RestBaseService {
  private url = "/like";
  private urls = "/likes";
  private imagenUrl = "/image";
  private urlLike = "/nuevoLike";

  constructor(private http: Http) {
    super();
  }

  buscarLikePorMascota(id: string): Promise<Mascota[]> {
    return this.http
      .get(MascotaUsuarioService.serverUrl + this.urls + "/" + id, this.getRestHeader())
      .toPromise()
      .then(response => {
        return response.json() as Mascota[];
        // return response.json() as Like[];
      })
      .catch(this.handleError);
  }

  buscarMascotas(): Promise<Mascota[]> {
    return this.http
      .get(MascotaUsuarioService.serverUrl + this.url, this.getRestHeader())
      .toPromise()
      .then(response => {
        return response.json() as Mascota[];
      })
      .catch(this.handleError);
  }

  buscarMascota(id: number): Promise<Mascota> {
    return this.http
      .get(MascotaUsuarioService.serverUrl + this.url + "/" + id, this.getRestHeader())
      .toPromise()
      .then(response => {
        return response.json() as Mascota;
      })
      .catch(this.handleError);
  }

  guardarMascota(value: Mascota): Promise<Mascota> {
    if (value._id) {
      return this.http
        .put(
          MascotaUsuarioService.serverUrl + this.url + "/" + value._id,
          JSON.stringify(value),
          this.getRestHeader()
        )
        .toPromise()
        .then(response => {
          return response.json() as Mascota;
        })
        .catch(this.handleError);
    } else {
      return this.http
        .post(
          MascotaUsuarioService.serverUrl + this.url,
          JSON.stringify(value),
          this.getRestHeader()
        )
        .toPromise()
        .then(response => {
          return response.json() as Mascota;
        })
        .catch(this.handleError);
    }
  }

  buscarImagen(id: string): Promise<Image> {
    return this.http
      .get(MascotaUsuarioService.serverUrl + this.imagenUrl + "/" + id, this.getRestHeader())
      .toPromise()
      .then(response => {
        return response.json() as Image;
      })
      .catch(this.handleError);
  }

  guardarImagen(value: Image): Promise<Image> {
    return this.http
      .post(
      MascotaUsuarioService.serverUrl + this.imagenUrl,
      JSON.stringify(value),
      this.getRestHeader()
      )
      .toPromise()
      .then(response => {
        return response.json() as Image;
      })
      .catch(this.handleError);
  }

  eliminarMascota(id: string): Promise<any> {
    if (id) {
      return this.http
        .delete(
          MascotaUsuarioService.serverUrl + this.url + "/" + id,
          this.getRestHeader()
        )
        .toPromise()
        .then(response => {
          return "";
        })
        .catch(this.handleError);
    }
  }

  buscarDetalleMascotaUsuarioSeleccionado(id: string): Promise<Mascota[]> {
    return this.http
    // tslint:disable-next-line:quotemark
    .get(MascotaUsuarioService.serverUrl + "/usuario/" + id, this.getRestHeader())
    .toPromise()
    .then(response => {
      return response.json() as Mascota[];
    })
    .catch(this.handleError);
  }

  buscarMascotaUsuarioSeleccionado(id: string): Promise<Mascota[]> {
    return this.http
    .get(MascotaUsuarioService.serverUrl + "/pets/" + id, this.getRestHeader())
    .toPromise()
    .then(response => {
      return response.json() as Mascota[];
    })
    .catch(this.handleError);
  }

  likeMascota(petId: String, userid: string): Promise<any> {
    console.log("USERID " + userid);
    return this.http
    .post(MascotaUsuarioService.serverUrl + "/pets/" + petId + "/" + userid, JSON.stringify(undefined), this.getRestHeader())
    .toPromise()
    .then(response => {
      return "";
    }).catch(this.handleError);
  }
  iniciarLike(dto: LikeDTO): Promise<Like> {
    return this.http
      .post(MascotaUsuarioService.serverUrl + this.url,
      JSON.stringify(dto),
      this.getRestHeader())
      .toPromise()
      .then(response => {
          return response.json() as Like;
      })
      .catch(this.handleError);
}


  guardarLike(value: Like): Promise<Like> {
    console.log("Like: " + value.usuarioName + "-" + value.mascotaName);
    return this.http
      .post(
        MascotaUsuarioService.serverUrl + this.urlLike,
        JSON.stringify(value),
        this.getRestHeader()
      )
      .toPromise()
      .then(response => {
        return response.json() as Like;
      })
      .catch(this.handleError);
  }

}

export interface Mascota {
  _id: string;
  name: string;
  birthDate: string;
  description: string;
  image: string;
  imageBlob: Image;
  news: string;
  imagen: string;
}

export interface Like {
  usuario: String;
  mascota: String;
  usuarioName: String;
  mascotaName: String;
}
export interface Comentario {
  _id: string;
  description: string;
  user: string;
  news: string;
  name: string;
  imagen: string;
}
export interface Cantidad {
cant: number;

}