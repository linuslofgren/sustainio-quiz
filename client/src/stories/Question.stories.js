import React from 'react';
import Question from '../components/question/Question'
import { action } from '@storybook/addon-actions';
import '../index.css'
export default {
  title: 'Question',
  component: Question
};

export const Text = () => <Question
  text="What are the main gases responsible for the Greenhouse Effect?"
  answers={[{text: "Water and ozone"}, {text: "Oxygen and nitrous oxide, Oxygen and nitrous oxide, Oxygen and nitrous oxide"}, {text: "Carbon dioxide and methane"}, {text: "Chlorofluorocarbons"}]}
/>;
