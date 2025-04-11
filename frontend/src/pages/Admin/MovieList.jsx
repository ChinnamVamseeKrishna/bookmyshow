import { Button, Table } from "antd";
import MovieForm from "./MovieForm";
import { ShowLoading, HideLoading } from "../../redux/loaderSlice";
import { getAllMovies } from "../../api/movie";
import { useDispatch } from "react-redux";
import moment from "moment";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import DeleteMovieModal from "./DeleteMovieModal";
import React from "react";

function MovieList() {
  const fakeMovies = [
    {
      key: "1",
      poster: "image1.jpg",
      name: "Inside Out 2",
      description: "A movie about emotions",
      duration: 120,
      genre: "Animation",
      language: "English",
      releaseDate: "2024-06-14",
    },
    {
      key: "2",
      poster: "image2.jpg",
      name: "Anatomy of a Fall",
      description: "Thrilling murder mystery",
      duration: 120,
      genre: "Thriller",
      language: "English",
      releaseDate: "2024-06-14",
    },
  ];
  const tableHeading = [
    {
      title: "Poster",
      dataIndex: "poster",
      render: (text, data) => {
        return (
          <img
            width={"75"}
            height={"115"}
            style={{ objectFit: "cover" }}
            src={data?.poster}
          />
        );
      },
    },
    {
      title: "Movie Name",
      dataIndex: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Duration ",
      dataIndex: "duration",
      render: (text, data) => {
        return `${text} Mins`;
      },
    },
    {
      title: "Genre",
      dataIndex: "genre",
    },
    {
      title: "Language",
      dataIndex: "language",
    },
    {
      title: "Release Date",
      dataIndex: "releaseDate",
      render: (text, data) => {
        return moment(data?.releaseDate).format("DD-MM-YYYY");
      },
    },
    {
      title: "Action",
      render: (text, data) => {
        return (
          <div>
            <Button>
              <EditOutlined
                onClick={() => {
                  setSelectedMovie(data);
                  setFormType("edit");
                  setIsModalOpen(true);
                }}
              />
            </Button>
            <Button>
              <DeleteOutlined
                onClick={() => {
                  setSelectedMovie(data);
                  setFormType("delete");
                  setIsDeleteModalOpen(true);
                }}
              />
            </Button>
          </div>
        );
      },
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movies, setMovies] = useState(fakeMovies);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [formType, setFormType] = useState("add");
  const [isdeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllMovies();
      if (response.success) {
        setMovies(
          response.movies?.map((item) => {
            return {
              ...item,
              key: `movie${item._id}`,
            };
          })
        );
      } else {
        console.log(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="d-flex justify-content-end">
        <Button
          onClick={() => {
            setIsModalOpen(true);
            setFormType("add");
          }}
          type="primary"
        >
          Add Movie
        </Button>
        <Table dataSource={movies} columns={tableHeading} />
        {isModalOpen && (
          <MovieForm
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            formType={formType}
            selectedMovie={selectedMovie}
            setSelectedMovie={setSelectedMovie}
            getData={getData}
          />
        )}
        {isdeleteModalOpen && (
          <DeleteMovieModal
            isDeleteModalOpen={isdeleteModalOpen}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
            selectedMovie={selectedMovie}
            getData={getData}
            setSelectedMovie={setSelectedMovie}
          />
        )}
      </div>
    </>
  );
}

export default MovieList;
