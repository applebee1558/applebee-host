import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { API_URL } from './config';

export default class RegisterModel extends Component {
    @tracked registerbutton_loading=false
    @tracked error="no"
    email_addr=""
    username=""
    @action
    async register(){
        this.registerbutton_loading=true
        console.log(this.email_addr)
        var payload=JSON.stringify({
            email: this.email_addr,
            username: this.username,
            password: this.password
        })
        var r = await fetch(API_URL+"/register", {method: "POST", headers:{"content-type": "application/json"}, body: payload})
        console.log("registered!")
        setTimeout(()=>{
            this.registerbutton_loading=false
        }, 1000)
    }
    @action
    email_change(a){
        this.email_addr = a
    }
    @action
    username_change(a){
        this.username = a
    }
}