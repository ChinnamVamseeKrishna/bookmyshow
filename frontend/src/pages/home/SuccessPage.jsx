import { Result, Button } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-white"
    >
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-xl w-full">
        <Result
          icon={<SmileOutlined style={{ color: "#52c41a" }} />}
          title="Booking Confirmed!"
          subTitle="Your movie tickets have been successfully booked. Check your email for confirmation."
          extra={
            <Button
              type="primary"
              shape="round"
              size="large"
              onClick={() => navigate("/profile")}
            >
              Go to My Bookings
            </Button>
          }
        />
      </div>
    </motion.div>
  );
};

export default SuccessPage;
