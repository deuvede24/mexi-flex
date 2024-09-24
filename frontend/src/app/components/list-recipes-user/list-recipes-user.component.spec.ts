import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRecipesUserComponent } from './list-recipes-user.component';

describe('ListRecipesUserComponent', () => {
  let component: ListRecipesUserComponent;
  let fixture: ComponentFixture<ListRecipesUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListRecipesUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListRecipesUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
