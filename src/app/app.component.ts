import { HttpClient } from '@angular/common/http';
import { Component, OnInit, VERSION } from '@angular/core';
import { from, groupBy } from 'rxjs';
import * as _ from 'lodash';
import { init } from 'lodash/fp';
import { min } from 'lodash';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  name = 'Angular ' + VERSION.major;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.dayThree();
  }

  dayThree() {}

  dayTwo() {
    enum OpponentShapes {
      A = 'Rock',
      B = 'Paper',
      C = 'Scissors',
    }
    enum MyShapes {
      X = 'Rock',
      Y = 'Paper',
      Z = 'Scissors',
    }

    this.call(2).subscribe((res) => {
      const entries: string[] = res.split('\n');
      let scores = [];

      entries
        .filter((res) => res !== '')
        .forEach((res) => {
          const opponent = OpponentShapes[res.split(' ')[0]];
          const mine = MyShapes[res.split(' ')[1]];
          let score = 0;

          //part 1
          /*
          switch (mine) {
            case MyShapes.X:
              score = 1;
              break;
            case MyShapes.Y:
              score = 2;
              break;
            case MyShapes.Z:
              score = 3;
              break;
          }
          
          if (opponent === mine) {
            score = score + 3;
          } else if (
            (opponent === OpponentShapes.A && mine === MyShapes.Y) ||
            (opponent === OpponentShapes.B && mine === MyShapes.Z) ||
            (opponent === OpponentShapes.C && mine === MyShapes.X)
          ) {
            score = score + 6;
          }*/

          //part 2
          switch (mine) {
            case MyShapes.Y:
              score = score + 3;
              switch (opponent) {
                case OpponentShapes.A:
                  score = score + 1;
                  break;
                case OpponentShapes.B:
                  score = score + 2;
                  break;
                case OpponentShapes.C:
                  score = score + 3;
                  break;
              }
              break;
            case MyShapes.Z:
              score = score + 6;
              switch (opponent) {
                case OpponentShapes.A:
                  score = score + 2;
                  break;
                case OpponentShapes.B:
                  score = score + 3;
                  break;
                case OpponentShapes.C:
                  score = score + 1;
                  break;
              }
              break;
            default:
              switch (opponent) {
                case OpponentShapes.A:
                  score = score + 3;
                  break;
                case OpponentShapes.B:
                  score = score + 1;
                  break;
                case OpponentShapes.C:
                  score = score + 2;
                  break;
              }
              break;
          }

          scores.push(score);
          //console.log({ opponent, mine, score });
        });
      const total = _.sum(scores);
      console.log({ scores, total });
    });
  }

  dayOne() {
    this.call(1).subscribe((res) => {
      const nums: string[] = res.split('\n');

      let initValue = 0;
      let maxValue = 0;
      let maxValues = [];

      nums.forEach((num) => {
        if (num !== '') {
          initValue = initValue + Number(num);
        } else {
          maxValues.push(initValue);
          initValue = 0;
        }
      });

      maxValues = maxValues.sort((a, b) => b - a);
      maxValue = maxValues.slice(0, 3).reduce((a, b) => a + b, 0);

      console.log({
        nums,
        initValue,
        maxValue,
        maxValues,
        maxValues3: maxValues.slice(0, 3),
      });
    });
  }

  call(day) {
    return this.http.get('assets/' + day + '.txt', { responseType: 'text' });
  }
}
