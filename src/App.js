import "./App.css";

import { Component } from "react";
import CapsuleItem from "./components/CapsuleItems";
import { CiSearch } from "react-icons/ci";

class App extends Component {
  state = { data: [], searchText: `` };

  onChangeInputText = (e) => {
    this.setState({
      searchText: e.target.value,
    });
  };

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    const { searchText } = this.state;
    const queryParameter = searchText === "" ? "paracetamol" : searchText;
    try {
      const url = `https://backend.cappsule.co.in/api/v1/new_search?q=${queryParameter}&pharmacyIds=1,2,3`;
      const options = {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      };
      const response = await fetch(url, options);
      const responseData = await response.json();
      if (response.ok === true) {
        this.setState({
          data: responseData.data.saltSuggestions,
        });
      }
    } catch (e) {
      console.log("Error", e);
    }
  };

  onClickSearch = () => {
    this.getData();
  };

  onKeyDownEvent = (e) => {
    console.log("event key=", e.key);
    if (e.key === "Enter") {
      this.getData();
    }
  };

  render() {
    const { data, searchText } = this.state;

    return (
      <div className="App">
        <header className="main-container">
          <h1 className="heading">Cappsule web development test</h1>
          <section className="section-container">
            <div className="search-container">
              <CiSearch className="search-icon" />
              <input
                type="search"
                placeholder="Type your medicine name here"
                onChange={this.onChangeInputText}
                value={searchText}
                onKeyDown={this.onKeyDownEvent}
              />
              <button type="button" onClick={this.onClickSearch}>
                search
              </button>
            </div>
            <hr />
          </section>
        </header>
        <main>
          {data.length === 0 ? (
            <h1> Find medicines with amazing discount </h1>
          ) : (
            <ul>
              {data.map((each) => (
                <CapsuleItem key={each.id} eachItem={each} />
              ))}
            </ul>
          )}
        </main>
      </div>
    );
  }
}

export default App;
