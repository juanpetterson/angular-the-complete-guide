import { Component, OnInit, Output, EventEmitter } from "@angular/core";

import { Recipe } from "../recipe.model";

@Component({
  selector: "app-recipe-list",
  templateUrl: "./recipe-list.component.html",
  styleUrls: ["./recipe-list.component.css"]
})
export class RecipeListComponent implements OnInit {
  @Output() recipeSelected = new EventEmitter<Recipe>();

  recipes: Recipe[] = [
    new Recipe(
      "A test recipe",
      "This is simply a test",
      "https://cdn.apartmenttherapy.info/image/upload/f_auto,q_auto:eco,c_fit,w_760,h_950/k%2FPhoto%2FRecipes%2F2019-08-how-to-juiciest-turkey-meatballs%2FHow-to-Make-the-Best-Juiciest-Turkey-Meatballs_055"
    ),
    new Recipe(
      "Another recipe",
      "This is simply a test",
      "https://cdn.apartmenttherapy.info/image/upload/f_auto,q_auto:eco,c_fit,w_760,h_950/k%2FPhoto%2FRecipes%2F2019-08-how-to-juiciest-turkey-meatballs%2FHow-to-Make-the-Best-Juiciest-Turkey-Meatballs_055"
    )
  ];

  constructor() {}

  ngOnInit() {}

  onRecipeSelected(recipe: Recipe) {
    this.recipeSelected.emit(recipe);
  }
}
