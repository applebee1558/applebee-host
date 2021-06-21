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
    @tracked make_config_model_open=false
    constructor(params){
        super(...arguments)
        this.load_list()
    }
    load_list = ()=>{
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
            //this.upload_tokens.push(json_data)
            const newarray = [json_data]
            this.upload_tokens.forEach(element=>{
                newarray.push(element)
            })
            this.upload_tokens=newarray
            this.make_config_model_open = false
            //window.location.reload()
        }
        this.make_loading=false
    }
}
