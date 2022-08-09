import { NgModule } from '@angular/core';
import { FehaLargaPipe } from './feha-larga.pipe';
import { BannersImgPipe } from './banners-img.pipe';
import { VideosPipe } from './videos.pipe';
import { FotosS3Pipe } from './fotos-s3.pipe';

@NgModule({
  declarations: [FehaLargaPipe, BannersImgPipe, VideosPipe, FotosS3Pipe],
  exports: [FehaLargaPipe,BannersImgPipe, VideosPipe, FotosS3Pipe]
})
export class PipesModule { }
