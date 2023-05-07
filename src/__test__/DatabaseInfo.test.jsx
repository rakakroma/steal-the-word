import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import {
  ContextListContext,
  WordListContext,
} from '../pages/Options/allContext';
import { CountBox } from '../pages/Options/components/DatabaseInfo';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

describe('CountBox component', () => {
  it('renders the correct number of words and contexts', () => {
    const wordList = Array(10).fill('');
    const contextList = Array(200).fill('');

    const { getByText } = render(
      <WordListContext.Provider value={wordList}>
        <ContextListContext.Provider value={contextList}>
          <CountBox />
        </ContextListContext.Provider>
      </WordListContext.Provider>
    );

    const wordCountElement = getByText('10');
    expect(wordCountElement).toBeInTheDocument();

    const contextCountElement = getByText('200');
    expect(contextCountElement).toBeInTheDocument();
  });
});
