import React, { Component } from "react";
import MagicDropZone from "react-magic-dropzone";

import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      model: null,
      preview: "",
      predictions: []
    };
  }

  componentDidMount() {
    mobilenet.load().then(model => {
      this.setState({ model });
    });
  }

  onImgDrop = (accepted, rejected, links) => {
    this.setState({ preview: accepted[0].preview });
  };

  onImgLoad = e => {
    this.state.model.classify(e.target).then(predictions => {
      this.setState({ predictions });
    });
  };

  render() {
    const { preview, predictions } = this.state;

    return (
      <div className="App">
        <div className="desc">
          <p className="title">Image Prediction</p>
          <p className="body">
            with <span>@tensorflow/tfjs</span> and{" "}
            <span>@tensorflow-models/mobilenet</span>
          </p>
        </div>
        <MagicDropZone
          className="magic-dropzone"
          accept="image/jpeg, image/png, .jpg, .jpeg, .png"
          onDrop={this.onImgDrop}
        >
          <div className="dropzone-content">
            {preview ? (
              <img src={preview} onLoad={this.onImgLoad} alt="dropped" />
            ) : (
              <p>Drop your image here</p>
            )}
          </div>
        </MagicDropZone>
        <div className="prediction-content">
          {predictions &&
            predictions.map((prediction, index) => {
              const percentProb =
                Math.round(prediction.probability * 100 * 100) / 100;

              return (
                <div
                  className="box-content"
                  key={`${index}-${prediction.probability}`}
                >
                  <div className="name-content">{prediction.className}</div>
                  <div className="prob-content">
                    <div className="bar-bg">
                      <div
                        className="bar-main"
                        style={{
                          width: `${percentProb}%`,
                          transitionDuration: "5s"
                        }}
                      />
                    </div>
                    <span>{percentProb}%</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

export default App;
