import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import { AppMain } from './App.styled';

export function App() {
  const [searchText, setSearchText] = useState('');

  const createSearchText = searchText => {
    setSearchText(searchText);
  };
  return (
    <AppMain>
      <Toaster />
      <Searchbar createSearchText={createSearchText} />
      <ImageGallery searchText={searchText} />
    </AppMain>
  );
}
