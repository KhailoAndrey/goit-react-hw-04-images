import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  SearchHeader,
  SearchForm,
  SearchFormButton,
  SearchFormInput,
} from './Searchbar.styled';
import { FcSearch } from 'react-icons/fc';

const Searchbar = ({ createSearchText }) => {
  const [value, setValue] = useState('');

  const handleChange = ({ target: { value } }) => {
    setValue(value);
  };
  const handleSubmit = e => {
    e.preventDefault();
    createSearchText(value.trim());
  };

  return (
    <SearchHeader>
      <SearchForm onSubmit={handleSubmit}>
        <SearchFormButton type="submit">
          <FcSearch />
        </SearchFormButton>

        <SearchFormInput
          type="text"
          placeholder="Search images and photos"
          onChange={handleChange}
          value={value}
        />
      </SearchForm>
    </SearchHeader>
  );
};

export default Searchbar;

Searchbar.propTypes = {
  createSearchText: PropTypes.func.isRequired,
};
