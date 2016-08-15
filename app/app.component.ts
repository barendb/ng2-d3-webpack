/// <reference path="../typings/index.d.ts" />

import {Component} from '@angular/core';
import { BarGraphComponent } from './charts/bargraph/bargraph.component'
import {LineGraphComponent} from "./charts/linegraph/linegraph.component";

@Component({
  //moduleId: module.id,
  selector: 'my-app',
  template: `<div>
                <bar-graph>test</bar-graph>
                <line-graph>test</line-graph>
            </div>`,
  directives: [BarGraphComponent, LineGraphComponent]
})

export class AppComponent {}

