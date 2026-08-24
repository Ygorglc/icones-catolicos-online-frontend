import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-placeholder', imports: [RouterLink],
  templateUrl: './page-placeholder.html', styleUrl: './page-placeholder.scss',
})
export class PagePlaceholder {
  private readonly route = inject(ActivatedRoute);
  protected readonly title = this.route.snapshot.data['title'] as string;
  protected readonly description = this.route.snapshot.data['description'] as string;
}
