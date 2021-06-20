import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { API_URL } from '../libs/config';
import { runTask, runDisposables } from 'ember-lifeline';
import { make_request } from '../libs/api-handler';

export default class SharexConfigHolderModal extends Component {
    @tracked upload_tokens = []
    @tracked error = false
    @tracked make_loading = false
    constructor(params){
        super(...arguments)
        runTask(this, async ()=>{
            const {json_data, status} = await make_request("GET", "/upload-tokens")
            if(status!=200){
                this.error = json_data.message
                return
            }
            this.upload_tokens = json_data
        }, 100)
    }
    @action
    name_change(a){
        this.name = a
    }
    @action
    async make_config(){
        this.make_loading = true
        var payload = {
            name: this.name
        }
        var {json_data, status} = await make_request("POST", '/upload-tokens', JSON.stringify(payload))
        if(status!=201){
            this.error = `${json_data.message} | Code: ${json_data.code}`
        }else{
            this.upload_tokens.push(json_data)
            this.make_loading=false
        }
    }
}
