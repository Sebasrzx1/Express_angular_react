import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Negocio } from './negocio';

describe('Negocio', () => {
  let component: Negocio;
  let fixture: ComponentFixture<Negocio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Negocio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Negocio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
