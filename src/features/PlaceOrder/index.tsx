import { PlaceOrderForm } from "features/PlaceOrder/components/PlaceOrderForm/PlaceOrderForm";
import { StoreProvider } from "features/PlaceOrder/store/context";

export const PlaceOrder = () => (
  <StoreProvider>
    <PlaceOrderForm />
  </StoreProvider>
);
