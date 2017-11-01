import { Component, OnInit } from '@angular/core';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { ImageService } from '../shared/image.service';
import { CategoryService } from '../shared/category.service';

const URL = 'http://localhost:3000/upload';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  sessionname: String;
  totalSessions: any[] = [];
  uploadImage: null;
  catones: any[] = [];
  cattwos: any[] = [];
  catthrees: any[] = [];

  public uploader: FileUploader = new FileUploader({ url: URL });

  constructor(private imageService: ImageService, private categoryService: CategoryService) {
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

  addImage(sName) {
    this.uploadImage = sName;
    var uo: FileUploaderOptions = {};
    uo.additionalParameter = { sessionname: this.uploadImage };
    uo.headers = [{ name: 'name', value: localStorage.getItem('uname') }]
    this.uploader.setOptions(uo);
  }

  removeImage(image, images) {
    let id = image._id;
    this.imageService.removeImage(id)
      .subscribe(data => {
        if (data.success) {
          images.splice(images.indexOf(image), 1);
          console.log('Removed Successfully')
        }
      });
  }

  showImage(session) {
    this.imageService.getImages(session.sessionname)
      .subscribe(images => {
        if (images.length) {
          session.images = images;
          console.log(session.images);
        }
      });
  }

  createNewSession(categoryId) {
    let sessionname = this.sessionname;
    let category = this.catthrees.find(function (ele) {
      return ele._id === categoryId
    });
    let categoryname = category.categoryname;
    if (categoryname) {
      this.imageService.createSessions(sessionname, categoryname)

        .subscribe(data => {
          if (data.success) {
            this.sessionname = null;
            this.totalSessions.push(data.session);
          }
        });
    }
  };


  ngOnInit() {
  }

}
