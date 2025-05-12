import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from 'expo-constants';

const { API_BASE_URL_QUERY } = Constants.expoConfig.extra;

const httpLink = createHttpLink({
  uri: API_BASE_URL_QUERY,
});

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem("authToken");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;