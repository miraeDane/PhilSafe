import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'incidentDetails',
  standalone: true
})
export class IncidentDetailsPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
