import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AllQuotesComponent } from './all-quotes/all-quotes.component';
import { AllPlaylistsComponent } from './all-playlists/all-playlists.component';

const routes: Routes = [
    { path: 'quotes', component: AllQuotesComponent },
    { path: 'playlists', component: AllPlaylistsComponent },
    {
        path: '',
        redirectTo: '/quotes',
        pathMatch: 'full'
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }