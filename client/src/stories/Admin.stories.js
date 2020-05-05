import React from 'react';
import Admin from '../Admin/Admin'
import { action } from '@storybook/addon-actions';
import '../index.css'

export default {
  title: 'Admin',
  component: Admin
};

export const Text = () => <Admin/>;
