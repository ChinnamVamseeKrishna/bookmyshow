import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ userEmail, book }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        receipt_email: userEmail,
      },
      redirect: "if_required",
    });
    if (result.error) {
      messageApi.open({
        type: "error",
        content: result.error.message,
      });
    } else if (result.paymentIntent?.status === "succeeded") {
      messageApi.open({
        type: "success",
        content: "Payment Successful!",
      });
      setTimeout(() => {
        book(); // Call your booking function
      }, 1000);
      setTimeout(() => {
        navigate("/success");
      }, 2000);
    }
  };

  return (
    <>
      {contextHolder}
      <form onSubmit={handleSubmit}>
        <div style={{ width: "100%" }}>
          <PaymentElement />
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Pay Now
          </Button>
        </div>
      </form>
    </>
  );
};

export default CheckoutForm;
