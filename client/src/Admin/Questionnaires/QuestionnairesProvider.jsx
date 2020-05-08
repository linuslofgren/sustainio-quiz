import React from 'react';
import { Switch, Route } from 'react-router-dom'
import QuestionnairesList from './QuestionnairesList'
import QuestionnaireDetails from './QuestionnaireDetails/QuestionnaireDetails'

const QuestionnairesProvider = ({match}) => {
  return (
    <Switch>
      <Route path={match.url + '/:questionnaireId'}>
        <QuestionnaireDetails />
      </Route>
      <Route>
        <QuestionnairesList />
      </Route>
    </Switch>
  );
}

export default QuestionnairesProvider;
