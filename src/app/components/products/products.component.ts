import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApiproductsService } from 'src/app/services/apiproducts.service';
import { Router } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ICategory } from 'src/app/ViewModels/ICategory';
import { IProduct } from 'src/app/ViewModels/IProduct';
import { IProductQuantity } from 'src/app/ViewModels/iproduct-quantity';
import { Store } from 'src/app/ViewModels/Store';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { UserAuthenService } from 'src/app/services/user-authen.service';
import { ImageComponent } from '../image/image.component';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnChanges {
  strore = new Store();
  date: Date = new Date()
  FilteredProd: IProduct[] = []
  IsPurshased: boolean;
  selectedCatID: number = 1
  prod: IProduct | undefined = undefined;
  newprod: IProduct | undefined = undefined;
  prdListOfCat: IProduct[] = [];
  @Input() receivedSelCatID: number = 0;
  @Output() onAddToCart: EventEmitter<IProductQuantity>;

  constructor(
    private ApiService: ApiproductsService
    , private router: Router

    , private matDialog: MatDialog
    , private Authen: UserAuthenService
    , private ApiProService: ApiproductsService
  ) {
    this.onAddToCart = new EventEmitter<IProductQuantity>();
    this.IsPurshased = true;

  }
  ngOnChanges(changes: SimpleChanges): void {

    console.log(this.receivedSelCatID);
    this.ApiService.getProductsByCatID(this.receivedSelCatID).subscribe(ProductList => { this.prdListOfCat = ProductList });

  }
  ngOnInit() {
    this.ApiService.getAllProducts().subscribe(ProductList => { this.prdListOfCat = ProductList });
  }
  public createImgPath = (serverPath: string) => {
    return `http://localhost:43128/${serverPath}`;
  }
  hide() {
    this.IsPurshased = !this.IsPurshased;
  }
  selected() {
    console.log(this.selectedCatID)
  }
  decrease(itemsCount: number, id: number) {
    this.ApiService.getProductByID(id).subscribe(prd => {
      this.prod = prd
      this.prod.quantity -= itemsCount;
      this.newprod = this.prod;
      this.ApiService.updatePro(this.newprod, id).subscribe(prd => { this.newprod = prd });
    });
  }
  AddToCartBtn(itemsCount: number, Prod: IProduct) {
    //if (this.Authen.ISUserloggedin == true) {
    if (itemsCount > 0 && itemsCount <= Prod.quantity) {
      let cartitems: IProductQuantity[] = []
      if ((localStorage.getItem("Cart")) != null) {
        cartitems = JSON.parse((localStorage.getItem("Cart")) as any);
      }
      let prodQuantity: IProductQuantity = {} as IProductQuantity
      prodQuantity.id = Prod.id;
      prodQuantity.count = itemsCount;
      prodQuantity.quantity = Prod.quantity;
      prodQuantity.name = Prod.name;
      prodQuantity.price = Prod.price
      prodQuantity.total = Prod.price * itemsCount
      cartitems.push(prodQuantity);
      localStorage.setItem("Cart", JSON.stringify(cartitems));
      this.ApiProService.IncreaseNOIinCart();

    }
  }
  /*else {
    alert("You should Login First to be able to add to Cart")
  }*/

  DeleteProduct(id: number) {
    var res = confirm("Confirm delete ?")
    if (res == true) {
      this.ApiService.deleteProduct(id).subscribe(prd => {
        this.router.navigate(['/Products'])
      });
    }
  }
  openDialog(Product: IProduct) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.height = '200px';

    dialogConfig.data = Product;
    this.matDialog.open(ProductDetailsComponent, dialogConfig);
  }
  openDialogImage(Product: IProduct) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.height = '200px';

    dialogConfig.data = Product;
    this.matDialog.open(ImageComponent, dialogConfig);
  }

}