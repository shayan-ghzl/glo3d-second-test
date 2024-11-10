import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../models/models';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(value: Task[], status: string | null): Task[] {
    if (status === null) {
      return value;
    }

    const result = value.filter(item => item.status === status);
    return result;
  }

}