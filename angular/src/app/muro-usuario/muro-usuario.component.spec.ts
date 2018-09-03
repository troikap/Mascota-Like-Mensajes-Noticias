import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MuroUsuarioComponent } from "./muro-usuario.component";

describe("MuroUsuarioComponent", () => {
  let component: MuroUsuarioComponent;
  let fixture: ComponentFixture<MuroUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MuroUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MuroUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
