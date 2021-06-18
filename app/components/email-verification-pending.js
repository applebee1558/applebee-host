import Component from '@glimmer/component';
import { make_request } from '../libs/api-handler';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class EmailVerificationPending extends Component {
    @tracked resend_loading=false;
    @tracked errormsg="You need to verify your email first before using applebee.host!"
    @tracked change_email_dialog_open=false
    @action
    async resend_verification(){
        this.resend_loading = true
        var {json_data, status} = await make_request('POST', '/users/@me/resend-activation-email')
        if(status!=204){
            if(json_data.code==115699){
                json_data.message += ` Try again in ${json_data.retry_after} seconds`
            }
            this.errormsg = `${json_data.message} | Code ${json_data.code}`
        }
        this.resend_loading=false
        console.log("sending")
    }
    @action
    close_change_dialog(){
        this.change_email_dialog_open=false
    }
    @action
    open_change_dialog(){
        this.change_email_dialog_open=true
    }
}
