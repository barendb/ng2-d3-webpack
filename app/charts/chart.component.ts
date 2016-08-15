import { OnInit, ElementRef } from '@angular/core'
import * as d3 from 'd3';

class Dimentions {

  constructor(public top: number, public right: number, public bottom: number, public left: number) {

  }
}

export class Graph implements OnInit {
  element: ElementRef;
  chart: any;
  width: number;
  height: number;
  margin: Dimentions;
  data: any;
  easing: string;
  transitionDuration:number;


  constructor(elementRef: ElementRef) {
    this.element = elementRef;

    // defaults
    this.margin = new Dimentions(20, 20, 20, 20);

    this.width = 400;
    this.height = 400;

    this.easing = 'cubic';
    this.transitionDuration = 1000;
  }


  ngOnInit() {
    this.chart = d3.select(this.element.nativeElement).select('div')
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }
}
