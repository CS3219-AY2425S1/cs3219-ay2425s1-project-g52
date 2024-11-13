import React, { useState } from "react";
import { Button, Form, Input, Checkbox, Modal } from "antd";
import "./styles.css";
import logo from "../../assets/images/PeerPrep Logo.png";
import { userSignUp } from "../../api/user-service-api";

const SignUp: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const onFinish = async (values: any) => {
    const { username, email, password } = values;
    setLoading(true);
    try {
      const response = await userSignUp(username, email, password);
      if (response?.status === 201) {
        setIsSuccess(true);
        setModalMessage(
          "Sign-up successful! Please login with your newly created account"
        );
        setIsModalOpen(true);
      } else {
        setIsSuccess(false);
        setModalMessage(`Sign-up failed. ${response?.data?.message}.`);
        setIsModalOpen(true);
      }
    } catch (error: any) {
      console.log(error);
      setIsSuccess(false);
      setModalMessage("An error occurred during sign-up. Please try again.");
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (isSuccess) {
      window.location.href = "/";
    }
  };

  return (
    <div className="container">
      <div className="header">
        <Button
          style={{
            backgroundColor: "#1D192A",
            color: "white",
            borderRadius: 20,
            width: 75,
            height: 40,
          }}
          onClick={() => {
            window.location.href = "/";
          }}
        >
          Login
        </Button>
      </div>
      <div className="body">
        <div className="LHS">
          <p className="title">Prep with us</p>
          <p className="desc">
            Communicate live with a peer to ace common technical interview
            questions
          </p>
          <img src={logo} className="logo" alt=""></img>
        </div>
        <div className="RHS">
          <div className="signUpBox">
            <p className="title" style={{ color: "black" }}>
              Sign up now
            </p>
            <Form
              name="signup"
              initialValues={{ remember: true }}
              className="signup-form"
              onFinish={onFinish}
              autoComplete="off"
              layout="vertical"
            >
              {/* Username Field */}
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input placeholder="Enter your username" size="large" />
              </Form.Item>

              {/* Email Field */}
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "The input is not a valid email!" },
                ]}
              >
                <Input placeholder="Enter your email" size="large" />
              </Form.Item>

              {/* Password Field */}
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password
                  placeholder="Enter your password"
                  size="large"
                />
              </Form.Item>

              {/* Confirm Password Field */}
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The two passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="Confirm your password"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(
                            "Please agree to the terms and conditions"
                          ),
                  },
                ]}
              >
                <Checkbox
                  style={{
                    fontFamily: "Poppins",
                    fontSize: 11,
                  }}
                >
                  By creating an account, I am consenting to receive SMS
                  messages and emails, and agreeing to our Terms of use &amp;
                  Privacy Policy
                </Checkbox>
              </Form.Item>
              {/* Submit Button */}
              <div className="row-container">
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      paddingTop: 15,
                      paddingBottom: 15,
                      backgroundColor: "black",
                      borderRadius: 20,
                      marginRight: 20,
                      alignSelf: "center",
                    }}
                    loading={loading}
                  >
                    Sign Up
                  </Button>
                </Form.Item>
                <p
                  style={{
                    alignSelf: "flex-start",
                    marginTop: 5,
                    fontFamily: "Poppins",
                    fontSize: 12,
                  }}
                >
                  Already have an account? <a href="/">Log in</a>
                </p>
              </div>
            </Form>
          </div>
        </div>
      </div>

      {/* Success/Failure Modal */}
      <Modal
        title={isSuccess ? "Sign-up Successful" : "Sign-up Failed"}
        open={isModalOpen}
        onOk={handleModalClose}
        onCancel={handleModalClose}
        footer={[
          <Button key="ok" type="primary" onClick={handleModalClose}>
            OK
          </Button>,
        ]}
      >
        <p>{modalMessage}</p>
      </Modal>
    </div>
  );
};

export default SignUp;
