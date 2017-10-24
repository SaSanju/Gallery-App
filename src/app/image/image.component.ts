import { Component, OnInit } from '@angular/core';

import { ImageService } from '../shared/image.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {
  title =  'Random Picture of the Day'
	imageUrl: String;

  constructor(private ImageService: ImageService) { }

  ngOnInit() {
  	// this.ImageService.randomImage()
  	// .subscribe(data => {
  	// 	this.imageUrl = data.url;
  	// });
  }

}
