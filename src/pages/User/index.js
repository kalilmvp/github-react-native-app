import React, { Component } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';
import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Loading,
} from './styles';

// import { Container } from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  state = {
    stars: [],
    page: 1,
    loading: false,
    refreshing: false,
  };

  async componentDidMount() {
    this.loadInitial();
  }

  loadInitial = async () => {
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    this.setState({ loading: true });

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({
      stars: response.data,
      loading: false,
      refreshing: false,
    });
  };

  loadNextPage = async page => {
    const { navigation } = this.props;
    const { stars } = this.state;
    const user = navigation.getParam('user');
    const response = await api.get(`/users/${user.login}/starred?page=${page}`);

    this.setState({ stars: [...stars, ...response.data], page });
  };

  refreshList = () => {
    this.setState(
      {
        stars: [],
        refreshing: true,
      },
      this.loadInitial
    );
  };

  handleNavigate = starredRepo => {
    const { navigation } = this.props;

    navigation.navigate('FavoriteRepository', { starredRepo });
  };

  render() {
    const { stars, page, loading, refreshing } = this.state;
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    return (
      <>
        <Container>
          <Header>
            <Avatar source={{ uri: user.avatar }} />
            <Name>{user.name}</Name>
            <Bio>{user.bio}</Bio>
          </Header>

          {loading ? (
            <Loading color="#7159c1" />
          ) : (
            <Stars
              data={stars}
              keyExtractor={star => String(star.id)}
              onEndReachedThreshold={0.2}
              onEndReached={() => this.loadNextPage(page + 1)}
              onRefresh={this.refreshList} // Função dispara quando o usuário arrasta a lista pra baixo
              refreshing={refreshing}
              renderItem={({ item }) => (
                <Starred onPress={() => this.handleNavigate(item)}>
                  <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                  <Info>
                    <Title>{item.name}</Title>
                    <Author>{item.owner.login}</Author>
                  </Info>
                </Starred>
              )}
            />
          )}
        </Container>
      </>
    );
  }
}

User.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    getParam: PropTypes.func,
  }).isRequired,
};
