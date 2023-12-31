import { NgModule } from '@angular/core';
import { FehaLargaPipe } from './feha-larga.pipe';
import { BannersImgPipe } from './banners-img.pipe';
import { VideosPipe } from './videos.pipe';
import { FotosS3Pipe } from './fotos-s3.pipe';
import {ConvertJsonFotosPipe } from './convert-json.pipe';

@NgModule({
  declarations: [FehaLargaPipe, BannersImgPipe, VideosPipe,ConvertJsonFotosPipe, FotosS3Pipe],
  exports: [FehaLargaPipe,BannersImgPipe, VideosPipe,ConvertJsonFotosPipe, FotosS3Pipe]
})
export class PipesModule { }
