import { MatButtonModule, MatAutocompleteModule, MatInputModule, MatCardModule, MatFormFieldModule, MatIconModule } from '@angular/material';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [
        MatIconModule,
        MatFormFieldModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        MatAutocompleteModule
    ],
    exports: [
        MatIconModule,
        MatFormFieldModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        MatAutocompleteModule
    ],
})
export class SharedMaterialModule { }