import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-my-button',
  template: `
    <button><ng-content></ng-content></button>
  `,
  styles: []
})
export class MyButtonComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
