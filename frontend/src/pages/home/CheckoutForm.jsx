import { PaymentElement, useCheckout } from "@stripe/react-stripe-js";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ userEmail, book }) => {
  const checkout = useCheckout();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await checkout.confirm({ email: userEmail });
    book();
    navigate("/");
    console.log(response);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ width: "100%" }}>
        <PaymentElement />
        <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
          Pay Now
        </Button>
      </div>
    </form>
  );
};

export default CheckoutForm;
