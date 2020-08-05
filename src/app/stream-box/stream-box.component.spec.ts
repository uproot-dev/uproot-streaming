import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamBoxComponent } from './stream-box.component';

describe('StreamBoxComponent', () => {
  let component: StreamBoxComponent;
  let fixture: ComponentFixture<StreamBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
