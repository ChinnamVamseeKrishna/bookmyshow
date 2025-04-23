import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { GetCurrentUser, logoutUser } from "../api/users";
import { ShowLoading, HideLoading } from "../redux/loaderSlice";
import { SetUser } from "../redux/userSlice";
import { message, Layout, Menu } from "antd";

function ProtectedRoute({ children }) {
  const [messageApi, contextHolder] = message.useMessage();

  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navItems = [
    {
      label: "Home",
      key: "/home",
      icon: <HomeOutlined />,
      onClick: () => {
        navigate("/");
      },
    },
    {
      label: `${user?.name}`,
      key: "/user",
      icon: <UserOutlined />,
      children: [
        {
          label: <span>My Profile</span>,
          key: "/user/profile",
          icon: <ProfileOutlined />,
          onClick: () => {
            if (user?.role === "admin") {
              navigate("/admin");
            } else if (user?.role === "partner") {
              navigate("/partner");
            } else {
              navigate("/profile");
            }
          },
        },
        {
          label: "Logout",

          key: "/user/logout",
          icon: <LogoutOutlined />,
          onClick: async () => {
            const logoutResponse = await logoutUser();
            if (logoutResponse.success) {
              messageApi.open({
                type: "success",
                content: "Logged out",
              });
            } else {
              messageApi.open({
                type: "error",
                content: "Logout failed",
              });
            }
            navigate("/login");
          },
        },
      ],
    },
  ];

  const { Header, Footer, Sider, Content } = Layout;

  const getValidUser = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetCurrentUser();
      if (!response?.success) {
        messageApi.open({
          type: "error",
          content: response?.message,
        });
        navigate("/login");
      }
      dispatch(SetUser(response.data));
      dispatch(HideLoading());
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getValidUser();
  }, []);

  return (
    <>
      {contextHolder}
      {user && (
        <>
          <Layout>
            <Header
              className="d-flex justify-content-between"
              style={{
                position: "sticky",
                top: 0,
                zIndex: 1,
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <h3
                style={{ color: "white" }}
                className="demo-logo text-white m-0"
              >
                Book My Show
              </h3>
              <Menu theme="dark" mode="horizontal" items={navItems}></Menu>
            </Header>
            <div
              style={{ padding: "24px", minHeight: 300, background: "#fff" }}
            >
              {children}
            </div>
          </Layout>
        </>
      )}
    </>
  );
}
export default ProtectedRoute;
