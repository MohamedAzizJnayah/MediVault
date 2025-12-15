import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'joinTimes',
  standalone: true,
})
export class JoinTimesPipe implements PipeTransform {
  transform(times: string[] | null | undefined, separator: string = ' , '): string {
    return (times ?? []).join(separator);
  }
}
