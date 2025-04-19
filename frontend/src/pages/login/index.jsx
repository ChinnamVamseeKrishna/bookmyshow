import React from "react";
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from "../../api/users";

function Login() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const onFinish = async (values) => {
    const { email, password } = values;
    try {
      const { status, errorMessage, data } = await LoginUser({
        email,
        password,
      });

      if (status === 200) {
        messageApi.open({ type: "success", content: "Login successful!" });
        localStorage.setItem("token", data?.data);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        messageApi.open({ type: "error", content: errorMessage });
      }
    } catch (error) {
      messageApi.open({ type: "error", content: "Login failed!" });
    }
  };

  return (
    <>
      {contextHolder}
      <main className="App-header">
        <h1>Login to BookMyShow</h1>
        <section className="mw-500 text-center px-3">
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Email"
              htmlFor="email"
              name="email"
              className="d-block"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input type="text" placeholder="Enter your email" id="email" />
            </Form.Item>
            <Form.Item
              label="Password"
              htmlFor="password"
              name="password"
              className="d-block"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input
                type="password"
                placeholder="Enter your password"
                id="password"
              />
            </Form.Item>
            <Form.Item className="d-block">
              <Button
                type="primary"
                block
                htmlType="submit"
                style={{ fontSize: "1rem", fontWeight: "600" }}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
          <div>
            <p>
              New User ? <Link to="/register">Register Here</Link>
            </p>
            <p>
              Forgot Password? <Link to="/forgot">Click Here</Link>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

export default Login;
