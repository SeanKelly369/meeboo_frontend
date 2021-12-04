import * as moment from "moment";
import { Moment } from "moment";
import { User } from "./user";

export class Session {
    static readonly VALIDITY_MINUTES = 6;
    private validUntil: Moment

    constructor(
        public sessionId:string,
        public user: User) {
            this.validUntil = moment().add(Session.VALIDITY_MINUTES, 'minutes');
        }

    isValid() {
        return moment().diff(this.validUntil, 'minutes') <= 0;
    }
    
}