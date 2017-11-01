import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';


@Injectable()
export class CategoryService {

  constructor(private http: Http) { }

  visibleImages = [];

  // private splashUrl = 'http://www.splashbase.co/api/v1/images/random';
  private baseURL = 'http://localhost:3000/api/';


  getRootCategory() {
    let data = localStorage.getItem('uname');
    return this.http.get(this.baseURL + 'getrootcategories')
      .map(res => res.json());
  }

  getSubCategory(id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let data = { id: id };
    return this.http.post(this.baseURL + 'getsubcategories', JSON.stringify(data), { headers: headers })
      .map(
      res => res.json(),
      err => console.log(err)
      );
  }

  addSubCategory(parentcategory, categoryname) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let data = { parentcategory: parentcategory, categoryname: categoryname };
    return this.http.post(this.baseURL + 'addsubcategory', JSON.stringify(data), { headers: headers })
      .map(
      res => res.json(),
      err => console.log(err)
      );
  }

  addRootCategory(categoryname) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let data = { categoryname: categoryname };
    return this.http.post(this.baseURL + 'addrootcategory', JSON.stringify(data), { headers: headers })
      .map(
      res => res.json(),
      err => console.log(err)
      );
  }

  removeCategory(categoryname, id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let data = { id: id, categoryname: categoryname };
    return this.http.post(this.baseURL + 'deletecategory', JSON.stringify(data), { headers: headers })
      .map(
      res => res.json(),
      err => console.log(err)
      );
  }

  updateCategory(category, id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let data = { id: id, category: category };
    return this.http.post(this.baseURL + 'updatecategory', JSON.stringify(data), { headers: headers })
      .map(
      res => res.json(),
      err => console.log(err)
      );
  }

//   removeImage(id) {
//     let data = localStorage.getItem('uname');
//     return this.http.post(this.removeImageUrl, { username: data, id: id })
//       .map(res => res.json());
//   }

//   updateImage(id, index) {
//     return this.http.post(this.updateImageUrl, { index: index, id: id })
//       .map(res => res.json());
//   }


  // Static Images
  // getImages(id: number){
  // 	return IMAGES.slice(0).find(image => image.id == id);
  // }

  // randomImage() {
  //   return this.http.get(this.splashUrl)
  //     .map(res => res.json());

  // }

}

// const IMAGES = [
//   { "id": 1, "caption": "Grassland Deer", "url": "assets/img/deer.jpg" },
//   { "id": 2, "caption": "A lonely Road", "url": "assets/img/road.jpg" },
//   { "id": 3, "caption": "Mountain Top", "url": "assets/img/mountain.jpg" },

// ];