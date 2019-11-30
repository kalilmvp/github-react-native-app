import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import { PropTypes } from 'prop-types';

export default class FavoriteRepository extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('starredRepo').name,
  });

  render() {
    const { navigation } = this.props;
    const starredRepository = navigation.getParam('starredRepo');

    return (
      <WebView
        source={{ uri: starredRepository.html_url }}
        style={{ flex: 1 }}
      />
    );
  }
}

FavoriteRepository.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    getParam: PropTypes.func,
  }).isRequired,
};
