import { Component, OnInit } from '@angular/core';
import { Character } from 'src/app/shared/character';
import { CharacterService } from 'src/app/_services/character.service';
import { Router } from '@angular/router';
import { MonsterService } from '../../_services/monster.service';
import { DeckService } from '../../_services/deck.service';

@Component({
  selector: 'app-choose-character',
  templateUrl: './choose-character.component.html',
  styleUrls: ['./choose-character.component.scss']
})
export class ChooseCharacterComponent implements OnInit {

    characters: Character[] = [];

    selectedCharacter: Character = new Character();

    characterListSubscription;
    selectedCharacterSubscription;

    constructor(private characterService: CharacterService,
        private monsterService: MonsterService,
        private deckService: DeckService,
        private route: Router) { }

    ngOnInit() {
        if(this.characterService.characters[0]) {
            console.log("Cargados");
            this.characters = this.characterService.characters;
        } else {

            console.log("Necesitan cargar");

            this.characterListSubscription = this.characterService.charactersListSubscription.subscribe((response) => {
                this.characters = response;
            });
        }
    }


    selectCharacter(char: Character) {
        this.characterService.selectCharacter(char);
        this.deckService.deleteDeck();
        this.deckService.generateDeck();


        this.route.navigate(['/game']);
    }

}
