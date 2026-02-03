import React from "react";
import OrderCompleteShell from "@/app/order/complete/[orderId]/OrderCompleteShell";
import FullWidthSection from "@/components/layout/FullWidthSection";

const OrderCompletePage = () => {
  return (
    <FullWidthSection>
      <OrderCompleteShell />
    </FullWidthSection>
  );
};

export default OrderCompletePage;
