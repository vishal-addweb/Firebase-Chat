import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import firebase from 'firebase';

/*
  Generated class for the ChatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatProvider {
  firebuddychats = firebase.database().ref('/buddychats');
  firebuddymessagecounter = firebase.database().ref('/buddychats');
  fireuserStatus = firebase.database().ref('/userstatus');
    buddy: any;
    buddymessages = [];
    msgcount=0;
    buddyStatus:any;
  constructor(public events: Events) {
    console.log('Hello ChatProvider Provider');
  }
  initializebuddy(buddy) {
      this.buddy = buddy;
  }

  addnewmessage(msg) {

    if (this.buddy) {
      var promise = new Promise((resolve, reject) => {
        this.fireuserStatus.child(this.buddy.uid).on('value',(statuss)=>{
          let msgstatus = statuss.val();
          this.firebuddychats.child(firebase.auth().currentUser.uid).child(this.buddy.uid).push({
            sentby: firebase.auth().currentUser.uid,
            message: msg,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            msgStatus:msgstatus.status
          }).then(() => {
            this.firebuddychats.child(this.buddy.uid).child(firebase.auth().currentUser.uid).push({
              sentby: firebase.auth().currentUser.uid,
              message: msg,
              timestamp: firebase.database.ServerValue.TIMESTAMP,
              msgStatus:msgstatus.status
            }).then(() => {
              resolve(true);
              })
              // .catch((err) => {
              //   reject(err);
              // })
          })
        })
      })
      return promise;
    }
  }

  getbuddymessages() {
    let temp;
    this.firebuddychats.child(firebase.auth().currentUser.uid).child(this.buddy.uid).on('value', (snapshot) => {
      this.buddymessages = [];
      temp = snapshot.val();

      console.log('counter Message ',temp)
      for (var tempkey in temp) {
        this.buddymessages.push(temp[tempkey]);
      }
      this.events.publish('newmessage');
    })
  }
  getbuddyStatus(){
    let tmpStatus;

      this.fireuserStatus.child(this.buddy.uid).on('value',(statuss)=>{
        tmpStatus = statuss.val();
          console.log('tmpStatus=', tmpStatus);
          if(tmpStatus.status  == 1){
            this.buddyStatus=tmpStatus.data
          }else{
            let date = new Date(tmpStatus.timestamp * 1000);
            this.buddyStatus = date
          }
          this.events.publish('onlieStatus');
      })
  }
  setstatusUser(){
      var promise = new Promise((resolve,reject)=> {
          this.fireuserStatus.child(firebase.auth().currentUser.uid).set({
            status:1,
            data:'online',
            timestamp: firebase.database.ServerValue.TIMESTAMP
          }).then(()=>{
            resolve(true);
          }).catch((err)=>{
            reject(err);
          })
      })
      return promise;
  }
  setStatusOffline(){
    var promise = new Promise((resolve, reject)=>{
      this.fireuserStatus.child(firebase.auth().currentUser.uid).update({
        status:0,
        data:'offline',
        timestamp:firebase.database.ServerValue.TIMESTAMP
      }).then(()=>{
        resolve(true);
      }).catch((err)=>{
        reject(err);
      })

    })
    return promise;
  }
  getmsgCounter(buddy){
    let msg;
    let count=0;
    this.msgcount= 0;
    this.firebuddymessagecounter.child(firebase.auth().currentUser.uid).child(buddy.uid).on('value', (snapshot) => {
      this.msgcount=0;
      msg=snapshot.val();
        for (var tempkey in msg) {

            console.log('messages',msg[tempkey].msgStatus)
            if(msg[tempkey].msgStatus == 0){
              this.msgcount = this.msgcount + 1;
            }
        }
        console.log('counter',count)
        this.events.publish('counter');

      // if(msg){
      //   for (let i = 0; i< msg.length;i++){
      //       if(msg.msgStatus==0){
      //           count++
      //       }
      //   }
      // }
    })
  }
}
