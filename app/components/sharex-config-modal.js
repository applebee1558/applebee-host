import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { API_URL } from '../libs/config';
import { runTask, runDisposables } from 'ember-lifeline';
import { make_request } from '../libs/api-handler';

export default class SharexConfigModal extends Component {
    @tracked delete_confirm_open=false
    @tracked delete_loading=false
    @tracked delete_error=false
    @tracked delete_success=false
    constructor(params){
        super(...arguments)
        
    }

    sharex_config = {
        "Version": "13.5.0",
        "DestinationType": "ImageUploader, TextUploader, FileUploader",
        "RequestMethod": "POST",
        "RequestURL": "https://applebee.host/api/upload-image",
        "Headers": {
          "x-applebee-host-token": null,
          "x-applebee-host-filename": "$filename$",
          "x-config-version": "1"
        },
        "Body": "MultipartFormData",
        "FileFormName": "data",
        "URL": "$json:url$",
        "ErrorMessage": "$json.message$"
    }
    
    get_desc = ()=>{
        return `Config ID: ${this.args.metadata.id} | Created At: ${new Date(this.args.metadata.created_at)}`
    }
    @action
    toggle_delete(){
        this.delete_confirm_open = !this.delete_confirm_open
    }
    @action
    async delete_config(){
        this.delete_loading=true
        const {json_data, status} = await make_request("DELETE", `/upload-tokens/${this.args.metadata.id}`)
        if(status!=204){
            this.delete_error = `${json_data.message} | Code: ${json_data.code}`
        }else{
            this.delete_success = "Successfully revoked this config!"
        }
        this.delete_loading=false
    }
    @action
    saveconfig(){
        this.sharex_config.Headers['x-applebee-host-token'] = this.args.metadata.token
        var blob = new Blob([JSON.stringify(this.sharex_config)], { type: "application/octet-stream" });

        var a = document.createElement('a');
        a.download = `applebee-host.sxcu`;
        a.href = URL.createObjectURL(blob);
        a.dataset.downloadurl = ["application/octet-stream", a.download, a.href].join(':');
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

}
