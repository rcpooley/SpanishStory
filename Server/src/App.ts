import * as express from 'express';
import * as session from 'express-session';
import * as sharedsession from 'express-socket.io-session';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as cors from 'cors';
import * as SocketIO from 'socket.io';
import * as fs from 'fs';
import {DataStores, DataStoreServer, DataStore, DataSocket} from 'datasync-js';
import Socket = SocketIO.Socket;
import {Game} from "./game";

let config = require('./config.json');

class App {
    public express: express.Application;
    public server: http.Server;
    public stores: DataStores;

    private session: any;
    private gameStore: DataStore;
    private adminStore: DataStore;
    private game: Game;
    private sessions: string[];

    constructor() {
        this.express = express();
        this.stores = new DataStores();
        this.gameStore = this.stores.getStore('game');
        this.adminStore = this.stores.getStore('admin');
        this.game = new Game();
        this.sessions = [];
        this.middleware();
        this.routes();
        this.createServer();
        this.setupSocketIO();
        this.setupAdmin();
    }

    private updateGame() {
        this.gameStore.ref('/round').update(this.game.getRound());
    }

    private middleware(): void {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({extended: false}));
        this.express.use(cors());

        this.session = session({
            secret: config.secret,
            resave: true,
            saveUninitialized: true
        });

        this.express.use(this.session);
    }

    private routes(): void {
        this.express.get('*', function (req, res) {
            var url = req.url.split('?')[0];
            if (url === '/')url += 'index.html';

            if (url == '/admin' || url == '/display') url = '/index.html';

            var path = __dirname + '/public/' + url;
            try {
                fs.accessSync(path, fs.constants.F_OK);
            } catch (e) {
                path = __dirname + '/public/err404.html';
            }

            res.sendFile(path);
        });
    }

    private createServer(): void {
       this.server = http.createServer(this.express);
    }

    private setupSocketIO(): void {
        let io = SocketIO(this.server);

        io.use(sharedsession(this.session, {
            autoSave: true
        }));

        let dsServer = new DataStoreServer((socket: DataSocket, storeid: string, callback: (store: DataStore) => void) => {
            if (storeid == 'user') {
                storeid += socket.object.handshake.sessionID;
                if (this.sessions.indexOf(storeid) == -1) {
                    this.sessions.push(storeid);

                    this.stores.getStore(storeid).ref('/choice').on('updateValue', () => {
                        this.calcVotes();
                    });
                }
            }
            callback(this.stores.getStore(storeid));
        });

        io.on('connect', (socket: Socket) => {
            dsServer.addSocket(DataSocket.fromSocket(socket));
        });
    }

    private setupAdmin(): void {
        this.adminStore.ref('/rounds').update(this.game.rounds);

        this.adminStore.ref('/setround').on('updateValue', (newVal: any) => {
            let round = this.game.getRound();
            if (round) {
                round.closed = false;
            }
            this.game.curRound = newVal;
            this.clearVotes();
        });

        this.adminStore.ref('/closeround').on('updateValue', () => {
            this.game.getRound().closed = true;
            this.updateGame();
        });

        this.adminStore.ref('/nextround').on('updateValue', () => {
            let round = this.game.getRound();
            if (round) {
                round.closed = false;
            }
            this.game.nextRound();
            this.clearVotes();
        });
    }

    private clearVotes(): void {
        this.sessions.forEach(session => {
            this.stores.getStore(session).ref('/choice').update(-1);
        });
        this.calcVotes();
    }

    private calcVotes(): void {
        let round = this.game.getRound();

        let votes = {};
        for (let i = 0; i < round.options.length; i++) {
            votes[i] = 0;
        }

        this.sessions.forEach(session => {
            let choice = this.stores.getStore(session).ref('/choice').value();
            if (choice >= 0) {
                votes[choice]++;
            }
        });

        for (let i = 0; i < round.options.length; i++) {
            round.options[i].votes = votes[i];
        }

        this.updateGame();
    }
}

export default new App();