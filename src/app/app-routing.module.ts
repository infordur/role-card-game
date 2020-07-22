import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent } from './_pages/game/game.component';
import { ChooseCharacterComponent } from './_pages/choose-character/choose-character.component';


const routes: Routes = [
    {
        path: '',
        component: ChooseCharacterComponent
    },
    {
        path: 'game',
        component: GameComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
