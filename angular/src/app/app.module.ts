import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { APP_BASE_HREF } from "@angular/common";
// import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

// import { routing } from "./app.routes";
import { AppComponent } from "./app.component";
import { WelcomeComponent } from "./welcome/welcome.component";
import { UsuarioService } from "./usuario/usuario.service";
import { ProvinciaService } from "./provincia/provincia.service";
import { PerfilService } from "./perfil/perfil.service";
import { PerfilComponent } from "./perfil/perfil.component";
import { MascotaComponent } from "./mascota/mascota.component";
import { MenuComponent } from "./menu/menu.component";
import { NuevaMascotaComponent } from "./mascota/nueva-mascota.component";
import { MascotaService } from "./mascota/mascota.service";
import { environment } from "../environments/environment";
import { RegistrarUsuarioComponent } from "./usuario/registrar-usuario.component";
import { NgDatepickerModule } from "ng2-datepicker";
import { FileUploadComponent } from "./tools/image.base64";
import { NoticiaService } from "./noticias/noticia.service";

// Dependencias
// Dependencias de mensajería
import { BuscarComponent } from "./mensajeria/buscar.component";
import { ConversacionesComponent } from "./mensajeria/conversaciones.component";
import { MensajeriaComponent } from "./mensajeria/mensajeria.component";
import { MensajesComponent } from "./mensajeria/mensajes.component";
import { ConversacionService } from "./mensajeria/conversaciones.service";
import { MensajeService } from "./mensajeria/mensaje.service";
import { UserAuthGuard } from "./mensajeria/mensajeria.guard";
import { MuroUsuarioComponent } from "./muro-usuario/muro-usuario.component";
import { MuroMascotaUsuarioComponent } from "./muro-mascota-usuario/muro-mascota-usuario.component";
import { VistaMascotaComponent } from "./vista-mascota/vista-mascota.component";
import { MascotaUsuarioComponent } from "./mascota-usuario/mascota-usuario.component";
import { LoggedIn, routing } from "./app.routes";
import { MascotaUsuarioService } from "./mascota-usuario/mascota-usuario.service";
import { MascotasNewsComponent } from "./noticias/news-mascota.component";


@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    PerfilComponent,
    MascotaComponent,
    MenuComponent,
    NuevaMascotaComponent,
    RegistrarUsuarioComponent,
    FileUploadComponent,
    // TP Node Dependencies
    BuscarComponent,
    ConversacionesComponent,
    MensajeriaComponent,
    MensajesComponent,
    MuroUsuarioComponent,
    MuroMascotaUsuarioComponent,
    VistaMascotaComponent,
    MascotaUsuarioComponent,
    MascotasNewsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    NgDatepickerModule,
    routing,
  //  NgbModule.forRoot()
  ],
  providers: [
    MascotaService,
    UsuarioService,
    ProvinciaService,
    PerfilService,
    // conversacion
    ConversacionService,
    MensajeService,
    LoggedIn,
    // guarda de mensajería
    UserAuthGuard,
    MascotaUsuarioService,
    NoticiaService,
    /* Los providers son @Inyectable, la siguiente es una forma de definit un
     provider con un valor constante para poder inyectarlo*/
    { provide: APP_BASE_HREF, useValue: environment.baseHref }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
