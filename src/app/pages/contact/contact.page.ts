import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.page.html',
  styleUrl: './contact.page.css'
})
export class ContactPage {
  protected name = '';
  protected email = '';
  protected message = '';
  protected submitted = signal(false);

  enviar(): void {
    if (!this.name || !this.email || !this.message) {
      this.submitted.set(false);
      return;
    }

    this.submitted.set(true);
    this.name = '';
    this.email = '';
    this.message = '';
  }
}
