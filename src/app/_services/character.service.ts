import { Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Character } from '../shared/character';
import { StorageMap } from '@ngx-pwa/local-storage';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

    // Characters
    characters: Character[] = [];
    charactersListSubscription = new Subject<any>();

    // Selected Character
    selectedCharacter: any;
    selectedCharacterSubscription = new Subject<any>();


    max_stats: Object = {};
    maxStatusPosibleSubscription = new Subject<any>();

    @Output() EverythingLoaded: Subject<boolean> = new Subject<boolean>();
    @Output() SelectedCharacterLoaded: Subject<boolean> = new Subject<boolean>();


    constructor(public http: HttpClient, private storage: StorageMap) {
        this.getAll();
        this.getSelectedCharacter();
    }

    getAll() {
        this.http.get<Character[]>('assets/data/characters.json').subscribe((res) => {
            this.characters = res;

            this.calculateStats();

            this.charactersListSubscription.next(this.characters);
            this.maxStatusPosibleSubscription.next(this.max_stats);
            this.EverythingLoaded.next(true);
        });
    }


    calculateStats() {
        this.characters.forEach((char) => {
            this.calculateCharMinStats(char);
            this.calculateCharMaxStats(char);
        });

        this.calculatePossibleMaxStats();
    }


    calculatePossibleMaxStats() {
        let str = Math.max.apply(Math, this.characters.map((o) =>  o.max_stats['str']));
        let dex = Math.max.apply(Math, this.characters.map((o) =>  o.max_stats['dex']));
        let hp = Math.max.apply(Math, this.characters.map((o) =>  o.max_stats['hp']));
        let agi = Math.max.apply(Math, this.characters.map((o) =>  o.max_stats['agi']));
        let luk = Math.max.apply(Math, this.characters.map((o) =>  o.max_stats['luk']));

        this.max_stats = {
            str: str,
            agi: agi,
            dex: dex,
            hp: hp,
            luk: luk
        }
    }

    calculateCharMinStats(char: Character) {
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
        char.current_stats = current_stats;
        // char.totalCurrentStats = str+agi+dex+hp+luk;
    }


    calculateCharMaxStats(char: Character) {

        let maxstr = char.maxlevel * (char.base_stats['str'] + char.stats_mult['str']);
        let maxagi = char.maxlevel * (char.base_stats['agi'] + char.stats_mult['agi']);
        let maxdex = char.maxlevel * (char.base_stats['dex'] + char.stats_mult['dex']);
        let maxhp = char.maxlevel * (char.base_stats['hp'] + char.stats_mult['hp']);
        let maxluk = char.maxlevel * (char.base_stats['luk'] + char.stats_mult['luk']);

        let max_stats = {
            str: maxstr,
            agi: maxagi,
            dex: maxdex,
            hp: maxhp,
            luk: maxluk
        }

        char.max_stats = max_stats;
    }




    getSelectedCharacter() {
        this.storage.get<Character>('selectedChar').subscribe((res) => {
            if(res != undefined) {
                this.selectedCharacter = res;
                this.selectedCharacterSubscription.next(this.selectedCharacter);
                this.SelectedCharacterLoaded.next(true);
            }
        });
    }

    selectCharacter(char: Character) {
        this.clearSelectedCharacter();
        this.storage.set('selectedChar', char).subscribe(() => {
            this.selectedCharacter = char;
            this.selectedCharacterSubscription.next(this.selectedCharacter);
            this.SelectedCharacterLoaded.next(true);
        });
    }


    clearSelectedCharacter() {
        this.storage.delete('selectedChar').subscribe(() => {});
    }
}
