import React from 'react';
import {NavLink as Link, Switch, Route} from 'react-router-dom'
import '../App.css';
import './Admin.css'

import QuestionnairesProvider from './Questionnaires/QuestionnairesProvider'
import QuestionsProvider from './Questions/QuestionsProvider'

const Admin = () => {
  return <div className="admin-container">
    <div className="admin-navigation">
      <h2 className="admin-navigation-title">sustainio</h2>
      <ul className="admin-menu">
        <Link to="/admin" exact activeClassName="admin-menu-item-active"><li className="admin-menu-item">Dashboard</li></Link>
        <Link to="/admin/questions" activeClassName="admin-menu-item-active"><li className="admin-menu-item">Questions</li></Link>
        <Link to="/admin/questionnaires" activeClassName="admin-menu-item-active"><li className="admin-menu-item">Questionnaires</li></Link>
      </ul>
    </div>
    <div className="admin-content">
      <div className="admin-questions-container">
        <input placeholder="Seach for questions, answers or questionnaires" className="admin-questions-search-input"/>

        <Switch>
          <Route path="/admin/questions">
            <QuestionsProvider />
          </Route>
          <Route path="/admin/questionnaires" component={QuestionnairesProvider} />
        </Switch>
      </div>
    </div>

  </div>
}

export default Admin;
