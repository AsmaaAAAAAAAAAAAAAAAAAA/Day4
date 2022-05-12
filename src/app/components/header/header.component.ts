import { Component, OnInit } from '@angular/core';
import { ApiproductsService } from 'src/app/services/apiproducts.service';
import { UserAuthenService } from 'src/app/services/user-authen.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  IsUserLogged: boolean = false;;
  public totalitem: number = 0;
  constructor(private UserAuthenticationService: UserAuthenService
    , private ApiProServie: ApiproductsService) {

  }
  ngOnInit() {
    this.ApiProServie.GetCartItemsCounts().subscribe(number => { this.totalitem = number });
    this.UserAuthenticationService.getStatusLoging().subscribe(status => {
      this.IsUserLogged = status;

    });
  }
}

