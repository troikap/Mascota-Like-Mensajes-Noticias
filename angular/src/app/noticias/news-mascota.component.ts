import { Component, OnInit } from "@angular/core";
import { Mascota, NoticiaService, Comentario, Perfil, imagenPerfil } from "./noticia.service";
import { ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";


import { IErrorController } from "../tools/error-handler";
import * as errorHanlder from "../tools/error-handler";

@Component({
  selector: "app-news-mascota",
  templateUrl: "./news-mascota.component.html"
})
export class MascotasNewsComponent implements OnInit, IErrorController {
  errorMessage: string;
  mascotas: Mascota[];
  file_srcs: any;
  mascota: Mascota;
  comentario: Comentario;
  perfil: Perfil;
  alerta: boolean;
  imagenPerfil: imagenPerfil;
  showComentarios: boolean;
  formSubmitted: boolean;
  errors: string[] = [];
  public file_srcs1: string[] = [];
  public debug_size_before: string[] = [];
  public debug_size_after: string[] = [];
  constructor(private noticiaService: NoticiaService,
              private router: Router,
              private route: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef) {
    this.mascota = {
      _id: undefined,
      name: "",
      birthDate: "",
      description: "",
      imagen: "",
      alerta: false,
      user: "",
      showComentario: false,
      comentarios: [],
      picture: ""
    };
    this.comentario = {
      _id: undefined,
      description: "",
      user: "",
      news: "",
      name: "",
      imagen: ""
    };
  }

  ngOnInit() {
    this.noticiaService
      .buscarNoticias()
      .then(noticiasMascotas => {
        (this.mascotas = noticiasMascotas,
         this.mascotas.forEach(mascota => {
            mascota.imagen = atob(mascota.imagen);
              this.noticiaService
                .buscarPerfil(mascota.user)
                .then(perfil => {
                  this.perfil = perfil;
                  mascota.name = this.perfil.name;
                  if (this.perfil.picture) {
                    this.noticiaService
                      .buscarImagen(this.perfil.picture)
                      .then(imagen => {
                        mascota.picture = imagen.image;
                      }).catch(error => mascota.picture = "/assets/profile.png");
                  } else {
                    mascota.picture = "/assets/profile.png";
                  }
                })
                .catch(error => {
                  this.imagenPerfil.image = "/assets/profile.png";
                });
              this.noticiaService
                .buscarComentario(mascota._id)
                .then(comentarios => {
                  (mascota.comentarios = comentarios,
                    mascota.comentarios.forEach(element1 => {
                      this.noticiaService
                        .buscarPerfil(element1.user)
                        .then(perfil => {
                          this.perfil = perfil;
                          element1.name = this.perfil.name;
                          if (this.perfil.picture) {
                            this.noticiaService
                              .buscarImagen(this.perfil.picture)
                              .then(imagen => {
                                element1.imagen = imagen.image;
                              }).catch(error => mascota.picture = "/assets/profile.png");
                          } else {
                            mascota.picture = "/assets/profile.png";
                          }
                        })
                        .catch(error => {
                          this.imagenPerfil.image = "/assets/profile.png";
                        });
                    })
                  );
                })
                .catch(error => (this.errorMessage = <any>error));

            })
        );
      }
    )
      .catch(error => (this.errorMessage = <any>error));
  }

  showComentario(mascota): void {
    mascota.showComentario = true;
  }
  hidenComentario(mascota): void {
    mascota.showComentario = false;
  }

  resize(img, MAX_WIDTH: number, MAX_HEIGHT: number, callback) {
    // This will wait until the img is loaded before calling this function
    return img.onload = () => {

      // Get the images current width and height
      // tslint:disable-next-line:no-var-keyword
      var width = img.width;
      // tslint:disable-next-line:no-var-keyword
      var height = img.height;
      // Set the WxH to fit the Max values (but maintain proportions)
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      // create a canvas object
      // tslint:disable-next-line:prefer-const
      // tslint:disable-next-line:no-var-keyword
      // tslint:disable-next-line:prefer-const
      let canvas = document.createElement("canvas");
      // Set the canvas to the new calculated dimensions
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(img, 0, 0, width, height);

      // Get this encoded as a jpeg
      // IMPORTANT: 'jpeg' NOT 'jpg'
      // tslint:disable-next-line:prefer-const
      let dataUrl = canvas.toDataURL("image/jpeg");

      // callback with the results
      callback(dataUrl, img.src.length, dataUrl.length);
    };
  }
  readFile(file, reader, callback) {
    reader.onload = () => {
      callback(reader.result);
      this.mascota.imagen = reader.result;
      console.log(reader.result);
    };
    reader.readAsDataURL(file);
  }
  readFiles(files, index = 0) {
    // Create the file reader
    const reader = new FileReader();

    // If there is a file
    if (index in files) {
      // Start reading this file
      this.readFile(files[index], reader, (result) => {
        // Create an img element and add the image file data to it
        const img = document.createElement("img");
        img.src = result;

        // Send this img to the resize function (and wait for callback)
        this.resize(img, 50, 50, (resized_jpeg, before, after) => {
          // For debugging (size in bytes before and after)
          this.debug_size_before.push(before);
          this.debug_size_after.push(after);

          // Add the resized jpeg img source to a list for preview
          // This is also the file you want to upload. (either as a
          // base64 string or img.src = resized_jpeg if you prefer a file).
          this.file_srcs1.push(resized_jpeg);

          // Read the next file;
          //  this.readFiles(files, index+1);
        });
      });
    } else {
      // When all files are done This forces a change detection
      this.changeDetectorRef.detectChanges();
    }
  }
  fileChange(input) {
    this.readFiles(input.files);
  }
  submitForm() {
    errorHanlder.cleanRestValidations(this);
    this.noticiaService
      .guardarNoticia(this.mascota)
      .then(mascota => { this.router.navigate(["/mascotasNews"]), this.mascota.imagen = "", this.mascota.description = undefined, this.ngOnInit(); })
      .catch(error => errorHanlder.procesarValidacionesRest(this, error));
  }
  guardarComentario(mascota, description) {
    if (description == "") {
      mascota.alerta = true;
    }
    else {
      mascota.alerta = false;
      this.comentario.news = mascota._id;
      this.comentario.description = description;
      this.noticiaService
        .guardarComentario(this.comentario)
        .then(comentar => { this.router.navigate(["/mascotasNews"]), this.ngOnInit(); })
        .catch(error => errorHanlder.procesarValidacionesRest(this, error));
    }
  }
}
