import { Modal, message } from "antd";
import { deleteMovie } from "../../api/movie";
import { ShowLoading, HideLoading } from "../../redux/loaderSlice";
import { useDispatch } from "react-redux";

const DeleteMovieModal = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  selectedMovie,
  getData,
  setSelectedMovie,
}) => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const handleOK = async () => {
    try {
      dispatch(ShowLoading());
      const response = await deleteMovie(selectedMovie._id);
      if (response.success) {
        messageApi.open({
          type: "success",
          content: response.message,
        });
        getData();
        setIsDeleteModalOpen(false);
        setSelectedMovie(null);
      } else {
        messageApi.open({
          type: "error",
          content: response.message,
        });
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      messageApi.open({
        type: "error",
        content: error.message,
      });
    }
  };
  const handleCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedMovie(null);
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Delete Movie"
        centered
        open={isDeleteModalOpen}
        onOk={handleOK}
        onCancel={handleCancel}
      >
        <p>Are you sure you want to delete this movie?</p>
        <p>
          <b>{selectedMovie?.name}</b>
        </p>
      </Modal>
    </>
  );
};

export default DeleteMovieModal;
