import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllStatisticsCollectionComponent } from './all-statistics-collection.component';

describe('AllStatisticsCollectionComponent', () => {
  let component: AllStatisticsCollectionComponent;
  let fixture: ComponentFixture<AllStatisticsCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllStatisticsCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllStatisticsCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
