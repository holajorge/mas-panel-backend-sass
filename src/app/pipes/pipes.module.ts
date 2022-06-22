import { NgModule } from '@angular/core';
import { FehaLargaPipe } from './feha-larga.pipe';
import { BannersImgPipe } from './banners-img.pipe';
import { VideosPipe } from './videos.pipe';

@NgModule({
  declarations: [FehaLargaPipe, BannersImgPipe, VideosPipe],
  exports: [FehaLargaPipe,BannersImgPipe, VideosPipe]
})
export class PipesModule { }
