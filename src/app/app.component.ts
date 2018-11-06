import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('unparsedData') unparsedData
  json: any
  parseDisabled: boolean = false
  clearDisabled: boolean = true

  parse() {
    this.json = JSON.parse(this.unparsedData.nativeElement.value)
    this.judge(true, false)
  }
  clear() {
    this.json = {}
    this.judge(false, true)
  }
  judge(judgmentOne, judgmentTwo) {
    this.parseDisabled = judgmentOne
    this.clearDisabled = judgmentTwo
  }
}
