import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component'
import { AllQuotesComponent } from './all-quotes/all-quotes.component';
import { BackgroundComponent } from './background/background.component';
import { AllPlaylistsComponent } from './all-playlists/all-playlists.component';

const routes: Routes = [
    { path: 'quotes', component: AllQuotesComponent },
    { path: 'playlists', component: AllPlaylistsComponent },
    { path: 'background', component: BackgroundComponent },
    {
        path: '',
        redirectTo: '/quotes',
        pathMatch: 'full'
    },
    /* { path: '**', component: PageNotFoundComponent } */
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }