import React from 'react';
import QuestionCard from '../Admin/Questions/QuestionCard/QuestionCard'
import { action } from '@storybook/addon-actions';
import '../index.css'
export default {
  title: 'QuestionCard',
  component: QuestionCard
};

export const Text = () => <QuestionCard
  text="What are the main gases responsible for the Greenhouse Effect?"
  answers={[{text: "Water and ozone"}, {text: "Oxygen and nitrous oxide, Oxygen and nitrous oxide, Oxygen and nitrous oxide"}, {text: "Carbon dioxide and methane"}, {text: "Chlorofluorocarbons"}]}
/>;
