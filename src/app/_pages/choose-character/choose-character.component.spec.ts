import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseCharacterComponent } from './choose-character.component';

describe('ChooseCharacterComponent', () => {
  let component: ChooseCharacterComponent;
  let fixture: ComponentFixture<ChooseCharacterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseCharacterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseCharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
