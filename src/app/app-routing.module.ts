import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PopupComponent } from './popup/popup.component';
import { AppComponent } from './app.component'

const routes: Routes = [

    {
        path: 'popup',
        component: PopupComponent
    },
    {
        path: '',
        redirectTo: 'popup', pathMatch: 'full' 
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }