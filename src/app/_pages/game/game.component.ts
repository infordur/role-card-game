import { Component, OnInit } from '@angular/core';
import { Character } from 'src/app/shared/character';
import { CharacterService } from '../../_services/character.service';
import { MonsterService } from '../../_services/monster.service';
import { Monster } from '../../shared/monster';
import { DeckService } from '../../_services/deck.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {


    // Character
    selectedCharacter: Character = new Character();
    selectedCharacterSubscription;


    totalCurrentStats: number = 0;

    showCharacterStats = {};
    character_max_stats = {};


    // Monsters
    deck: Monster[] = [];
    deckMonsterCementery: Monster[] = [];

    monsterListSubscription;
    noOfMonstersLoaded = 0;
    noOfLoadedProductsSubscription
    monsterToFight: Monster;

    showMonsterStats = {};
    monster_max_stats = {};


    // Play
    blockDraw: boolean = false;

    constructor(private characterService: CharacterService, private monstersService: MonsterService, private deckService: DeckService) { }

    ngOnInit() {
        // Desde la lista
        if (this.characterService.selectedCharacter != undefined) {
            const selectedCharacter = this.characterService.selectedCharacter;
            this.selectedCharacter = selectedCharacter;
        } else { // Directamente del enlace
            this.initializeCharacter();
        }

        // Load Monster Deck
        if(this.deckService.deck[0]){
            this.deck = this.deckService.deck;
            this.drawMonsterCard();
        } else {
            this.initializeDeck();
        }

        // Define max status possible for Monsters
        this.monstersService.maxStatusPosibleSubscription.subscribe(res => {
            this.monster_max_stats = res;
            if(this.monsterToFight.level > 1) {
                this.showMonsterStats = this.monsterToFight.base_stats;
            } else {
                this.generateRandomShowMonsterStats();
            }
        });


        setTimeout(() => {
            this.calculateCharacterCurrentStats();
            this.calculateMonsterCurrentStats();
        }, 500);
    }

    initializeDeck() {
        this.deckService.deckListChanged.subscribe(res => {
            this.deck = res;
            this.drawMonsterCard();
            // console.log("---------- DECK ----------");
            // console.log(this.deck);
        });
    }


    initializeCharacter() {
        this.characterService.SelectedCharacterLoaded.subscribe(res => {
            const selectedCharacter = this.characterService.selectedCharacter;
            this.selectedCharacter = selectedCharacter;
        });

        this.characterService.maxStatusPosibleSubscription.subscribe(res => {
            this.character_max_stats = res;
            if(this.selectedCharacter.level > 1) {
                this.showCharacterStats = this.selectedCharacter.base_stats;
            } else {
                this.generateRandomShowCharacterStats();
            }
        });

    }

    // Character
    loadCharacter() {
        if(this.characterService.selectedCharacter != undefined) {
            console.log("Actually loaded");
            this.selectedCharacter = this.characterService.selectedCharacter;
        } else {
            console.log("Need to load");
            // this.characterService.getSelectedCharacter();
            this.selectedCharacterSubscription = this.characterService.selectedCharacterSubscription.subscribe((response) => {
                this.selectedCharacter = response;
            });
        }
    }


    calculateCharacterCurrentStats() {
        let char = this.selectedCharacter;

        let str = char.level * (char.base_stats['str'] + char.stats_mult['str']);
        let agi = char.level * (char.base_stats['agi'] + char.stats_mult['agi']);
        let dex = char.level * (char.base_stats['dex'] + char.stats_mult['dex']);
        let hp = char.level * (char.base_stats['hp'] + char.stats_mult['hp']);
        let luk = char.level * (char.base_stats['luk'] + char.stats_mult['luk']);

        let current_stats = {
            str: str,
            agi: agi,
            dex: dex,
            hp: hp,
            luk: luk
        }
        this.showCharacterStats = current_stats;
        this.totalCurrentStats = str+agi+dex+hp+luk;
    }


    generateRandomShowCharacterStats() {
        let char = this.selectedCharacter;

        let maxstr = char.current_stats['str'] + Math.floor(Math.random() * char.max_stats['str']) + 1;
        let maxagi = char.current_stats['agi'] + Math.floor(Math.random() * char.max_stats['agi']) + 1;
        let maxdex = char.current_stats['dex'] + Math.floor(Math.random() * char.max_stats['dex']) + 1;
        let maxhp = char.current_stats['hp'] + Math.floor(Math.random() * char.max_stats['hp']) + 1;
        let maxluk = char.current_stats['luk'] + Math.floor(Math.random() * char.max_stats['luk']) + 1;

        let random_stats = {
            str: maxstr,
            agi: maxagi,
            dex: maxdex,
            hp: maxhp,
            luk: maxluk
        }

        this.showCharacterStats = random_stats;
    }

    calculateCharacterMaxStats() {
        let char = this.selectedCharacter;
        this.showCharacterStats = char.max_stats;
    }


    // #########################
    // Play
    // #########################
    play() {
        let charLevel = this.selectedCharacter.level;
        if(charLevel >= this.monsterToFight.level) {
            this.selectedCharacter.level = charLevel + 1;
        } else {
            this.selectedCharacter.level = charLevel - 1;
        }
    }

    checkWinLoose() {
        if(this.selectedCharacter.level <= 0) {
            this.blockDraw = true;
        } else {
            this.blockDraw = false;
        }
    }

    // #########################
    // Monsters
    // #########################
    drawMonsterCard() {
        if(this.deck.length > 1) {
            this.monsterToFight = this.deck.pop();


        } else {
            console.log("No hay más monstruos");
        }



    }


    calculateMonsterCurrentStats() {
        let monster = this.monsterToFight;

        let str = monster.level * (monster.base_stats['str'] + monster.stats_mult['str']);
        let agi = monster.level * (monster.base_stats['agi'] + monster.stats_mult['agi']);
        let dex = monster.level * (monster.base_stats['dex'] + monster.stats_mult['dex']);
        let hp = monster.level * (monster.base_stats['hp'] + monster.stats_mult['hp']);
        let luk = monster.level * (monster.base_stats['luk'] + monster.stats_mult['luk']);

        let current_stats = {
            str: str,
            agi: agi,
            dex: dex,
            hp: hp,
            luk: luk
        }
        this.showMonsterStats = current_stats;
    }


    generateRandomShowMonsterStats() {
        let monster = this.monsterToFight;

        let maxstr = monster.current_stats['str'] + Math.floor(Math.random() * monster.max_stats['str']) + 1;
        let maxagi = monster.current_stats['agi'] + Math.floor(Math.random() * monster.max_stats['agi']) + 1;
        let maxdex = monster.current_stats['dex'] + Math.floor(Math.random() * monster.max_stats['dex']) + 1;
        let maxhp = monster.current_stats['hp'] + Math.floor(Math.random() * monster.max_stats['hp']) + 1;
        let maxluk = monster.current_stats['luk'] + Math.floor(Math.random() * monster.max_stats['luk']) + 1;

        let random_stats = {
            str: maxstr,
            agi: maxagi,
            dex: maxdex,
            hp: maxhp,
            luk: maxluk
        }

        this.showMonsterStats = random_stats;
    }

    calculateMonsterMaxStats() {
        let monster = this.monsterToFight;
        this.showMonsterStats = monster.max_stats;
    }



    // loadMonsters() {
    //     if (this.monstersService.monsters[0]) { // List already loaded
    //         this.deck = this.monstersService.monsters;
    //         this.noOfMonstersLoaded = this.monstersService.noOfMonstersLoaded;
    //         this.deck = this.deckService.shuffleArray(this.deck);
    //     } else { // List not already Loaded
    //         this.monsterListSubscription = this.monstersService.monstersListSubscription.subscribe(
    //             (response) => {
    //                 this.deck = response.slice(0, this.noOfMonstersLoaded);
    //                 this.deck = this.deckService.shuffleArray(this.deck);
    //             }
    //         );
    //         this.noOfLoadedProductsSubscription = this.monstersService.newMonstersLoaded.subscribe(
    //             (response) => {
    //                 this.noOfMonstersLoaded = response;
    //             }
    //         );
    //     }
    // }




}
