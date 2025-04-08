import React from "react";
import { Button, Form, Input, message } from "antd";
import { Link } from "react-router-dom";
import { RegisterUser } from "../../api/users";

function Register() {
  const [messageApi, contextHolder] = message.useMessage();
  const onFinish = async (values) => {
    try {
      const { status, errorMessage } = await RegisterUser(values);
      if (status === 201) {
        messageApi.open({
          type: "success",
          content: "Registration successful!",
        });
      } else {
        messageApi.open({
          type: "error",
          content: errorMessage,
        });
      }
    } catch (error) {
      console.log(error);
      messageApi.open({
        type: "error",
        content: "Registration failed!",
      });
    }
  };

  return (
    <>
      {contextHolder}
      <main className="App-header">
        <h1>Register to BookMyShow</h1>
        <section className="mw-500 text-center px-3">
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Name"
              htmlFor="name"
              name="name"
              className="d-block"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input type="text" placeholder="Enter your name" id="name" />
            </Form.Item>
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
                type="text"
                placeholder="Enter your password"
                id="password"
              />
            </Form.Item>
            <Form.Item className="d-block">
              <Button type="primary" block htmlType="submit">
                Register
              </Button>
            </Form.Item>
          </Form>
          <div>
            <p>
              Already have an account? <Link to="/login">Login Here</Link>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

export default Register;
