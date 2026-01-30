import Orders from "./OrderOnline";
import type { OrderOnlineProps } from "./OrderOnline";

function OrderOnlineWrapper(props: OrderOnlineProps) {
  return <Orders {...props} />;
}
export default OrderOnlineWrapper;
