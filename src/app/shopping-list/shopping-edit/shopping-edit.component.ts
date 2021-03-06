import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducers';

@Component({
  	selector: 'app-shopping-edit',
  	templateUrl: './shopping-edit.component.html',
  	styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
    @ViewChild('f') shoppingListForm: NgForm;
    subscription: Subscription;
    editMode = false;
    editedItem: Ingredient;

  	constructor( private store: Store<fromApp.AppState>) { } // Injects state as service, set type to initial state type

  	ngOnInit() {
      this.subscription = this.store.select('shoppingList')
        .subscribe(
          data => {
            if(data.editedIngredientIndex > -1) {
              this.editedItem = data.editedIngredient;
              this.editMode = true;
              this.shoppingListForm.setValue(
                {
                  name:     this.editedItem.name,
                  amount:   this.editedItem.amount
                }
              )
            } else {
              this.editMode = false;
            }
          }
        );
  	}

  	onSubmit(form: NgForm) {
      const value = form.value;
  		const newIngredient = new Ingredient(value.name, value.amount);
      if (this.editMode) { // edit ingredient
        this.store.dispatch(new ShoppingListActions.UpdateIngredient({ingredient: newIngredient}))
      } else { // create new ingredient
        this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient)); // dispatches action towards reducer to update state
      }
      form.reset();
      this.editMode = false; 
  	}

    onClear() {
      this.shoppingListForm.reset();
      this.editMode = false;
    }

    onDelete() {
      this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    }

    ngOnDestroy() {
      this.store.dispatch(new ShoppingListActions.StopEdit());
      this.subscription.unsubscribe();
    }

}
