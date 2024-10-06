import React, { useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import "./styles.css";
import logo from "../../assets/images/PeerPrep Logo.png";
import { userLogin } from "../../api/user-service-api";

const Login: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // Manage modal visibility
  const [modalMessage, setModalMessage] = useState<string>(""); // Store the error message

  const onFinish = async (values: any) => {
    setLoading(true);
    const { email, password } = values;
    try {
      const response = await userLogin(email, password);
      console.log(response);
      if (response) {
        window.location.href = "/questions";
      } else {
        setLoading(false);
        showErrorModal("Login failed. Please check your credentials.");
      }
    } catch (error: any) {
      console.log(error);
      setLoading(false);
      showErrorModal("An error occurred. Please try again.");
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
    setLoading(false);
  };

  // Function to show the error modal
  const showErrorModal = (message: string) => {
    setModalMessage(message);
    setIsModalVisible(true); // Show the modal
  };

  // Function to handle modal close
  const handleModalClose = () => {
    setIsModalVisible(false);
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
            window.location.href = "/signup";
          }}
        >
          Sign up
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
              Login
            </p>
            <Form
              name="signup"
              initialValues={{ remember: true }}
              className="signup-form"
              style={{ width: "100%" }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              layout="vertical"
            >
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

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                  marginTop: 50,
                }}
              >
                <Form.Item style={{ width: "80%" }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      paddingTop: 20,
                      paddingBottom: 20,
                      width: "100%",
                      backgroundColor: "black",
                      borderRadius: 20,
                      marginRight: 20,
                      fontFamily: "Poppins",
                    }}
                    loading={loading}
                  >
                    Log in
                  </Button>
                </Form.Item>
                <p
                  style={{
                    alignSelf: "center",
                    marginTop: 5,
                    fontFamily: "Poppins",
                    fontSize: 12,
                  }}
                >
                  Don't have an account? <a href="/signup">Sign up!</a>
                </p>
                <p
                  style={{
                    alignSelf: "center",
                    marginTop: 5,
                    fontFamily: "Poppins",
                    fontSize: 12,
                  }}
                >
                  <a>Forgot your password?</a>
                </p>
              </div>
            </Form>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      <Modal
        title="Login Failed"
        open={isModalVisible}
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

export default Login;