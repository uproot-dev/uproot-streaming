import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchFileListComponent } from './watch-file-list.component';

describe('WatchFileListComponent', () => {
  let component: WatchFileListComponent;
  let fixture: ComponentFixture<WatchFileListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WatchFileListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchFileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
