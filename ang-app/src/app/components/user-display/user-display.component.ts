import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {CommonService} from "../../services/common.service";
import {DataRef} from "datasync-js";
import {Round, Opt} from "../../interfaces/interfaces";

@Component({
    selector: 'user-display',
    templateUrl: 'user-display.component.html',
    styleUrls: ['user-display.component.css']
})
export class UserDisplayComponent implements OnInit {

    private choiceRef: DataRef;
    private choice: number;
    private open: number;
    private close: number;
    private round: Round;

    constructor(private common: CommonService, private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.choiceRef = this.common.getStore('user').ref('/choice');

        this.choiceRef.on('update', (newVal: any) => {
            this.choice = newVal;
        });

        let gameStore = this.common.getStore('game');

        gameStore.ref('/state').on('update', (newVal: any) => {
            if (!newVal) return;
            this.open = newVal.open;
            this.close = newVal.close;

            this.round = gameStore.ref('/round').value(true);
        }, true);

        setInterval(() => {
            this.cdr.detectChanges();
        }, 1000);
    }

    chooseOpt(opt) {
        this.choiceRef.update(this.round.options.indexOf(opt));
    }

    optIndex(opt) {
        return this.round.options.indexOf(opt);
    }

    isVisible() {
        let now = new Date().getTime();
        return now >= this.open && now <= this.close;
    }
}
