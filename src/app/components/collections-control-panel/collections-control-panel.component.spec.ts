import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionsControlPanelComponent } from './collections-control-panel.component';

describe('CollectionsControlPanelComponent', () => {
  let component: CollectionsControlPanelComponent;
  let fixture: ComponentFixture<CollectionsControlPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionsControlPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionsControlPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
