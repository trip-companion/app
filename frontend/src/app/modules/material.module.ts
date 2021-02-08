import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

const MATERIAL_MODULES: any = [
	MatSelectModule,
	MatFormFieldModule,
	MatInputModule,
	MatCardModule,
];

@NgModule({
  imports: [ ...MATERIAL_MODULES ],
  exports: [ ...MATERIAL_MODULES ],
})
export class MaterialModule {}
