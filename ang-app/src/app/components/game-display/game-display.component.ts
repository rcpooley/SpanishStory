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
    private totalVotes: number;

    constructor(private common: CommonService) {
        let gameStore = this.common.getStore('game');
        let ref = gameStore.ref('/round');
        ref.on('update', (newVal: any, path: string) => {
            if (newVal) {
                this.round = ref.value(true);
                this.calcVotes();
            } else {
                this.totalVotes = 0;
            }
        }, true);
    }

    private calcVotes(): void {
        let votes = 0;

        this.round.options.forEach(opt => {
            votes += opt.votes;
        });

        this.totalVotes = votes;
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
