import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MascotaService, Mascota } from "../mascota/mascota.service";

@Component({
  selector: "app-muro-mascota-usuario",
  templateUrl: "./muro-mascota-usuario.component.html",
  styleUrls: ["./muro-mascota-usuario.component.css"]
})
export class MuroMascotaUsuarioComponent implements OnInit {
  idusuario: string;
  mascotas: Mascota[];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mascotaService: MascotaService,
  ) {
   }

  ngOnInit() {
    this.route.params.subscribe(params => (this.idusuario = params["idusuario"]));
    this.getMascotas();
  }

  getMascotas() {
    this.mascotaService.buscarMascotaUsuarioSeleccionado(this.idusuario).then(mascotas => {this.mascotas = mascotas; });
  }

  getDetalleMascotas() {
    this.mascotaService.buscarDetalleMascotaUsuarioSeleccionado(this.idusuario).then(mascotas => {this.mascotas = mascotas; });
    console.log(this.mascotas);
  }

  submitLike(petid: string) {
    this.mascotaService.likeMascota(petid, this.idusuario);
    }
  }
