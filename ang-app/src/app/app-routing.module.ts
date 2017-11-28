import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {GameDisplayComponent} from "./components/game-display/game-display.component";
import {UserDisplayComponent} from "./components/user-display/user-display.component";
import {AdminDisplayComponent} from "./components/admin-display/admin-display.component";

const routes: Routes = [
    {path: '', component: UserDisplayComponent},
    {path: 'display', component: GameDisplayComponent},
    {path: 'admin', component: AdminDisplayComponent},
    {path: '**', redirectTo: '/', pathMatch: 'full'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}