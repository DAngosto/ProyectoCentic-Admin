import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsControlPanelComponent } from './statistics-control-panel.component';

describe('StatisticsControlPanelComponent', () => {
  let component: StatisticsControlPanelComponent;
  let fixture: ComponentFixture<StatisticsControlPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticsControlPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsControlPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
