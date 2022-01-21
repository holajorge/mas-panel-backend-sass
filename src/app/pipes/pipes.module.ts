import { NgModule } from '@angular/core';
import { FehaLargaPipe } from './feha-larga.pipe';
import { BannersImgPipe } from './banners-img.pipe';

@NgModule({
  declarations: [FehaLargaPipe, BannersImgPipe],
  exports: [FehaLargaPipe,BannersImgPipe]
})
export class PipesModule { }
