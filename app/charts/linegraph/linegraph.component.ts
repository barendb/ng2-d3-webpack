import { Component, ElementRef } from '@angular/core';
import { Graph } from '../chart.component';
import * as d3 from 'd3';

interface ILineDataModel {
  x: string;
  y: number;
}
interface ILineGraphDataModel extends Array<ILineDataModel>{}


@Component({
  selector: 'line-graph',
  templateUrl: './app/charts/linegraph/linegraph.component.html',
  styleUrls: ['./app/charts/linegraph/linegraph.component.css']
})

export class LineGraphComponent extends Graph {

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

    this.data = <ILineGraphDataModel>[
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
    this.drawAxis();
    this.drawLineArea();
  }

  setScales() {

    this.xScale = d3.scale.ordinal()
        .domain(this.data.map((bar) => { return bar.x; }))
        .rangePoints([0, this.width]);

    this.yScale = d3.scale.linear()
        .domain([0, d3.max(this.data, bar => bar['y'])])
        .range([this.height, 0]);
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


  drawLineArea() {
    let path = this.chart
        .append('g')
        .append('path')
        .attr('fill', 'url(#lineara-gradient)');


    let lineBottom = d3.svg.line()
         .x((d:any)=> this.xScale(d.x))
         .y((d:any)=> this.height);

    let line = d3.svg.line()
        .x((d:any)=> this.xScale(d.x))
        .y((d:any)=> this.yScale(d.y));

    let areaBottom = d3.svg.area()
        .x((d:any)=> this.xScale(d.x))
        .y0((d:any)=> this.yScale(0))
        .y1((d:any)=> this.height);

    let area = d3.svg.area()
        .x((d:any)=> this.xScale(d.x))
        .y0((d:any)=> this.yScale(0))
        .y1((d:any)=> this.yScale(d.y));

    path.datum(this.data)
        .attr('d', areaBottom)
        .transition()
        .ease(this.easing)
        .duration(this.transitionDuration)
        .attr('d', area);


    this.chart
        .append('g')
        .append('path')
        .attr('class', 'line-chart')
        .datum(this.data)
        .attr('d', lineBottom)
        .transition()
        .ease(this.easing)
        .duration(this.transitionDuration)
        .attr('d', line);


    this.chart.selectAll('.dot')
        .data(this.data)
        .enter().append('circle')
        .attr('class', 'dot')
        .attr('cx', d => this.xScale(d.x))
        .attr('cy', this.height)
        .attr('r', 4)
        .transition()
        .ease(this.easing)
        .duration(this.transitionDuration)
        .attr('cy', d => this.yScale(d.y))
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

  createGradient() {
    let gradient = this.chart.append('defs')
        .append('linearGradient')
        .attr({
          id: 'lineara-gradient',
          x1: 0,
          y1: 0,
          x2: 0,
          y2: '100%'
        });

    gradient.append('stop')
        .attr({
          'offset': 0,
          'stop-color': '#ffcc33'
        });

    gradient.append('stop')
        .attr({
          'offset': '100%',
          'stop-color': 'white'
        });

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
