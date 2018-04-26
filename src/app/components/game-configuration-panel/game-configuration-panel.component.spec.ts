import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameConfigurationPanelComponent } from './game-configuration-panel.component';

describe('GameConfigurationPanelComponent', () => {
  let component: GameConfigurationPanelComponent;
  let fixture: ComponentFixture<GameConfigurationPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameConfigurationPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameConfigurationPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
