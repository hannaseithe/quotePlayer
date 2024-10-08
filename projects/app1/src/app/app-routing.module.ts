import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PopupComponent } from './popup/popup.component';

const routes: Routes = [

    {
        path: 'popup',
        component: PopupComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }