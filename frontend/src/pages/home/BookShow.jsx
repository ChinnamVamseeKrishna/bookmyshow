import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loaderSlice";
import { getShowById } from "../../api/show";
import { useNavigate, useParams } from "react-router-dom";
import { message, Card, Row, Col, Button, Modal } from "antd";
import moment from "moment";
import { bookShow, makePayment } from "../../api/booking";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(
  "pk_test_51RD3IZR5b4XykZro2WtnjdwinSKF9rOYgS6fRKRVwbkgjAd8UYDDHFlY8JPVEOE4SOlnwRgXrmaMACcXUgwiVO5d00bhXukwFc"
);

const BookShow = () => {
  // Redux state and hooks
  const { user } = useSelector((state) => state.user); // Extracting user from Redux state
  const dispatch = useDispatch(); // Redux dispatch function
  const [messageApi, contextHolder] = message.useMessage();
  const [show, setShow] = useState(); // State for holding show details
  const [selectedSeats, setSelectedSeats] = useState([]); // State for managing selected seats
  const params = useParams(); // Extracting URL parameters
  const navigate = useNavigate(); // Navigation hook
  const [transactionId, setTransactionId] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);

  // Function to fetch show data by ID
  const getData = async () => {
    try {
      dispatch(ShowLoading()); // Dispatching action to show loading state
      const response = await getShowById(params.id); // API call to fetch show details
      if (response.success) {
        setShow(response.data); // Setting state with fetched show data
      } else {
        messageApi.open({
          type: "error",
          content: response.message,
        });
      }
      dispatch(HideLoading()); // Dispatching action to hide loading state
    } catch (err) {
      messageApi.open({
        type: "error",
        content: err.message,
      });
      dispatch(HideLoading()); // Hiding loading state on error
    }
  };

  // Function to generate seat layout dynamically
  const getSeats = () => {
    let columns = 12; // Number of columns for seating arrangement
    let totalSeats = show.totalSeats; // Total number of seats
    let rows = Math.ceil(totalSeats / columns); // Calculating number of rows

    return (
      <div className="d-flex flex-column align-items-center">
        <div className="w-100 max-width-600 mx-auto mb-25px">
          <p className="text-center mb-10px">
            Screen this side, you will be watching in this direction
          </p>
          <div className="screen-div">
            {/* Placeholder for screen display */}
          </div>
        </div>
        <ul
          className="seat-ul justify-content-center"
          style={{ marginLeft: "25%" }}
        >
          {Array.from(Array(rows).keys()).map(
            (
              row // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            ) =>
              // Mapping rows
              Array.from(Array(columns).keys()).map((column) => {
                let seatNumber = (row * columns + column + 1).toString(); // Calculating seat number

                let seatClass = "seat-btn"; // Default class for seat button
                if (selectedSeats.includes(seatNumber)) {
                  seatClass += " selected"; // seat-btn selected Adding 'selected' class if seat is selected
                }
                if (show.bookedSeats.includes(seatNumber)) {
                  seatClass += " booked"; // Adding 'booked' class if seat is already booked
                }
                if (seatNumber <= totalSeats) {
                  // Rendering seat button if seat number is valid
                  return (
                    <li key={seatNumber}>
                      {/* Key added for React list rendering optimization */}
                      <button
                        className={seatClass}
                        onClick={() => {
                          if (!show.bookedSeats.includes(seatNumber)) {
                            // Function to handle seat selection/deselection
                            if (selectedSeats.includes(seatNumber)) {
                              setSelectedSeats(
                                selectedSeats.filter(
                                  (curSeatNumber) =>
                                    curSeatNumber !== seatNumber
                                )
                              );
                            } else {
                              setSelectedSeats([...selectedSeats, seatNumber]);
                            }
                          }
                        }}
                      >
                        {seatNumber}
                      </button>
                    </li>
                  );
                }
              })
          )}
        </ul>

        <div className="d-flex bottom-card justify-content-between w-100 max-width-600 mx-auto mb-25px mt-3">
          <div className="flex-1">
            Selected Seats: <span>{selectedSeats.join(", ")}</span>
          </div>
          <div className="flex-shrink-0 ms-3">
            Total Price:{" "}
            <span>Rs. {selectedSeats.length * show.ticketPrice}</span>
          </div>
        </div>
      </div>
    );
  };

  // Effect hook to fetch data on component mount
  useEffect(() => {
    getData();
  }, []);

  const book = async () => {
    try {
      const response = await bookShow({
        user: user._id,
        show: show._id,
        seats: selectedSeats,
        transactionId: transactionId,
      });
      if (response.success) {
        messageApi.open({
          type: "success",
          content: "Booking successful",
        });
      } else {
        messageApi.open({
          type: "error",
          content: "Booking failed",
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Error creating booking",
      });
    }
  };

  const fetchClientSecret = async () => {
    const response = await makePayment(
      selectedSeats.length * show.ticketPrice * 100
    );
    setTransactionId(response?.transactionId);
    setClientSecret(response?.clientSecret);
    setShowCheckout(true);
    return response?.clientSecret;
  };

  // JSX rendering
  return (
    <>
      {contextHolder}
      {show && (
        <Row gutter={24}>
          <Col span={24}>
            <Card
              title={
                <div className="movie-title-details">
                  <h1>{show.movie.title}</h1>
                  <p>
                    Theatre: {show.theatre.name}, {show.theatre.address}
                  </p>
                </div>
              }
              extra={
                <div className="show-name py-3">
                  <h3>
                    <span>Show Name:</span> {show.name}
                  </h3>
                  <h3>
                    <span>Date & Time: </span>
                    {moment(show.date).format("MMM Do YYYY")} at{" "}
                    {moment(show.time, "HH:mm").format("hh:mm A")}
                  </h3>
                  <h3>
                    <span>Ticket Price:</span> Rs. {show.ticketPrice}/-
                  </h3>
                  <h3>
                    <span>Total Seats:</span> {show.totalSeats}
                    <span> &nbsp;|&nbsp; Available Seats:</span>{" "}
                    {show.totalSeats - show.bookedSeats.length}
                  </h3>
                </div>
              }
              style={{ width: "100%" }}
            >
              {getSeats()} {/* Rendering dynamic seat layout */}
              {selectedSeats.length > 0 && (
                <>
                  <div className="max-width-600 mx-auto">
                    <Button
                      onClick={() => {
                        fetchClientSecret();
                      }}
                      type="primary"
                      shape="round"
                      size="large"
                      block
                    >
                      Checkout
                    </Button>
                  </div>
                </>
              )}
              <Modal
                open={showCheckout}
                footer={null}
                centered
                closable={true}
                onCancel={() => setShowCheckout(false)}
                onClose={() => setShowCheckout(false)}
              >
                {clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm userEmail={user?.email} book={book} />
                  </Elements>
                ) : (
                  <div style={{ textAlign: "center", padding: "0px 10px" }}>
                    <p>Loading payment options...</p>
                  </div>
                )}
              </Modal>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default BookShow;
