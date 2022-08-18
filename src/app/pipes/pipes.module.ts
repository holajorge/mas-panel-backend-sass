import { NgModule } from '@angular/core';
import { FehaLargaPipe } from './feha-larga.pipe';
import { BannersImgPipe } from './banners-img.pipe';
import { VideosPipe } from './videos.pipe';
import {ConvertJsonFotosPipe } from './convert-json.pipe';

@NgModule({
  declarations: [FehaLargaPipe, BannersImgPipe, VideosPipe,ConvertJsonFotosPipe],
  exports: [FehaLargaPipe,BannersImgPipe, VideosPipe,ConvertJsonFotosPipe]
})
export class PipesModule { }
