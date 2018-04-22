import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsControlPanelComponent } from './cards-control-panel.component';

describe('CardsControlPanelComponent', () => {
  let component: CardsControlPanelComponent;
  let fixture: ComponentFixture<CardsControlPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardsControlPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsControlPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
