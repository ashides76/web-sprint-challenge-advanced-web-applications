// Import the Spinner component into this file and test
import React from "react";
import Spinner from "./Spinner"
// that it renders what it should for the different props it can take.
import { render } from '@testing-library/react';
import ArticleForm from './ArticleForm';
// test('sanity', () => {
//   expect(true).toBe(false)
// })

test('renders with create mode heading', () => {
  const { getByText } = render(<ArticleForm />);
  const headingElement = getByText('Create Article');
  expect(headingElement).toBeTruthy();
});

test('does not render spinner when "on" prop is false', () => {
  const { container } = render(<Spinner on={false} />);
  const spinnerElement = container.querySelector('.spinner');
  expect(spinnerElement).toBeNull();
});

