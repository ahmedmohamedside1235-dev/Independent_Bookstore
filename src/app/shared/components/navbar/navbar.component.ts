import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ColorModeService } from '../../../core/services/color-mode.service';
import { EditTitlePipe } from '../../pipe/edit-title-pipe';
import { AnimationDirective } from '../../directives/animation.directive';
import { FlyToCartService } from '../../../core/services/bookServices/fly-to-cart.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, EditTitlePipe, AnimationDirective, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {

  private authService = inject(AuthService);
  private notification = inject(NotificationService);
  private flyToCartService = inject(FlyToCartService);
  private router = inject(Router);

  public user = this.authService.currentUser;
  public themeService = inject(ColorModeService);
  public userName = signal<string>("");
  public shortName = signal<string>("");

  public shelf = viewChild<ElementRef<HTMLLIElement>>('shelfCart');


  ngAfterViewInit() {
    let element = this.shelf()?.nativeElement;
    if (element) this.flyToCartService.registerShelfElement(element);
  }

  public logout() {
    this.authService.logout();
    this.notification.show('logout successfuly', 'success');
    this.router.navigate(['auth']);
  }
}
