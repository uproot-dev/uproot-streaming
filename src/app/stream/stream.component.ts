import { Component, OnInit } from '@angular/core';
import { Globals } from '../app.globals';
import { ModalService } from '../_modal';

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

  constructor(public globals: Globals, private modalService: ModalService) { }

  ngOnInit(): void {
  }

  openModal(id: string) {
      this.modalService.open(id);
  }

  closeModal(id: string) {
      this.modalService.close(id);
  }

}
