import {Component, OnInit} from '@angular/core';
import {CommonService} from "../../services/common.service";
import {Round} from '../../interfaces/interfaces';
import {DataStore} from "datasync-js";

@Component({
    selector: 'admin-display',
    templateUrl: 'admin-display.component.html',
    styleUrls: ['admin-display.component.css']
})
export class AdminDisplayComponent implements OnInit {

    private store: DataStore;
    private rounds: {[id: string]: Round};

    constructor(private common: CommonService) {
    }

    ngOnInit(): void {
        this.store = this.common.getStore('admin');
        this.store.ref('/rounds').on('update', () => {
            this.rounds = this.store.ref('/rounds').value(true);
        }, true);
    }

    genKeys(obj) {
        return Object.keys(obj);
    }

    setRound(roundID: string) {
        this.store.ref('/setround').update(roundID);
    }
}
