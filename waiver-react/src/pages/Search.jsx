import React from "react";

function Search() {
  return (
    <div className="search__container">
      <div className="search__wrapper">
        <input type="text" className="search__input" placeholder="search.."/>
        <button className="btn search__btn">Submit</button>
      </div>
    </div>
  );
}

export default Search;
