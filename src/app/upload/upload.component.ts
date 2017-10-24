import { Component, OnInit } from '@angular/core';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { ImageService } from '../shared/image.service';

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

  public uploader: FileUploader = new FileUploader({ url: URL });

  constructor(private imageService: ImageService) {
    this.imageService.getSessions()
      .subscribe(data => {
        if (data.sessions.length) {
          this.totalSessions = data.sessions;
        }
      });
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

  createNewSession() {
    let sessionname = this.sessionname
    this.imageService.createSessions(sessionname)

      .subscribe(data => {
        if (data.success) {
          this.sessionname = null;
          this.totalSessions.push(data.session);
        }
      });
  };


  ngOnInit() {
  }

}
