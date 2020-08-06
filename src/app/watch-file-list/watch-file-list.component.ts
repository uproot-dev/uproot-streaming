import { Component, OnInit } from '@angular/core';
import { Globals } from '../app.globals';

@Component({
  selector: 'app-watch-file-list',
  templateUrl: './watch-file-list.component.html',
  styleUrls: ['./watch-file-list.component.scss']
})
export class WatchFileListComponent implements OnInit {

  constructor(public globals: Globals) {}

    ngOnInit() {
      this.globals.watchAddress = this.globals.watchAddress.replace(/href="/g, "target=\"_blank\" href=\"" + this.globals.watchStream);
      $($.parseHTML(this.globals.watchAddress)).appendTo('.inject');
    }

}
