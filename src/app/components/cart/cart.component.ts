import { isNgTemplate } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ApiproductsService } from 'src/app/services/apiproducts.service';
import { IProduct } from 'src/app/ViewModels/IProduct';
import { IProductQuantity } from 'src/app/ViewModels/iproduct-quantity';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  CartItemList: IProductQuantity[] = []
  TotalMoney: number = 0;
  constructor(private ApiService: ApiproductsService) { }
  ngOnInit(): void {
    if ((localStorage.getItem("cart")) != null) {
      this.CartItemList = JSON.parse((localStorage.getItem("Cart")) as any);
      this.CartItemList.forEach(item => {
        this.TotalMoney += item.total;
      })
    }
  }
  Decrease(prodQuantity: IProductQuantity) {
    if (prodQuantity.count > 1) {
      prodQuantity.count--;
      this.TotalMoney -= prodQuantity.price;
      prodQuantity.total -= prodQuantity.price;

      let cartitems: IProductQuantity[] = JSON.parse((localStorage.getItem("Cart")) as any);
      var SelectedItem = cartitems.find(pro => pro.id = prodQuantity.id);
      if (SelectedItem) {
        SelectedItem.count = SelectedItem.count - 1;
        SelectedItem.total -= SelectedItem.price;
        localStorage.setItem("Cart", JSON.stringify(cartitems));
      }
    }
  }
  Increase(prodQuantity: IProductQuantity) {
    if (prodQuantity.count < prodQuantity.quantity) {
      prodQuantity.count++;
      this.TotalMoney += prodQuantity.price;
      prodQuantity.total += prodQuantity.price;

      let cartitems: IProductQuantity[] = JSON.parse((localStorage.getItem("Cart")) as any);
      var SelectedItem = cartitems.find(pro => pro.id = prodQuantity.id);
      if (SelectedItem) {
        SelectedItem.count = SelectedItem.count + 1;
        SelectedItem.total += SelectedItem.price;
        localStorage.setItem("Cart", JSON.stringify(cartitems));
      }
    }
  }
  CheckOut() {
    var product: IProduct = {} as IProduct;
    this.CartItemList.forEach(item => {
      this.ApiService.getProductByID(item.id).subscribe(pro => {
        product.id = pro.id;
        product.catID = pro.catID;
        product.date = pro.date;
        product.img = pro.img;
        product.name = pro.name;
        product.price = pro.price;
        product.quantity = pro.quantity - item.count;
        this.ApiService.updatePro(product, item.id).subscribe(p => {
          this.CartItemList = [];
          localStorage.setItem("Cart", JSON.stringify(this.CartItemList));
          this.ApiService.DecreaseNOIinCart();
          alert("order Done Successfully")

        })
      })
    })
  }
  Remove(prod: IProductQuantity) {
    var result = confirm("Confirm Delete this item?")
    if (result) {
      var product = this.CartItemList.findIndex(i => i == prod);
      this.CartItemList.splice(product, 1);
      this.TotalMoney -= prod.total;
      let Cartitems: IProductQuantity[] = JSON.parse((localStorage.getItem("Cart")) as any);
      var index = Cartitems.findIndex(p => p.id == prod.id)
      Cartitems.splice(index, 1);
      localStorage.setItem("Cart", JSON.stringify(Cartitems));
      this.ApiService.DecreaseNOIinCart();

    }

  }
}
