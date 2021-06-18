import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { API_URL } from '../libs/config';
import { inject as service } from '@ember/service';

export default class LoginModel extends Component {
    @tracked login_loading=false
    @tracked error=false
    @tracked captcha_needed=false
    @service router
    username=""
    password=""
    captcha=null
    captcharun=false
    @action
    async login(){
        this.login_loading=true
        if(!this.captcha & this.captcha_needed){
            this.error="Please complete the captcha before logging in!"
            this.login_loading=false
            return
        }
        var payload=JSON.stringify({
            email: this.username,
            password: this.password,
            captcha: this.captcha, //6Le0TzsbAAAAAO8s3f1kH9bu-aU1pedZYM8GK4ah
        })
        try{
            var r = await fetch(API_URL+"/login", {method: "POST", headers:{"content-type": "application/json"}, body: payload})
            var jsondata = await r.json()
            if(r.status!=200){
                if(jsondata.code==151000){
                    this.captcha_needed=true
                    this.error="We need to verify that you are a human first!"
                    this.captcharun=true
                    //this.login_loading=false
                    return
                }
                this.error=`${jsondata.message} | Code ${jsondata.code}`
            }else{
                var token=jsondata.token
                localStorage.setItem("api-token", token)
                this.router.transitionTo('dashboard');
                console.log("logged in!")
            }
        }catch(error){
            this.error=error.toString()
        }
        this.login_loading=false
    }
    
    @action
    password_change(a){
        this.password = a
    }
    @action
    username_change(a){
        this.username = a
    }
    @action
    setcaptcha(token){
        this.captcha = token
        if(this.captcharun){
            this.captcharun=false
            this.login()
        }
    }
    
}