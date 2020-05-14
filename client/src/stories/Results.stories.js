import React from 'react';
import Results from '../Quiz/QuizRunner/Finish/Results'
import { action } from '@storybook/addon-actions';
import '../index.css'
export default {
  title: 'Results',
  component: Results
};

export const Text = () => <Results
  questionnaire={{
    fullQuestions: [
      {
        text: "Q1",
        answers: [
          {
            text: "a1",
            _id: "11",
            correct: true
          },
          {
            text: "a1",
            _id: "12",
            correct: false
          }
        ]
      },
      {
        text: "Q1",
        answers: [
          {
            text: "a1",
            _id: "11"
          },
          {
            text: "a1",
            _id: "12"
          }
        ]
      },
      {
        text: "Q2",
        answers: [
          {
            text: "a1",
            _id: "21",
            correct: true
          },
          {
            text: "a1",
            _id: "22",
            correct: false
          }
        ]
      },
      {
        text: "Q3",
        answers: [
          {
            text: "a1",
            _id: "31",
            correct: false
          },
          {
            text: "a1",
            _id: "32",
            correct: true
          }
        ]
      }
    ]
  }}
  answers={[
    "11",
    "21",
    "31"
  ]}
/>;
