import { Component } from '@angular/core';

import { timer, Observable, Subject, combineLatest } from 'rxjs';
import { tap, repeat, switchMap, finalize, takeUntil } from 'rxjs/operators';

export const isFirst = (predicate: any) => {
  let first = true;
  return <T>(source: Observable<T>) => {
    return source.pipe(
      tap({
        next: (_) => {
          if (first) {
            predicate();
            first = false;
          }
        },
      })
    );
  };
};

@Component({
  selector: 'my-app',
  template: `
    <button (mouseup)="start$.next()">Start</button>
    <button (mouseup)="stop$.next()">Stop</button>
  `,
})
export class AppComponent {
  start$ = new Subject<any>();
  stop$ = new Subject<any>();

  constructor() {
    this.start$
      .pipe(
        tap((_) => console.log('Start...')),
        switchMap((_) => combineLatest([timer(2000, 1000), timer(3000, 500)])),
        isFirst((_) => {
          console.log('first');
        }),
        takeUntil(this.stop$),
        finalize(() => console.log('...Stop')),
        repeat()
      )
      .subscribe({
        next: (r) => console.log('inside subscription:', r),
      });
  }
}
