import { trigger, transition, style, animate } from '@angular/animations';

export const expandCollapse = trigger('expandCollapse', [
    transition(':enter', [
      style({ height: '0', overflow: 'hidden', opacity: 0 }),
      animate('500ms ease-in-out', style({ height: '*', opacity: 1 }))
    ]),
    transition(':leave', [
      style({ height: '*', overflow: 'hidden', opacity: 1 }),
      animate('500ms ease-in-out', style({ height: '0', opacity: 0 }))
    ])
  ]);