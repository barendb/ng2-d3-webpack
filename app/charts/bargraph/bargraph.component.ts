import { Component, ElementRef } from '@angular/core';
import { Graph } from '../chart.component';
import * as d3 from 'd3';

interface IBarDataModel {
  x: string;
  y: number;
}
interface IBarGraphDataModel extends Array<IBarDataModel>{}


@Component({
  //moduleId: module.id,
  selector: 'bar-graph',
  templateUrl: './app/charts/bargraph/bargraph.component.html',
  styleUrls: ['./app/charts/bargraph/bargraph.component.css']
})

export class BarGraphComponent extends Graph {

  xScale: any;
  yScale: any;
  xAxis: any;
  yAxis: any;
  ticks: number;

  constructor(elementRef: ElementRef) {
    super(elementRef)

    this.margin.bottom = 30;
    this.margin.left = 40;
    this.ticks = 10;

    this.data = <IBarGraphDataModel>[
      {
        x: 'a',
        y: 750
      },
      {
        x: 'b',
        y: 130
      },
      {
        x: 'c',
        y: 300
      },
      {
        x: 'd',
        y: 570
      }
    ];
  }

  ngOnInit() {
    super.ngOnInit();

    this.setScales();
    this.setAxis();

    this.createGradient();
    this.drawHorizontalLines();
    this.drawBars();
    this.drawAxis();
  }

  setScales() {

    this.xScale = d3.scale.ordinal()
      .rangeRoundBands([0, this.width], .1);

    this.yScale = d3.scale.linear()
      .range([this.height, 0]);

    this.xScale.domain(this.data.map((bar) => { return bar.x; }));
    this.yScale.domain([0, d3.max(this.data, bar => bar['y'])]);
  }

  setAxis() {
    this.xAxis = d3.svg.axis()
      .scale(this.xScale)
      .orient('bottom');

    this.yAxis = d3.svg.axis()
      .scale(this.yScale)
      .orient('left')
      .ticks(this.ticks);
  }

  createGradient() {
    let gradient = this.chart.append('defs')
      .append('linearGradient')
      .attr({
        id: 'bar-gradient',
        x1: 0,
        y1: 0,
        x2: 0,
        y2: '100%'
      });

    gradient.append('stop')
      .attr({
        'offset': 0,
        'stop-color': 'green'
      });

    gradient.append('stop')
      .attr({
        'offset': '100%',
        'stop-color': 'white'
      });

  }

  drawBars() {

    let bars = this.chart.selectAll('.bar')
      .data(this.data);

    bars.enter()
      .append('path')
      //.attr('class', 'bar')
      .attr('fill', 'url(#bar-gradient)')
      .attr('d', bar => this.drawRoundedCornerBar(bar, true))
      .transition()
      .ease(this.easing)
      .duration(this.transitionDuration)
      .attr('d', bar => this.drawRoundedCornerBar(bar));

    this.chart.select('.x.axis').call(this.xAxis);
    this.chart.select('.y.axis').call(this.yAxis);
  }

  drawAxis() {

    this.chart.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(this.xAxis);

    this.chart.append('g')
      .attr('class', 'y axis')
      .call(this.yAxis)
      .append('text')

      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Frequency');
  }

  drawRoundedCornerBar(bar: IBarDataModel, startAnim: boolean = false) {

    let x: number, y: number, width: number, height: number, raduis: number;

    x = this.xScale(bar.x);
    y = this.height - 1;
    width = this.xScale.rangeBand();
    height = startAnim ? 0 : this.height - this.yScale(bar.y);
    raduis = startAnim ? 0 : width * 0.1; // 10%

    //      move       vertical             arc                                             horizontal             arc                                            vertical     close
    return `M${x} ${y} v-${height - raduis} a${raduis},${raduis} 0 0 1 ${raduis},-${raduis} h${width - raduis * 2} a${raduis},${raduis} 0 0 1 ${raduis},${raduis} v${height - raduis}z`
  }

  drawHorizontalLines() {

    let lines = d3.range(this.ticks - 1);

    // solid bottom line
    this.chart.append('g')
      .append('line')
      .attr('class', 'horizontal-lines bottom')
      .attr({'x1': 0 ,
        'y1': this.height ,
        'x2': this.width,
        'y2': this.height });

    // horizontal dashed lines
    this.chart.append('g')
      .selectAll('g')
      .data(lines)
      .enter()
      .append('g')
      .attr('class', 'horizontal-lines')
      .append('path')
      .attr('stroke-dasharray', '5, 5')
      .attr('d', (d, i) => `M5 ${ this.yScale(100 * (i + 1)) } l${this.width} 0`)
  }
}
