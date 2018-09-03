// import { ModuleWithProviders } from "@angular/core";
// import { Routes, RouterModule } from "@angular/router";

import { WelcomeComponent } from "./welcome/welcome.component";
import { NuevaMascotaComponent } from "./mascota/nueva-mascota.component";
import { MascotaComponent } from "./mascota/mascota.component";
import { PerfilComponent } from "./perfil/perfil.component";
import { RegistrarUsuarioComponent } from "./usuario/registrar-usuario.component";
import { MensajeriaComponent } from "./mensajeria/mensajeria.component";
import { UserAuthGuard } from "./mensajeria/mensajeria.guard";

import { MuroUsuarioComponent } from "./muro-usuario/muro-usuario.component";
import { Injectable, ModuleWithProviders } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterModule, RouterStateSnapshot, Routes } from "@angular/router";
import { UsuarioService } from "./usuario/usuario.service";
import { MascotaUsuarioComponent } from "./mascota-usuario/mascota-usuario.component";
import { MascotasNewsComponent } from "./noticias/news-mascota.component";


@Injectable()
export class LoggedIn implements CanActivate {
    constructor(private router: Router, private auth: UsuarioService) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        if (this.auth.usuarioLogueado) {
            return true;
        } else {
            this.router.navigate(["/"]);
            return false;
        }
    }
}



// Route Configuration
export const routes: Routes = [
  { path: "", component: WelcomeComponent },
  { path: "perfilUsuario", component: PerfilComponent, canActivate: [LoggedIn]  },
  { path: "registrarUsuario", component: RegistrarUsuarioComponent },
  { path: "mascotas", component: MascotaComponent , canActivate: [LoggedIn]},
  { path: "nuevaMascota/:id", component: NuevaMascotaComponent , canActivate: [LoggedIn] },
  { path: "nuevaMascota", component: NuevaMascotaComponent , canActivate: [LoggedIn] },
  // rutas de mensajería
  { path: "mensajeria", component: MensajeriaComponent, canActivate: [UserAuthGuard] },
  // rutas de like
  { path: "muro-usuario", component: MuroUsuarioComponent, canActivate: [LoggedIn] },
  { path: "usuario/:usuarioId", component: MascotaUsuarioComponent, canActivate: [LoggedIn] },
  { path: "muro-usuario/:usuarioId", component: MascotaUsuarioComponent, canActivate: [LoggedIn] },
  { path: "nuevoLike", component: MascotaUsuarioComponent, canActivate: [LoggedIn]},
  // rutas de noticias
  { path: "mascotasNews", component: MascotasNewsComponent, canActivate: [LoggedIn] }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);

