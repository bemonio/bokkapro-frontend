import { Component, OnInit, OnDestroy } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { ToastService } from './_services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  providers: [MessageService]
})
export class ToastComponent implements OnInit, OnDestroy {
  growl: Message[] = [];
  growlSubscription: Subscription;

  constructor(
    private toastService: ToastService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.subscribeToGrowlToast();
  }

  subscribeToGrowlToast() {
    this.growlSubscription = this.toastService.growlChange
      .subscribe(notification => {
        this.messageService.add(notification);
        
        setTimeout(() => {
          this.growl.splice(this.growl.indexOf(notification), 1);
        }, 3000);
      });
  }

  ngOnDestroy() {
    this.growlSubscription.unsubscribe();
  }
}
