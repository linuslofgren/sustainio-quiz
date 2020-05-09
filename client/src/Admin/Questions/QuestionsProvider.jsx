import React from 'react';
import { Switch, Route } from 'react-router-dom'
import QuestionsList from './QuestionsList'
import QuestionDetails from './QuestionDetails/QuestionDetails'

const QuestionProvider = ({match}) => {
  return (
    <Switch>
      <Route path={match.url + '/:questionId'}>
        <QuestionDetails />
      </Route>
      <Route>
        <QuestionsList />
      </Route>
    </Switch>
  );
}

export default QuestionProvider;
