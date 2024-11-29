import { useEffect, useState } from "react";
import axios from "axios"

const getSubmissions = async (data) => {
  const submissions = "http://localhost:5050/submissions";

  try {
    const response = await axios.post(submissions, data);
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }
};

function Search() {
  const [input, setInput] = useState();

  const handleSubmit = async (e) => {
    const data = {
      mobile_number: input,
    };

    const res = getSubmissions(data);
    if (!res) {
      console.error("err");
    }

    console.log(res);
  };

  useEffect(() => {}, []);

  return (
    <div className="search__container">
      <div className="search__wrapper">
        <input
          value={input}
          onChange={(e) => {
            const { value } = e.target;
            console.log(value);
            setInput(value);
          }}
          type="text"
          className="search__input"
          placeholder="search.."
        />
        <button onClick={handleSubmit} className="btn search__btn">
          Submit
        </button>
      </div>
    </div>
  );
}

export default Search;
