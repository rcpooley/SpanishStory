import {Component} from '@angular/core';
import {CommonService} from "../../services/common.service";
import {Round} from '../../interfaces/interfaces';

@Component({
    selector: 'game-display',
    templateUrl: 'game-display.component.html',
    styleUrls: ['game-display.component.css']
})
export class GameDisplayComponent {

    private round: Round;

    constructor(private common: CommonService) {
        let gameStore = this.common.getStore('game');
        let ref = gameStore.ref('/round');
        ref.on('update', (newVal: any, path: string) => {
            if (newVal) {
                this.round = ref.value(true);
            }
        }, true);
    }

    nextRound() {
        this.common.getStore('admin').ref('/nextround').update(1);
    }
}
