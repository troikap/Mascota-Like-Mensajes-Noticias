import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { RestBaseService } from "../tools/rest.tools";
import { PerfilService } from "../perfil/perfil.service";


@Injectable()
export class NoticiaService extends RestBaseService {
  private urlList = "/newsList";
  private url = "/news";
  private urlComentario = "/comentarios";


  constructor(private http: Http, private perfilService: PerfilService) {
    super();
  }

  buscarNoticias(): Promise<Mascota[]> {
    return this.http
      .get(NoticiaService.serverUrl + this.urlList, this.getRestHeader())
      .toPromise()
      .then(response => {
        console.log(NoticiaService.serverUrl + this.urlList);
        return response.json() as Mascota[];
      })
      .catch(this.handleError);
  }
  buscarPerfil(id): Promise<Perfil> {
    return this.perfilService.buscarPerfilById(id)
      .then(response => {
        return response;
      })
      .catch(this.handleError);
  }

  buscarComentario(id): Promise<Comentario[]> {

    return this.http
      .get(NoticiaService.serverUrl + this.urlComentario + "/" + id, this.getRestHeader())
      .toPromise()
      .then(response => {
        return response.json() as Comentario[];
      })
      .catch(this.handleError);
  }

  buscarImagen(id): Promise<imagenPerfil> {

    return this.perfilService.buscarImagen(id)
      .then(response => {
        return response;
      })
      .catch(this.handleError);
  }
  buscarMascota(id: number): Promise<Mascota> {
    return this.http
      .get(NoticiaService.serverUrl + this.url + "/" + id, this.getRestHeader())
      .toPromise()
      .then(response => {
        return response.json() as Mascota;
      })
      .catch(this.handleError);
  }

  guardarNoticia(value: Mascota): Promise<Mascota> {
    if (value._id) {
      return this.http
        .put(
          NoticiaService.serverUrl + this.url + "/" + value._id,
          JSON.stringify(value),
          this.getRestHeader()
        )
        .toPromise()
        .then(response => {
          return response.json() as Mascota;
        })
        .catch(this.handleError);
    } else {
      value.imagen = btoa(value.imagen);
      return this.http
        .post(
          NoticiaService.serverUrl + this.url,
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

  guardarComentario(value: Comentario): Promise<Comentario> {

    return this.http
      .post(
        NoticiaService.serverUrl + this.urlComentario,
        JSON.stringify(value),
        this.getRestHeader()
      )
      .toPromise()
      .then(response => {
        return response.json() as Comentario;
      })
      .catch(this.handleError);
  }
}






export interface Mascota {
  _id: string;
  name: string;
  birthDate: string;
  description: string;
  imagen: string;
  user: string;
  picture: string;
  alerta: boolean;
  showComentario: boolean;
  comentarios: Comentario[];
}

export interface Comentario {
  _id: string;
  description: string;
  user: string;
  news: string;
  name: string;
  imagen: string;
}


export interface Perfil {
  name: string;
  picture: string;
}

// tslint:disable-next-line:class-name
export class imagenPerfil {
  image: string;
}