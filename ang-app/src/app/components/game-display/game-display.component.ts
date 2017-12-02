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

    getLetter(opt) {
        return 'ABCDEFG'.charAt(this.optIndex(opt));
    }

    optIndex(opt) {
        return this.round.options.indexOf(opt);
    }

    closeRound() {
        this.common.getStore('admin').ref('/closeround').update(1);
    }

    nextRound() {
        this.common.getStore('admin').ref('/nextround').update(1);
    }
}
