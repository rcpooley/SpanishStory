import {Injectable} from "@angular/core";
import * as io from 'socket.io-client';
import Socket = SocketIOClient.Socket;
import {DataStores, DataStoreServer, DataStore, DataSocket} from 'datasync-js';

@Injectable()
export class CommonService {
    private url = 'http://ejemplosactuales.com';
    private socket: Socket;
    private stores: DataStores;
    private storeServer: DataStoreServer;

    constructor() {
        this.socket = io(this.url);
        this.stores = new DataStores();
        this.storeServer = new DataStoreServer((socket: DataSocket, storeid: string, callback: (store: DataStore) => void) => {
            callback(this.stores.getStore(storeid));
        });
        this.socket.on('connect', () => {
            let dataSocket = DataSocket.fromSocket(this.socket);
            this.storeServer.addSocket(dataSocket);
            this.storeServer.bindStore(dataSocket, 'game');
            this.storeServer.bindStore(dataSocket, 'user');
            this.storeServer.bindStore(dataSocket, 'admin');
        });
    }

    public getStore(storeid: string): DataStore {
        return this.stores.getStore(storeid);
    }
}