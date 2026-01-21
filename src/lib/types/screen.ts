

import { Member } from "./member";
import { Order } from "./orders";
import { Product } from "./product";


/** REACT APP STATE */


export interface AppRootState{
    homePage: HomePageState;
    productsPage: ProductsPageState;
    ordersPage: OrdersPageState;
}


/** HOMEPAGE */
export interface HomePageState{
    popularDishes: Product[],
    newDishes: Product[],
    topUsers: Member[],
}

/** PRODUCTS */

export interface ProductsPageState{
    restaurant: Member | null,
    chosenProduct: Product | null,
    products: Product[],
}


/** ORDERS */

export interface OrdersPageState{
    pausedOrders:Order[],
    finishedOrders:Order[],
    processOrders:Order[],
}


