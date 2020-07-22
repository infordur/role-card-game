import { Component } from '@angular/core';
import { MonsterService } from './_services/monster.service';
import { DeckService } from './_services/deck.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'rol-game';


    constructor() {
        // this.deckService.generateDeck();
    }


}
