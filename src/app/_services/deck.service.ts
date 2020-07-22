import { Injectable } from '@angular/core';
import { Monster } from '../shared/monster';
import { MonsterService } from './monster.service';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeckService {

    // Deck
    deck: any = [];
    newDeckLoaded = new Subject<number>();
    deckListChanged = new Subject<Monster[]>();
    noOfMonstersInDeckLoaded = 0;


    // Monsters
    monsterListSubscription;
    noOfMonstersLoaded = 0;
    noOfLoadedMonstersSubscription
    monsterToFight: Monster;

    constructor(private monstersService: MonsterService, private storage: StorageMap) {
        // this.generateDeck();
        this.getDeck();
    }


    getDeck() {
        this.storage.get<Monster[]>('deckToPlay').subscribe((res) => {
            if(res != undefined) {
                this.deck = res;
            } else {
                this.deck = [];
            }
            this.newDeckLoaded.next(this.deck.length+1);
            this.deckListChanged.next(this.deck);
        });
    }


    generateDeck() {
        if(this.monstersService.monsters[0]) { // List already loaded
            let monsters = this.monstersService.monsters;
            this.noOfMonstersLoaded = this.monstersService.noOfMonstersLoaded;

            monsters = this.shuffleArray(monsters); // Randomize deck
            this.deck = monsters;
            this.saveDeck();
        } else {
            this.monsterListSubscription = this.monstersService.monstersListSubscription.subscribe(
                (response) => {
                    let deck = response.slice(0, this.noOfMonstersLoaded);
                    deck = this.shuffleArray(deck);

                    this.monstersService.calculateStats();


                    this.deck = deck;

                    console.log(this.deck);
                    this.saveDeck();
                }
            )
        }
    }

    deleteDeck() {
        this.storage.delete('deckToPlay').subscribe(() => {
            this.deck = [];
            this.newDeckLoaded.next(this.deck.length+1);
            this.deckListChanged.next(this.deck);
        });
    }


    saveDeck() {
        this.storage.set('deckToPlay', this.deck).subscribe(() => {
            this.newDeckLoaded.next(this.deck.length+1);
            this.deckListChanged.next(this.deck);
        });
    }


    shuffleArray(array: Monster[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

}
