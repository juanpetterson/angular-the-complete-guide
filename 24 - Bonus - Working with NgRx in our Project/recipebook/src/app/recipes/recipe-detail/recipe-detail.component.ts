import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app.reducer';
import * as RecpesActions from '../store/recipes.actions';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        map(params => {
          return +params['id'];
        }),
        switchMap(id => {
          this.id = id;
          return this.store.select('recipes');
        }),
        map(recipesState => {
          return recipesState.recipes.find((recipe, index) => {
            return index === this.id;
          });
        })
      )
      .subscribe(recipe => {
        this.recipe = recipe;
      });
    // this.route.params.subscribe((params: Params) => {
    //   this.id = +params['id'];
    //   // this.recipe = this.recipeService.getRecipe(this.id);
    //   this.store
    //     .select('recipes')
    //     .pipe(
    //       map(recipesState => {
    //         return recipesState.recipes.find((recipe, index) => {
    //           return index === this.id;
    //         });
    //       })
    //     )
    //     .subscribe(recipe => {
    //       this.recipe = recipe;
    //     });
    // });
  }

  onAddToShoppingList(e) {
    e.preventDefault();
    // this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
    this.store.dispatch(
      new ShoppingListActions.AddIngredients(this.recipe.ingredients)
    );
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
    // this.router.navigate(['../', this.id, 'edit'], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    //this.recipesService.deleteRecipe(this.id);
    this.store.dispatch(new RecpesActions.DeleteRecipe(this.id));
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
