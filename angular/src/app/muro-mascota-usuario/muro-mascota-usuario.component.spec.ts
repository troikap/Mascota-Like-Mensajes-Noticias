import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MuroMascotaUsuarioComponent } from "./muro-mascota-usuario.component";

describe("MuroMascotaUsuarioComponent", () => {
  let component: MuroMascotaUsuarioComponent;
  let fixture: ComponentFixture<MuroMascotaUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MuroMascotaUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MuroMascotaUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
