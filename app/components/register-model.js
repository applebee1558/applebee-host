import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { API_URL } from '../libs/config';
import { inject as service } from '@ember/service';
import { runTask, runDisposables } from 'ember-lifeline';
import { refresh_token } from '../libs/api-handler';
import { validator, buildValidations } from 'ember-cp-validations';
const Validations = buildValidations({
    password: [
      validator('presence', true),
      validator('length', {
        min: 4,
        max: 8,
      }),
      validator('length', {
        isWarning: true,
        min: 6,
        message: 'Password is weak',
      }),
    ],
    email: [validator('presence', true), validator('format', { type: 'email' })],
  });
export default class RegisterModel extends Component {
    @service router
    @tracked registerbutton_loading=false
    @tracked error=false
    email_addr=""
    username=""
    password=""
    confirm_password=""
    invite=""
    captcha=null
    @tracked captcha_needed=false
    @tracked password_error=false
    @tracked confirm_password_error=false
    @tracked email_error=false
    captcharun=false

    constructor(params){
        super(...arguments)
        if (localStorage.getItem("api-token")!=null & localStorage.getItem("api-token")!='null'){
            console.log("stop registering!")
            this.router.transitionTo('dashboard');
        }
    }
    @action
    async register(){
        this.registerbutton_loading=true
        if(this.password.length<8){
            this.error="Password needs to be at least 8 characters!"
            this.registerbutton_loading=false
            return
        }
        if(this.confirm_password!=this.password){
            this.error="Passwords do not match!"
            this.registerbutton_loading=false
            return
        }
        if(!this.captcha & this.captcha_needed){
            this.error="Please complete the captcha before registering!"
            this.registerbutton_loading=false
            return
        }
        var payload=JSON.stringify({
            email: this.email_addr,
            username: this.username,
            password: this.password,
            captcha: this.captcha, //6Le0TzsbAAAAAO8s3f1kH9bu-aU1pedZYM8GK4ah
            invite: this.invite
        })
        try{
            var r = await fetch(API_URL+"/register", {method: "POST", headers:{"content-type": "application/json"}, body: payload})
            var jsondata = await r.json()
            if(r.status!=201){
                if(jsondata.code==151000){
                    this.captcha_needed=true
                    this.error="We need to verify that you are a human first!"
                    this.captcha =  await new Promise(resolve => this.captcharun=resolve);
                    return await this.register()
                    return
                }else if(jsondata.code==155795){
                    this.captcha_needed=false
                    this.error="Please re-do the captcha!"
                    await new Promise(resolve => setTimeout(resolve, 500));
                    this.captcha_needed=true
                    this.captcha =  await new Promise(resolve => this.captcharun=resolve);
                    return await this.register()
                }
                this.error=`${jsondata.message} | Code ${jsondata.code}`
            }else{
                var token=jsondata.token
                localStorage.setItem("api-token", token)
                refresh_token();
                this.router.transitionTo('dashboard');
                console.log("registered!")
            }
        }catch(error){
            this.error=error.toString()
        }
        this.registerbutton_loading=false
    }
    @action
    email_change(a){
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(a)){
            this.email_error="Not a valid email!"
        }else{
            this.email_error=false
        }
        this.email_addr = a
    }
    @action
    password_change(a){
        if(a.length < 8){
            this.password_error="Password needs a minimum of 8 characters!"
        }else{
            this.password_error=false
        }
        this.password = a
    }
    @action
    confirm_password_change(a){
        if(a!=this.password){
            this.confirm_password_error="Passwords do not match!"
        }else{
            this.confirm_password_error=false
        }
        this.confirm_password=a
    }
    @action
    username_change(a){
        this.username = a
    }
    @action
    invite_change(a){
        this.invite = a
    }
    @action
    setcaptcha(token){
        this.captcha = token
        if(this.captcharun){
            this.captcharun(token)
            this.captcharun=false
            //this.register()
        }
    }
}