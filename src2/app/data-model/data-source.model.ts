import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Quote } from "./quote.model";
import { Observable } from "../../../node_modules/rxjs/Observable";
import { Playlist } from "./playlist.model";

export interface DataSourceService {
    currentQuotes: BehaviorSubject<Array<Quote>>;
    allQuotes: BehaviorSubject<Array<Quote>>;
    allAuthors: BehaviorSubject<any[]>;
    allPlaylists: BehaviorSubject<Playlist[]>;
    saveQuote: Function;
    updateQuote: Function;
    deleteQuote: Function;
}