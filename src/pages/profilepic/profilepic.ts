import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ImagehandlerProvider } from '../../providers/imagehandler/imagehandler';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the ProfilepicPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profilepic',
  templateUrl: 'profilepic.html',
})
export class ProfilepicPage {
  imgUrl= 'https://www.limestone.edu/sites/default/files/user.png';
  moveon = true;
  constructor(public navCtrl: NavController, public navParams: NavParams, public imageService :ImagehandlerProvider, public zone :NgZone, public userservice : UserProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilepicPage');
  }
  choseImage(){
      this.imageService.uploadimage().then((uplodedurl : any)=>{
          this.zone.run(()=>{
            this.imgUrl = uplodedurl;
            this.moveon = false;
          })
      })
  }
  updateproceed(){
      this.userservice.updateimage(this.imgUrl).then((res)=>{
        if(res){
          this.navCtrl.setRoot('TabsPage');
        }
      })
  }
  proceed(){
    this.navCtrl.setRoot('TabsPage');
  }
}
