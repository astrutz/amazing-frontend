import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMarkerComponent } from './create-marker.component';

describe('CreateComponent', () => {
  let component: CreateMarkerComponent;
  let fixture: ComponentFixture<CreateMarkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMarkerComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CreateMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
