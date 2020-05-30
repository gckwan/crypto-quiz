/** @format */

import React, { useState } from "react";
import ReactGA from "react-ga";
import { createGlobalStyle } from "styled-components";
import styled from "styled-components/macro";
import About from "./About";
import "./App.css";
import coins from "./content/coins";
import questions from "./content/questions";
import Home from "./Home";
import Quiz from "./Quiz";
import Results from "./Results";
import { Points } from "./types";

const WhiteboardBorder = createGlobalStyle`
  body {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    margin: 0;
    box-sizing: border-box;
    overflow-y: scroll;
  }
`;

const StyledApp = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 12px;
  text-align: left;
  max-width: 1100px;
  height: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  margin: 0 auto;
  position: relative;
  z-index: 0;
  overflow: hidden;
`;

const StyledResultsContainer = styled.div`
  background-color: white;
  text-align: left;
  max-width: 1100px;
  height: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  margin: 0 auto 2rem auto;
  position: relative;

  @media (min-width: 1100px) {
    min-height: 0;
    margin-top: 2rem;
  }
`;

const gaTracking =
  process.env.NODE_ENV === "production" ? "UA-167874833-1" : "UA-167874833-2";

ReactGA.initialize(gaTracking, {
  debug: true,
  titleCase: false,
  gaOptions: {
    siteSpeedSampleRate: 100,
  },
});

export default function App() {
  const [questionIndex, setIndex] = useState<number | undefined>(undefined);

  const initialScore = coins.reduce((score: Points, coin) => {
    score[coin] = 0;
    return score;
  }, {});

  const [score, setScore] = useState<Points>(initialScore);

  const startGame = () => setIndex(0);
  const onAnswer = (points: Points) => {
    Object.keys(points).forEach((coin) => {
      score[coin] = score[coin] + points[coin];
    });
    setScore(score);
    setIndex(questionIndex === undefined ? 0 : questionIndex + 1);
  };

  function restartGame() {
    setIndex(undefined);
    setScore(initialScore);
  }

  if (questionIndex === questions.length) {
    return (
      <div>
        <StyledResultsContainer>
          <WhiteboardBorder />
          <Results restartGame={restartGame} score={score} />
        </StyledResultsContainer>

        <StyledResultsContainer>
          <About />
        </StyledResultsContainer>
      </div>
    );
  }

  const getContents = () => {
    if (questionIndex === undefined) {
      return <Home startGame={startGame} />;
    } else {
      return (
        <Quiz score={score} questionIndex={questionIndex} onAnswer={onAnswer} />
      );
    }
  };

  return (
    <StyledApp>
      <WhiteboardBorder />
      {getContents()}
    </StyledApp>
  );
}