import { ApolloClient, InMemoryCache } from '@apollo/client'
import { getCookie } from 'cookies-next'

const token = getCookie('tokenid')

const client = new ApolloClient({
  uri: 'http://localhost:8080/query',
  cache: new InMemoryCache(),
  headers: token ? {authorization: `bearer ${token}`,} : {},
})
console.log(token ? `bearer ${token}` : "No")

export default client