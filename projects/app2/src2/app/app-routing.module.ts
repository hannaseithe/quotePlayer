import { NgModule, Injectable } from '@angular/core';
import { RouterModule, Routes, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AllQuotesComponent } from './all-quotes/all-quotes.component';
import { AllPlaylistsComponent } from './all-playlists/all-playlists.component';
import { GeneralInfoComponent } from './info/general-info/general-info.component';
import { Observable } from 'rxjs';



@Injectable()
export class CanDeactivateDocGuard implements CanDeactivate<GeneralInfoComponent> {

  canDeactivate(
    component: GeneralInfoComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    // you can just return true or false synchronously
    if (component.internallyScrolled === true) {
        component.scrollBack();
        return false;
    } else {
      return true;
    }

  }
}

const routes: Routes = [
    { path: 'quotes', component: AllQuotesComponent },
    { path: 'playlists', component: AllPlaylistsComponent },
    { path: 'documentation/:sub', component: GeneralInfoComponent, canDeactivate: [CanDeactivateDocGuard]},
    { path: 'documentation', component: GeneralInfoComponent, canDeactivate: [CanDeactivateDocGuard]},
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

