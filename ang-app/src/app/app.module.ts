import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './components/app/app.component';
import {CommonService} from "./services/common.service";
import {GameDisplayComponent} from "./components/game-display/game-display.component";
import {UserDisplayComponent} from "./components/user-display/user-display.component";
import {AppRoutingModule} from "./app-routing.module";
import {AdminDisplayComponent} from "./components/admin-display/admin-display.component";

@NgModule({
    declarations: [
        AppComponent,
        UserDisplayComponent,
        GameDisplayComponent,
        AdminDisplayComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    providers: [CommonService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
