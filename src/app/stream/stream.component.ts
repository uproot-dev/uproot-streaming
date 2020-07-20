import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss']
})
export class StreamComponent implements OnInit {

  connection = false;

  play = false;
  showChat = false;
  mic = false;
  video = false;
  screen = false;

  constructor() { }

  ngOnInit(): void {
  }

}
