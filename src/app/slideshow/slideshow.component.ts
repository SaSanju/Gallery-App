import { Component, OnInit } from '@angular/core';

import { ImageService } from '../shared/image.service';
import { VgAPI } from 'videogular2/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
    moduleId: module.id,
    selector: 'slideshow',
    templateUrl: 'slideshow.component.html',
    styleUrls: ['slideshow.component.scss']
})
export class SlideshowComponent implements OnInit {

    title = 'Session Slildeshow Page';
    currentUser = localStorage.getItem('uname');
    visibleImages: any[] = [];
    totalSessions: any[];
    currentIndex = 0;
    imageSlideTime: Number = 2000;
    imageTitle: String;
    vPlayer = true;
    param: any;

    public times = [
        { value: 2000, display: '2 Sec' },
        { value: 4000, display: '4 Sec' },
        { value: 6000, display: '6 Sec' }
    ];

    constructor(private imageService: ImageService, public api: VgAPI, private route: ActivatedRoute,
        private router: Router) {
    }

    ngOnInit() {
        this.getParamValues();
    }

    getParamValues() {
        this.route.params.subscribe(params => {
            this.param = params['id'];
        });
    }


    onPlayerReady(api: VgAPI) {
        this.api = api;
        if (this.param) {
            this.startSlideShow(this.param);
        }
    }


    startSlideShow(sessionname) {
        this.api.fsAPI.toggleFullscreen();
        if (sessionname) {
            this.imageService.getImages(sessionname)
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
                this.imageTitle = this.visibleImages[this.currentIndex].imagetitle;
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

}
