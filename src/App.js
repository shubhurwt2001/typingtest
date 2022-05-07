import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
function App() {
  const [text, setText] = useState("");
  const [error, seterror] = useState(false);
  const [value, setValue] = useState("");
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(0);
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState(0);
  const startTyping = (e) => {
    seterror(false);
    const arr = e.target.value.split("");
    if (arr.length === 1 && started === false) {
      const newIntervalId = setInterval(() => {
        setTimer((prevCount) => prevCount + 1);
      }, 1000);
      setIntervalId(newIntervalId);
      setStarted(true);
    }
    if (arr.length > 0) {
      arr.map((value, index) => {
        if (value === text.split("")[index]) {
          setValue(arr.join(""));
        } else {
          seterror(true);
          setValue(arr.slice(0, -1).join(""));
        }
      });

      if (
        arr.length === text.split("").length &&
        arr[text.length - 1] === text.split("")[arr.length - 1]
      ) {
        clearInterval(intervalId);
        setIntervalId(0);
        setResult(
          Math.round((text.split(" ").length / (timer / 60)) * 100) / 100
        );
      }
    } else {
      setValue(null);
    }
  };
  useEffect(() => {
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
    fetchText();
  }, []);

  const fetchText = () => {
    axios
      .get("https://api.api-ninjas.com/v1/facts?limit=1", {
        headers: { "X-Api-Key": "p1i7rZR9PR6mvQvPBkkGaA==RSG4FD9BTmhMgX8t" },
      })
      .then((data) => {
        setText(data.data[0].fact);
      });
  };
  const resetAll = () => {
    setText("");
    fetchText();
    setTimer(0);
    setStarted(false);
    setValue("");
    clearInterval(intervalId);
    setIntervalId(0);
    setResult(0);
  };
  return (
    <div className="container">
      <div className="row parent-row">
        {result === 0 && (
          <div className="col-lg-8 offset-lg-2">
            <p className="seconds">
              <i class="fa-solid fa-clock"></i>&nbsp; {timer}
            </p>
            <p className="unselectable">{text !== "" ? text : "Loading..."}</p>
            <div className="form-group">
              <textarea
                name="typing"
                rows="3"
                className={`form-control ${error ? "error" : ""}`}
                onChange={(e) => startTyping(e)}
                value={value}
                onPaste={(e) => {
                  e.preventDefault();
                  alert("Nice Try! But copy paste is not allowed..xD");
                  return false;
                }}
                onCopy={(e) => {
                  e.preventDefault();
                  alert("Nice Try! But copy paste is not allowed..xD");
                  return false;
                }}
              ></textarea>
            </div>
            <div className="text-center w-100">
              <button className="btn btn-danger btn-lg" onClick={resetAll}>
                Reset
              </button>
            </div>
          </div>
        )}
        {result !== 0 ? (
          <div className="col-lg-8 offset-lg-2 text-center">
            <p>Your Typing Speed is</p>
            <h1>
              {result} <span className="text-danger">WPM</span>
            </h1>
            <button className="btn btn-danger btn-lg" onClick={resetAll}>
              Take Another Test
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default App;
