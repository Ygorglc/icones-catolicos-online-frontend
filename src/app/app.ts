import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiErrorService } from './core/services/api-error.service';
import { LoadingService } from './core/services/loading.service';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly loadingService = inject(LoadingService);
  protected readonly apiErrorService = inject(ApiErrorService);
}
