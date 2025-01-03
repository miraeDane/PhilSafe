import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minuteSeconds',
  standalone: true
})
export class MinuteSecondsPipe implements PipeTransform {
  transform(value: number): string {
    if (isNaN(value) || value < 0) return '00:00';
    const minutes: number = Math.floor(value / 60);
    const seconds: number = value % 60;
    return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  private padZero(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }
}
