import { createSchema } from '@keystone-next/keystone';
import { Role } from "./schemas/Role"
import { Product } from './schemas/Product';
import { User } from './schemas/User';
import { ProductImage } from './schemas/ProductImage';
import { OrderItem } from './schemas/OrderItem';
import { Order } from './schemas/Order';
import { CartItem } from './schemas/CartItem';


export const lists = createSchema({
  User, 
  Product, 
  ProductImage, 
  OrderItem, 
  Order, 
  CartItem,
  Role, 
});
