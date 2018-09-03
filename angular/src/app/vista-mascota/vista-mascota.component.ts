import { Component, OnInit, Input } from "@angular/core";
import { Mascota } from "../mascota/mascota.service";

@Component({
  selector: "vista-mascota",
  templateUrl: "./vista-mascota.component.html",
  styleUrls: ["./vista-mascota.component.css"]
})
export class VistaMascotaComponent implements OnInit {
  @Input() mascota: Mascota;
  constructor() { }

  ngOnInit() {
  }

}