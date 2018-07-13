import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Quote } from "./quote.model";

export interface DataSourceService {
    getCurrentQuotes: Function;
    currentQuotes: BehaviorSubject<Array<Quote>>;
    allQuotes: BehaviorSubject<Array<Quote>>;
    saveQuote: Function;
}