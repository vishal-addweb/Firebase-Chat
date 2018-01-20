import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController} from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';


@IonicPage()
@Component({
  selector: 'page-ragister',
  templateUrl: 'ragister.html',
})
export class RagisterPage {
  newuser = {
     email:'',
     username:'',
     password:''
  }
  constructor(public navCtrl: NavController, public navParams: NavParams,public userService: UserProvider,public loadingCtrl: LoadingController,public toastCtrl : ToastController) {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RagisterPage');
  }
  doSignup(){
    let toaster = this.toastCtrl.create({
      message: 'Error Code ',
      duration:3000,
      position:'bottom'
    });
    if(this.newuser.email == '' || this.newuser.password == '' || this.newuser.username == ''){
      toaster.setMessage('All field are Required!');
      toaster.present();
    }else if(this.newuser.password.length < 7){
      toaster.setMessage('Password is Not Strong');
      toaster.present();
    }else{

        let loader = this.loadingCtrl.create({
          content:'Please wait'
        })
        loader.present();
          this.userService.adduser(this.newuser)
          .then((res)=>{
            loader.dismiss();
            if(res){
              this.navCtrl.push('ProfilepicPage');
            }else{
              alert('Error' + res);
            }
          })
      }
  }
  doLogin(){
    this.navCtrl.setRoot('LoginPage');
  }
}
