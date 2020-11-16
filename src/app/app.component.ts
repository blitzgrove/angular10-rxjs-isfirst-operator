import { Component } from "@angular/core";

import { timer, Observable, Subject, combineLatest } from "rxjs";
import { tap, takeUntil } from "rxjs/operators";

export const isFirst = (predicate: any) => {
  let first = true;
  return <T>(source: Observable<T>) => {
    return source.pipe(
      tap({
        next: _ => {
          if (first) {
            predicate();
            first = false;
          }
        }
      })
    );
  };
};

@Component({
  selector: "my-app",
  template: `
    <button (mouseup)="stop$.next()">Stop</button>
  `
})
export class AppComponent {
  stop$ = new Subject<any>();

  constructor() {
    combineLatest(timer(2000, 1000), timer(3000, 500))
      .pipe(
        isFirst(_ => {
          console.log("first");
        }),
        takeUntil(this.stop$)
      )
      .subscribe({
        next: r => console.log("inside subscription:", r)
      });
  }
}
