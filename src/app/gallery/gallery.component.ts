import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ImageService } from '../shared/image.service';
import { CategoryService } from '../shared/category.service';
import { Observable } from 'rxjs/Rx';
import { DndModule } from 'ng2-dnd';
import { QRCodeComponent } from 'angular2-qrcode';


@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  title = 'Recent Media Files';
  currentUser = localStorage.getItem('uname');
  // visibleImages: any[] = [];
  totalSessions: any[];
  catones: any[] = [];
  cattwos: any[] = [];
  catthrees: any[] = [];


  constructor(private imageService: ImageService, public router: Router,
    private categoryService: CategoryService) {
    this.categoryService.getRootCategory()
      .subscribe(data => {
        if (data.length) {
          this.catones = data;
        }
      });
  }

  populateSubCategoriesII(id) {
    this.cattwos = [];
    this.catthrees = [];
    this.totalSessions = [];
    if (id) {
      this.categoryService.getSubCategory(id)
        .subscribe(data => {
          if (data) {
            this.cattwos = data.childcategories;
          }
        });
    }
  }

  populateSubCategoriesIII(id) {
    this.catthrees = [];
    this.totalSessions = [];
    if (id) {
      this.categoryService.getSubCategory(id)
        .subscribe(data => {
          if (data) {
            this.catthrees = data.childcategories;
          }
        });
    }
  }

  populateSessions(categoryId) {
    this.totalSessions = [];
    if (categoryId) {
      let category = this.catthrees.find(function (ele) {
        return ele._id === categoryId
      });
      if (category) {
        let categoryname = category.categoryname;
        if (categoryname) {
          this.imageService.getSessions(categoryname)
            .subscribe(data => {
              if (data.sessions.length) {
                this.totalSessions = data.sessions;
              }
            });
        }
      }
    }
  }

  showImage(session) {
    if (session.images) {
      session.images = null;
      return;
    }
    this.imageService.getImages(session.sessionname)
      .subscribe(images => {
        if (images.length) {
          session.images = images;
        }
      });
  }

  dragEnd(images) {
    let items = images;
    for (var index = 0; index < items.length; index++) {
      var element = items[index];
      this.imageService.updateImage(element._id, index)
        .subscribe(data => {
          if (data.success) {
            console.log('Suffeling Successful');
          }
        });
    }

  }

  startSlideShow(session) {
    this.router.navigate(['/slideshow', session.sessionname]);
  }

  /*
  startSlideShow(session) {
    this.api.fsAPI.toggleFullscreen();

    if (session.images) {
      this.visibleImages = session.images;
      this.slideshow();
    } else {
      this.imageService.getImages(session.sessionname)
        .subscribe(images => {
          if (images.length) {
            this.visibleImages = images;
            this.slideshow();
          }
        });
    }
  }*/

  ngOnInit() {
  }

}
