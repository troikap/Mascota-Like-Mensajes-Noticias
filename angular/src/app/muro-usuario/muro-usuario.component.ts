import { Component, OnInit } from "@angular/core";
import { UsuarioService, Usuario } from "../usuario/usuario.service";


@Component({
  selector: "app-muro-usuario",
  templateUrl: "./muro-usuario.component.html",
  styleUrls: ["./muro-usuario.component.css"]
})
export class MuroUsuarioComponent implements OnInit {
  model: any;
  usuarios: Usuario[];
  resultados: Usuario[];
  constructor(private usuarioService: UsuarioService) {}

  buscarUsuarios() {
    this.usuarioService.buscarUsuario(this.model).then(response => {
      this.resultados = response;
    });
  }

  ngOnInit() {
    this.usuarioService.getUsuarios().then(usuarios => {this.usuarios = usuarios;  });
  }

}
