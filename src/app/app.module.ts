import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { FileSelectDirective } from 'ng2-file-upload';
import { RouterModule, Routes } from '@angular/router';
import { AlertModule } from 'ngx-bootstrap';
import { VgCoreModule } from 'videogular2/core';
import { DndModule } from 'ng2-dnd';
import { QRCodeModule } from 'angular2-qrcode';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SlideshowComponent } from './slideshow/slideshow.component';
import { HeaderComponent } from './header/header.component';
import { GalleryComponent } from './gallery/gallery.component';
import { AdminComponent } from './admin/admin.component';
import { ImageComponent } from './image/image.component';
import { ImageService } from './shared/image.service';
import { CategoryService } from './shared/category.service';
import { AuthService } from './shared/auth.service';
import { UploadComponent } from './upload/upload.component';
import { AuthGuard } from './shared/auth.guard';
import { RegisterComponent } from './register/register.component';

const ROUTES = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'images',
    component: ImageComponent
  },
  {
    path: 'gallery',
    component: GalleryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'slideshow/:id',
    component: SlideshowComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'upload',
    component: UploadComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard]
  }

];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    GalleryComponent,
    SlideshowComponent,
    ImageComponent,
    UploadComponent,
    AdminComponent,
    FileSelectDirective,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    VgCoreModule,
    QRCodeModule,
    AlertModule.forRoot(),
    RouterModule.forRoot(ROUTES),
    DndModule.forRoot()
  ],
  providers: [ImageService, AuthService, CategoryService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
