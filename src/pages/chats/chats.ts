import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams ,Events ,AlertController} from 'ionic-angular';
import { RequestsProvider } from '../../providers/requests/requests';
import { ChatProvider } from '../../providers/chat/chat';
/**
 * Generated class for the ChatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {
  myrequests;
  myfriends;
  messagecounter;
  constructor(public navCtrl: NavController, public navParams: NavParams, public requestservice: RequestsProvider,public events: Events,public alertCtrl : AlertController, public chatservice : ChatProvider,public zone :NgZone) {
    this.setStatus();
    this.events.subscribe('counter', () => {
      this.zone.run(()=>{
        this.messagecounter= this.chatservice.msgcount;
        console.log(this.messagecounter);
      })
    })

  }

  ionViewWillEnter() {
    this.requestservice.getmyrequests();
    this.requestservice.getmyfriends();

    this.myfriends = [];
    this.events.subscribe('gotrequests', () => {
      this.myrequests = [];
      this.myrequests = this.requestservice.userdetails;
    })
    this.events.subscribe('friends', () => {
      this.myfriends = [];
      this.myfriends = this.requestservice.myfriends;
      for(let i = 0;i<this.myfriends.length;i++){

        console.log('user > ',this.myfriends[i])
        this.chatservice.getmsgCounter(this.myfriends[i]);
      }

    })
  }

  addbuddy() {
    this.navCtrl.push('BuddiesPage');
  }

accept(item) {
    this.requestservice.acceptrequest(item).then(() => {

      let newalert = this.alertCtrl.create({
        title: 'Friend added',
        subTitle: 'Tap on the friend to chat with him',
        buttons: ['Okay']
      });
      newalert.present();
    })
  }

  ignore(item) {
    this.requestservice.deleterequest(item).then(() => {
       alert('Request ignored');
    }).catch((err) => {
      alert(err);
    })
  }
  buddychat(buddy) {
    this.chatservice.initializebuddy(buddy);
    this.navCtrl.push('BuddychatPage');
  }
  setStatus(){
    this.chatservice.setstatusUser().then((res)=>{
      if(res){
        console.log('User Online');
      }
    }).catch((err)=>{
        alert(err);
    })
  }
}
