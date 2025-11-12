import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PalleteVisualizer } from './pallete-visualizer';

describe('PalleteVisualizer', () => {
  let component: PalleteVisualizer;
  let fixture: ComponentFixture<PalleteVisualizer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PalleteVisualizer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PalleteVisualizer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
