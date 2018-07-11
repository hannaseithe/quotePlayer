import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Quote } from "../../../src/app/data-model/quote.model";

export interface DataSourceService {
    getCurrentQuotes: Function;
    currentQuotes: BehaviorSubject<Array<Quote>>;
    saveQuote: Function;
}