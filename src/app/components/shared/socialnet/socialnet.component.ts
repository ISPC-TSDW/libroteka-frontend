import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-socialnet',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './socialnet.component.html',
  styleUrl: './socialnet.component.css',
})
export class SocialnetComponent {}
