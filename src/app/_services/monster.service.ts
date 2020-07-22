import { Injectable, Output } from '@angular/core';
import { Monster } from '../shared/monster';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StorageMap } from '@ngx-pwa/local-storage';

@Injectable({
  providedIn: 'root'
})
export class MonsterService {

    monsters: Monster[] = [];
    noOfMonstersLoaded = 0;
    newMonstersLoaded = new Subject<number>();

    monstersListSubscription = new Subject<any>();

    max_stats: Object = {};
    maxStatusPosibleSubscription = new Subject<any>();

    @Output() EverythingLoaded: Subject<boolean> = new Subject<boolean>();

    constructor(public http: HttpClient, private storage: StorageMap) {
        this.getAll();
    }

    getAll() {
        this.http.get<Monster[]>('assets/data/monsters.json').subscribe((res) => {
            this.monsters = res;

            this.calculateStats();

            this.newMonstersLoaded.next(this.monsters.length+1);
            this.monstersListSubscription.next(this.monsters);
            this.maxStatusPosibleSubscription.next(this.max_stats);
            this.EverythingLoaded.next(true);
        });
    }


    calculateStats() {
        this.monsters.forEach((monster) => {
            this.calculateMinStats(monster);
            this.calculateMaxStats(monster);
        });
        this.calculatePossibleMaxStats();
    }


    calculatePossibleMaxStats() {
        let str = Math.max.apply(Math, this.monsters.map((o) =>  o.max_stats['str']));
        let dex = Math.max.apply(Math, this.monsters.map((o) =>  o.max_stats['dex']));
        let hp = Math.max.apply(Math, this.monsters.map((o) =>  o.max_stats['hp']));
        let agi = Math.max.apply(Math, this.monsters.map((o) =>  o.max_stats['agi']));
        let luk = Math.max.apply(Math, this.monsters.map((o) =>  o.max_stats['luk']));

        this.max_stats = {
            str: str,
            agi: agi,
            dex: dex,
            hp: hp,
            luk: luk
        }
    }

    calculateMinStats(monster: Monster) {
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
        monster.current_stats = current_stats;
    }


    calculateMaxStats(monster: Monster) {

        let maxstr = monster.maxlevel * (monster.base_stats['str'] + monster.stats_mult['str']);
        let maxagi = monster.maxlevel * (monster.base_stats['agi'] + monster.stats_mult['agi']);
        let maxdex = monster.maxlevel * (monster.base_stats['dex'] + monster.stats_mult['dex']);
        let maxhp = monster.maxlevel * (monster.base_stats['hp'] + monster.stats_mult['hp']);
        let maxluk = monster.maxlevel * (monster.base_stats['luk'] + monster.stats_mult['luk']);

        let max_stats = {
            str: maxstr,
            agi: maxagi,
            dex: maxdex,
            hp: maxhp,
            luk: maxluk
        }

        monster.max_stats = max_stats;
    }

}
