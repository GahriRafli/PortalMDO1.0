import React from "react";

// ini contoh component yang menggunakan class
// biar ada sampel lain daripada arrow function
class ProblemCounter extends React.Component {
  constructor(props) {
    super();
    this.state = {
      counting: 0,
      end: props.end,
    };
  }

  counter = (end) => {
    for (let counting = 0; counting <= end; counting++) {
      setTimeout(() => {
        this.setState({ counting });
      }, 500);
    }
  };

  componentDidMount() {
    const end = this.state.end;
    this.counter(end);
  }

  render() {
    return this.state.counting;
  }
}

export default ProblemCounter;
