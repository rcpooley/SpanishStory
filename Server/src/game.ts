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
    closed: boolean;
    correctOpt: number;

    constructor(id: string, json: any) {
        this.id = id;
        this.prompt = json.prompt;
        this.options = [];
        this.nextRound = json.next;
        this.correctOpt = -1;
        if (json.opts) {
            let opts = JSON.parse(JSON.stringify(json.opts)).map(opt => new Opt(opt));
            if (this.nextRound) {
                opts[0].correct = true;
            }
            while (opts.length > 0) {
                let opt = opts.splice(Math.floor(Math.random() * opts.length), 1)[0];
                if (opt.correct) {
                    this.correctOpt = this.options.length;
                }
                this.options.push(opt);
            }
        }
        this.closed = false;
    }
}

export class Game {
    curRound: string;
    rounds: {[id: string]: Round};

    constructor() {
        this.rounds = {};
        Object.keys(data.rounds).forEach(roundId => {
            this.rounds[roundId] = new Round(roundId, data.rounds[roundId]);
        });
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
    }

    getRound(): Round {
        return this.curRound ? this.rounds[this.curRound] : null;
    }
}