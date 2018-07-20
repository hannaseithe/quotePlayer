import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Quote } from "./quote.model";

export interface DataSourceService {
    currentQuotes: BehaviorSubject<Array<Quote>>;
    allQuotes: BehaviorSubject<Array<Quote>>;
    saveQuote: Function;
    updateQuote: Function;
    deleteQuote: Function;
}