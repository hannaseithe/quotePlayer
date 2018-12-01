import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Quote } from "./quote.model";
import { Observable } from "rxjs/Observable";
import { Playlist } from "./playlist.model";

export interface DataSourceService {
    currentQuotes: BehaviorSubject<Array<Quote>>;
    allQuotes: BehaviorSubject<Array<Quote>>;
    allAuthors: BehaviorSubject<any[]>;
    allPlaylists: BehaviorSubject<Playlist[]>;
    saveQuoteWithAuthor: Function;
    saveQuotes: Function;
    updateQuoteWithAuthor: Function;
    deleteQuote: Function;
    deleteQuoteFromPlaylist: Function;
    savePlaylist: Function;
    updatePlaylist: Function;
    deletePlaylist: Function;
}