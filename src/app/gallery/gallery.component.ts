import { Component, OnInit } from '@angular/core';

import { ImageService } from '../shared/image.service';
import { CategoryService } from '../shared/category.service';
import { Observable } from 'rxjs/Rx';
import { VgAPI } from 'videogular2/core';
import { DndModule } from 'ng2-dnd';


@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  title = 'Recent Media Files';
  currentUser = localStorage.getItem('uname');
  visibleImages: any[] = [];
  totalSessions: any[];
  currentIndex = 0;
  imageSlideTime: Number = 2000;
  imageTitle: String;
  vPlayer = true;
  catones: any[] = [];
  cattwos: any[] = [];
  catthrees: any[] = [];

  public times = [
    { value: 2000, display: '2 Sec' },
    { value: 4000, display: '4 Sec' },
    { value: 6000, display: '6 Sec' }
  ];

  constructor(private imageService: ImageService, public api: VgAPI,
    private categoryService: CategoryService) {
    this.categoryService.getRootCategory()
      .subscribe(data => {
        if (data.length) {
          this.catones = data;
        }
      });
    // this.imageService.getSessions()
    //   .subscribe(data => {
    //     if (data.sessions.length) {
    //       this.totalSessions = data.sessions;
    //     }
    //   });
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
      console.log(category)
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


  onPlayerReady(api: VgAPI) {
    this.api = api;
  }

  showImage(session) {
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
  }

  slideshow() {
    var myVideo = document.getElementsByTagName('video')[0];
    var myImage = document.getElementsByTagName('img')[0];

    this.currentIndex = 0;
    if (this.visibleImages[this.currentIndex].imagetype == 'image') {
      this.vPlayer = false;
      myImage.src = './uploads/' + this.visibleImages[this.currentIndex].imagename;
      this.imageTitle = this.visibleImages[this.currentIndex].imagetitle;
      setTimeout(() => {
        this.myAddListener();
      }, this.imageSlideTime);
    } else {
      this.vPlayer = true;
      myVideo.src = './uploads/' + this.visibleImages[this.currentIndex].imagename;
      myVideo.load();
    }
  }

  myAddListener() {
    // console.log('nextItem');
    var myVideo = document.getElementsByTagName('video')[0];
    var myImage = document.getElementsByTagName('img')[0];
    this.currentIndex = (this.currentIndex + 1) % this.visibleImages.length;

    if (this.visibleImages.length) {
      if (this.visibleImages[this.currentIndex].imagetype == 'image') {
        this.vPlayer = false;
        myImage.src = './uploads/' + this.visibleImages[this.currentIndex].imagename;
        setTimeout(() => {
          this.myAddListener();
        }, this.imageSlideTime);
      } else {
        this.vPlayer = true;
        myVideo.src = './uploads/' + this.visibleImages[this.currentIndex].imagename;
      }
    }
  }

  stopPlayer() {
    this.visibleImages = [];
    var myImage = document.getElementsByTagName('img')[0];
    var myVideo = document.getElementsByTagName('video')[0];
    myImage.src = myVideo.src = '/src/assets/img/hqdefault.jpg';
  }

  ngOnInit() {
  }

}
