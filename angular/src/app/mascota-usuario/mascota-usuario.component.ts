import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs/Rx";
import * as errorHanlder from "../tools/error-handler";
import { IErrorController } from "../tools/error-handler";
import * as esLocale from "date-fns/locale/es";
import { Image } from "../perfil/perfil.service";
import { MascotaService, Mascota } from "../mascota/mascota.service";
import { ActivatedRoute, Routes } from "@angular/router";
import { Router, RouterLink } from "@angular/router";
import { Usuario, UsuarioService } from "../usuario/usuario.service";
import { Like, MascotaUsuarioService, Cantidad } from "./mascota-usuario.service";
import { count } from "rxjs/operators";

@Component({
  selector: "app-mascota",
  templateUrl: "./mascota-usuario.component.html"
})

export class MascotaUsuarioComponent implements OnInit {
  errorMessage: string;
  mascotas: Mascota[];
  mascota: Mascota;
  usuario: Usuario;
  like: Like;
  cantidadLike: Cantidad;
  rutaUsuario: String;
  encadenarLike: String;
  showLikes: boolean;
  private usuarioLogueado: Usuario;

  constructor(
    private MascotaUsuarioService: MascotaUsuarioService,
    private mascotasService: MascotaService,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private router: Router) {
                this.mascota = {
                  _id: undefined,
                  name: "",
                  birthDate: "",
                  description: "",
                  image: "",
                  cantidadLike: 0,
                  encadenarLike: "",
                  showLikes: false,
                  imageBlob: {
                    image: ""
                  }
                };
                this.like = {
                  mascota: "",
                  mascotaName: "",
                  usuario: "",
                  usuarioName: "",
                };
                this.usuarioLogueado = this.usuarioService.usuarioLogueado;
              }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const usuarioId = params["usuarioId"];
      this.rutaUsuario = params["usuarioId"];
      if (usuarioId) {
        this.mascotasService
          .buscarMascotasUsuario(usuarioId)
          .then(mascotas => {
              this.mascotas = mascotas;
              mascotas.forEach(mascota => {
                this.MascotaUsuarioService
                .buscarLikePorMascota(mascota._id)
                .then( result => {
                  // console.log("Esto es Lo que devuelve result: " + result.length + " o esto " + result);
                  mascota.cantidadLike = result.length;                                                           // error cambiar a buscarLikePorMAscota
                  mascota.encadenarLike = result.join(", ");
                                    /*.forEach( individual => {
                    mascota.encadenarLike = ;
                    console.log("Estos son los usuarios que dieron like: " + mascota.encadenarLike);
                  });*/
                }
                );
                if (mascota.image) {
                      this.mascotasService
                      .buscarImagen(mascota.image)
                      .then(imagen => {
                          mascota.imageBlob = imagen;
                          }).catch( error => mascota.imageBlob.image = "/assets/profile.png");
                  } else {
                   mascota.imageBlob.image = "/assets/profile.png";
                    }
              });
            })
            .catch(error => (this.errorMessage = <any>error));
        }
      });
    }

    guardarLike( mascota ) {
        this.like.mascota = mascota._id;
        this.like.mascotaName = mascota.name;
        this.like.usuario = this.usuarioService.usuarioLogueado.codigo;
        this.like.usuarioName = this.usuarioService.usuarioLogueado.name;
        this.mascotasService
          .buscarMascota(mascota._id)
          .then(mas => {
            this.like.mascotaName = mas.name;
            console.log(mas);
                       });
        this.MascotaUsuarioService
          .guardarLike(this.like)
          .then(comentar => { this.router.navigate(["/muro-usuario/" + this.rutaUsuario]), this.ngOnInit(); });
          // .catch(error => errorHanlder.procesarValidacionesRest(this, error));
    }
    mostrarLike( mascota ) {
        this.MascotaUsuarioService
          .buscarLikePorMascota( mascota._id )
          .then(mostrar => {
            mostrar.forEach( likeindividual => {
              this.encadenarLike = this.encadenarLike + "-" + likeindividual.usuarioName;
            });
          });
    }

    showLike(mascota): void {
      mascota.showLikes = true;
    }
    hidenLike(mascota): void {
      mascota.showLikes = false;
    }
}

export class LikeDTO {
  usuario: Usuario;
  mascota: Mascota;
}
