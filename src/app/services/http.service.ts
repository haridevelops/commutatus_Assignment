import { Injectable } from "@angular/core";
import { Http } from '@angular/http';

@Injectable()
export class HttpService {

    constructor(private http: Http) {}
    getOpportunity() {
        return this.http.get('http://gisapi-web-staging-1636833739.eu-west-1.elb.amazonaws.com/v2/opportunities/6124?access_token=dd0df21c8af5d929dff19f74506c4a8153d7acd34306b9761fd4a57cfa1d483c&api_key=dd0df21c8af5d929dff19f74506c4a8153d7acd34306b9761fd4a57cfa1d483c');
    }
    getBackgrounds() {
        return this.http.get('http://gisapi-web-staging-1636833739.eu-west-1.elb.amazonaws.com/v2/lists/backgrounds?access_token=dd0df21c8af5d929dff19f74506c4a8153d7acd34306b9761fd4a57cfa1d483c');
    }
    getSkills() {
        return this.http.get('http://gisapi-web-staging-1636833739.eu-west-1.elb.amazonaws.com/v2/lists/skills?access_token=dd0df21c8af5d929dff19f74506c4a8153d7acd34306b9761fd4a57cfa1d483c&with_parents=false');
    }
}