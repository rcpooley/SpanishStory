import {Component} from '@angular/core';
import {CommonService} from "../../services/common.service";
import {Round} from '../../interfaces/interfaces';

interface TextPart {
    text: string;
    bold: boolean;
}

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

    parseText(text: string): TextPart[] {
        let open = text.indexOf('<<');
        let close = text.indexOf('>>');
        if (open >= 0 && close > open) {
            let inside = text.substring(open + 2, close);
            return [
                {
                    text: text.substring(0, open),
                    bold: false
                },
                {
                    text: '(' + inside + ')',
                    bold: true
                },
                {
                    text: text.substring(close + 2),
                    bold: false
                }
            ];
        }
        return [
            {
                text: text,
                bold: false
            }
        ];
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
