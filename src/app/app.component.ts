import { HttpClient } from '@angular/common/http';
import { Component, OnInit, VERSION } from '@angular/core';
import * as _ from 'lodash';
import { slice } from 'lodash';

const cleanLine = (line) =>
  line.includes('\r') ? line.substring(0, line.length - 1) : line;

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  name = 'Angular ' + VERSION.major;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.daySeven();
  }

  daySeven() {
    type Command = {
      type: 'command';
      command: 'cd' | 'ls';
      arg?: string;
    };

    type File = {
      type: 'file';
      size: number;
      name: string;
    };

    type Dir = {
      type: 'dir';
      size: null;
      name: string;
      files?: File[];
    };

    type Entries = (Command | File | Dir)[];

    type Disk = {
      [key: string]: Disk | number;
    };


    const parsetInput = (entries: string[]): Entries => {
      return entries.map((entry) => {
        if (entry.includes('$')) {
          const [command, arg] = entry.split(' ').slice(1);
          return {
            type: 'command',
            command,
            arg: arg ?? '/',
          } as Command;
        } else {
          const [type, name] = entry.split(' ');
          if (type === 'dir') {
            return { type, name, size: 0 } as Dir;
          } else {
            return { type: 'file', size: Number(type), name } as File;
          }
        }
      });
    };

    this.call(7).subscribe((res) => {
      const entries: string[] = res
        .split('\n')
        .map((l) => cleanLine(l))
        .slice(0, 14);
      const structure: Entries = parsetInput(entries);
      console.log({ structure });

      const disk = { '/': {} };
      structure.forEach((line: Command | File | Dir) => {
        console.log({ ...line }, _.get(disk, '/'));
        if(line.type === 'command'){
          console.log(_.get(line, ''))
        }
      });
    });
  }

  daySix() {
    this.call(6).subscribe((res) => {
      const entry = res.split('');
      console.log({ entry });

      let startOfPacket = 0;
      let startOfMessage = 0;

      for (let i = 0; i < entry.length; i++) {
        let data = entry.slice(i, i + 4);
        let tmp = _.uniq(data);
        //console.log('4--', ...data, '|', ...tmp);
        //part 1
        if (tmp.length === 4) {
          startOfPacket = i + 4;
        }

        //part 2
        data = entry.slice(i, i + 14);
        tmp = _.uniq(data);
        if (tmp.length === 14) {
          startOfMessage = i + 14;
        }
      }

      console.log({ startOfPacket, startOfMessage });
    });
  }

  dayFive() {
    const stacks = {
      1: ['B', 'P', 'N', 'Q', 'H', 'D', 'R', 'T'],
      2: ['W', 'G', 'B', 'J', 'T', 'V'],
      3: ['N', 'R', 'H', 'D', 'S', 'V', 'M', 'Q'],
      4: ['P', 'Z', 'N', 'M', 'C'],
      5: ['D', 'Z', 'B'],
      6: ['V', 'C', 'W', 'Z'],
      7: ['G', 'Z', 'N', 'C', 'V', 'Q', 'L', 'S'],
      8: ['L', 'G', 'J', 'M', 'D', 'N', 'V'],
      9: ['T', 'P', 'M', 'F', 'Z', 'C', 'G'],
    };

    this.call(5).subscribe((res) => {
      let entries: string[] = res.split('\n');
      entries = entries.slice(10, entries.length);
      console.log({ entries });

      entries.forEach((res) => {
        const tmp = res.match(/(\d{1,2})/g).map((r) => parseInt(r));
        const [amount, fromStack, toStack] = tmp;
        //console.log({ amount, fromStack, toStack });

        //part 1
        /*for (let i = 0; i < amount; i++) {
          stacks[toStack].push(stacks[fromStack].pop());
        }*/

        //part 2
        const idxEnd = stacks[fromStack].length;
        const idxInit = idxEnd - amount;
        stacks[toStack] = stacks[toStack].concat(
          stacks[fromStack].slice(idxInit, idxEnd)
        );
        stacks[fromStack].splice(idxInit, amount);
      });

      console.log({
        stacks,
        message: Object.values(stacks)
          .map((s) => s[s.length - 1])
          .join(''),
      });
    });
  }

  dayFour() {
    this.call(4).subscribe((res) => {
      const entries: string[] = res.split('\n');
      console.log({ entries });

      const containted = entries.reduce((acc, val) => {
        const sectionOne = val.split(',')[0];
        const s1Init = parseInt(sectionOne.split('-')[0]);
        const s1End = parseInt(sectionOne.split('-')[1]);
        const sectionTwo = val.split(',')[1];
        const s2Init = parseInt(sectionTwo.split('-')[0]);
        const s2End = parseInt(cleanLine(sectionTwo.split('-')[1]));

        //console.log({ s1Init, s1End, s2Init, s2End });
        //part 1
        if (s2End <= s1End && s2Init >= s1Init) {
          acc++;
        } else if (s2End >= s1End && s2Init <= s1Init) {
          acc++;
        }
        //part 2
        else if (
          (s2Init >= s1Init && s2Init <= s1End) ||
          (s2End <= s1End && s2End >= s1Init)
        ) {
          acc++;
        }

        return acc;
      }, 0);
      console.log({ containted });
    });
  }

  dayThree() {
    this.call(3).subscribe((res) => {
      const entries: string[] = res.split('\n');
      console.log(entries);
      let priorities = [];

      const alphaValLowerCase = (s) => s.charCodeAt(0) - 96;
      const alphaValUpperCase = (s) => s.charCodeAt(0) - 65 + 27;
      const isUpperCase = (s) => s.toUpperCase() === s;

      //part 1
      entries.forEach((rsLine) => {
        rsLine = cleanLine(rsLine); //remove /r at end of string
        const firstRS = rsLine.slice(0, rsLine.length / 2).split('');
        const secondRS = rsLine
          .slice(rsLine.length / 2, rsLine.length)
          .split('');
        //console.log({ rsLine, firstRS, secondRS });

        const remained = firstRS.filter((e) => secondRS.includes(e))[0];
        const remainedValue = isUpperCase(remained)
          ? alphaValUpperCase(remained)
          : alphaValLowerCase(remained);

        priorities.push(remainedValue);

        //console.log({ remained, remainedValue});
      });
      console.log('Part 1', { priorities, sum: _.sum(priorities) });

      //part 2
      priorities = []; //reset
      _.chunk(entries, 3).forEach((group) => {
        const string1 = cleanLine(group[0]).split('');
        const string2 = cleanLine(group[1]).split('');
        const string3 = cleanLine(group[2]).split('');
        const result = string1.filter(
          (e) => string2.includes(e) && string3.includes(e)
        )[0];
        const groupValue = isUpperCase(result)
          ? alphaValUpperCase(result)
          : alphaValLowerCase(result);

        priorities.push(groupValue);
      });
      console.log('Part 2', { priorities, sum: _.sum(priorities) });
    });
  }

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
