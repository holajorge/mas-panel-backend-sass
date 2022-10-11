import { Injectable } from '@angular/core';
declare const PhotoSwipe:any
declare const PhotoSwipeUI_Default:any
@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor() { }

  show(hoja){
    console.log(hoja);
    var pswpElement = document.querySelectorAll('.pswp')[0];
    // define options (if needed)
    console.log(pswpElement);
    var options = {
        // optionName: 'option value'
        // for example:
        index: 0,
        history:false,
        galleryPIDs:false
    };

    // Initializes and opens PhotoSwipe
    var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, [hoja], options);
    gallery.init();

  }
}