import { useState, useEffect } from "react";
import { getAllTheatres, updateTheatre } from "../../api/theatre";
import { ShowLoading, HideLoading } from "../../redux/loaderSlice";
import { useDispatch } from "react-redux";
import { message, Button, Table } from "antd";

const TheatresTable = () => {
  const [theatres, setTheatres] = useState([]);
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllTheatres();

      if (response.success) {
        const allTheatres = response.theatres;
        setTheatres(
          allTheatres.map(function (item) {
            return { ...item, key: `theatre${item._id}` };
          })
        );
      } else {
        messageApi.open({
          type: "error",
          content: response.message,
        });
      }
      dispatch(HideLoading());
    } catch (err) {
      dispatch(HideLoading());
      messageApi.open({
        type: "error",
        content: err.message,
      });
    }
  };

  const handleStatusChange = async (theatre) => {
    try {
      dispatch(ShowLoading());
      let values = {
        ...theatres,
        id: theatre._id,
        isActive: !theatre.isActive,
      };
      const response = await updateTheatre(values);
      if (response.success) {
        messageApi.open({
          type: "success",
          content: response.message,
        });
        getData();
      }
      dispatch(HideLoading());
    } catch (err) {
      dispatch(HideLoading());
      messageApi.open({
        type: "error",
        content: err.message,
      });
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Owner",
      dataIndex: "owner",
      render: (text, data) => {
        return data.owner && data.owner.name;
      },
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status, data) => {
        if (data.isActive) {
          return "Approved";
        } else {
          return "Pending/ Blocked";
        }
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, data) => {
        return (
          <div className="d-flex align-items-center gap-10">
            {data.isActive ? (
              <Button onClick={() => handleStatusChange(data)}>Block</Button>
            ) : (
              <Button onClick={() => handleStatusChange(data)}>Approve</Button>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  // console.log(theatres.length > 0 && theatres);

  return (
    <>
      {contextHolder}
      {theatres && theatres.length > 0 && (
        <Table dataSource={theatres} columns={columns} />
      )}
    </>
  );
};

export default TheatresTable;
