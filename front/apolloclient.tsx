import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client'
import { getCookie } from 'cookies-next'
import  Router  from 'next/router'
import { onError } from '@apollo/client/link/error'
import { useToasts } from 'react-toast-notifications'

const token = getCookie('tokenid')
// const client = new ApolloClient({
//   uri: 'http://localhost:8080/query',
//   cache: new InMemoryCache(),
//   headers: token ? {authorization: `bearer ${token}`,} : {},
// })

const httpLink = new HttpLink({
  uri: 'https://tohopedia-app.herokuapp.com/query',
  // uri: 'http://localhost:8080/query',
  headers: token
    ? {
        Authorization: 'bearer ' + token,
      }
    : {},
})

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (networkError) {
    if (networkError.name == 'TypeError') {
      //  alert('Backend is down\n' + 'Network Error: ' + networkError.message)
       Router.reload()
    }
  }
})

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
})

export default client