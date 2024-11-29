import { useEffect, useState } from "react";
import axios from "axios";

function Search() {
  const [input, setInput] = useState();
  const [params, setParams] = useState("search");
  const [data, setData] = useState([]);

  const getSubmissions = async (data) => {
    const submissions = `http://localhost:5050/submissions${params}`;

    console.log("url =====> ", submissions);

    try {
      const response = await axios.get(submissions, data);
      console.log("Response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleSubmit = async (e) => {
    const data = {
      mobile_number: input,
    };

    const res = await getSubmissions(data);

    if (!res) {
      console.error("err");
    }

    setData(res.data);

    console.log(res.data);
  };

  const handleChange = async (e) => {
    const { value } = e.target;
    console.log(value);
    setInput(value);

    const params = new URLSearchParams({
      mobile_number: value,
    });
    const url = `?${params.toString()}`;

    setParams(url);
    console.log(url);
    window.history.pushState({}, "", url);
  };

  useEffect(() => {}, []);

  return (
    <div className="search__container">
      <div className="container">
        <div className="search__wrapper">
          <input
            value={input}
            onChange={handleChange}
            type="text"
            className="search__input"
            placeholder="search.."
          />
          <button onClick={handleSubmit} className="btn search__btn">
            Submit
          </button>
        </div>

        <div className="data__container">
          {data.map((i) => {
            return (
              <div className="item">
                <p className="name">
                  Name: <span className="name__span">{i.name}</span>
                </p>
                <p className="mobile_number">
                  Mobile Number:{" "}
                  <span className="mobile-number__span">
                    {i.mobile_number}
                  </span>
                </p>
                <p className="email">
                  Email: <span className="email__span">{i.email}</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Search;
