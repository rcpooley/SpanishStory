import {Lib} from "./Lib";
const data = require('./../gamedata.json');

class Opt {
    text: string;
    nextRound?: string;
    votes: number;

    constructor(json: any) {
        this.votes = 0;
        if (typeof json == 'object') {
            this.text = json.text;
            this.nextRound = json.next;
        } else {
            this.text = json;
        }
    }
}

class Round {
    id: string;
    prompt: string;
    options: Opt[];
    nextRound?: string;

    constructor(id: string, json: any) {
        this.id = id;
        this.prompt = json.prompt;
        this.options = [];
        if (json.opts) {
            json.opts.forEach(json => {
                this.options.push(new Opt(json));
            });
        }
        this.nextRound = json.next;
    }
}

export interface State {
    open: number;
    close: number;
}

export class Game {
    curRound: string;
    rounds: {[id: string]: Round};
    state: State;

    constructor() {
        this.rounds = {};
        Object.keys(data.rounds).forEach(roundId => {
            this.rounds[roundId] = new Round(roundId, data.rounds[roundId]);
        });
    }

    startRound() {
        let now = Lib.now();
        this.state = {
            open: now,
            close: now + data.settings.roundtime
        };
    }

    nextRound() {
        let round = this.getRound();

        if (round.nextRound) {
            this.curRound = round.nextRound;
            return;
        }

        let highVotes = -1;
        let nextRound = 'error';

        round.options.forEach(opt => {
            if (opt.votes > highVotes) {
                highVotes = opt.votes;
                nextRound = opt.nextRound;
            }
        });

        this.curRound = nextRound;
        this.startRound();
    }

    getRound(): Round {
        return this.curRound ? this.rounds[this.curRound] : null;
    }
}