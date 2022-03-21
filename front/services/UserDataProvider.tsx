import { useEffect, useState, createContext, useContext } from "react";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import Shop from "../models/Shop";
import { stateContext } from "./StateProvider";
import { User } from "../models/User";
export const userDetailsContext = createContext(null);

const UserDataProvider = (props: { children: any }) => {
  const { addressQuery } = useContext(stateContext);
  const { pollInterval } = useContext(stateContext);

  const USER_DATA_QUERY = gql`
    query GetUser($query: String) {
      getCurrentUser {
        id
        name
        image
        dob
        gender
        email
        phone
        isAdmin
        verification
        addresses(query: $query) {
          id
          receiver
          phone
          address
          label
          city
          postalCode
          main
        }
        shop {
          id
          name
          slug
          image
          type
          slogan
          description
          openTime
          closeTime
          isOpen

          chats {
            id
            details {
              id
              content
              sender
              receiver
              createdAt
            }
            customer {
              id
              name
              image
            }
            shop {
              id
              name
              slug
              image
            }
          }

          products {
            id
            name
            images {
              image
            }
            discount
            price
            shop {
              id
              name
            }
          }
        }
        carts {
          quantity
          product {
            name
            price
            images {
              image
            }
          }
        }
        topay {
          balance
          coin
        }
        transactions {
          id
          date
          status
          shop {
            name
            type
            slug
            image
          }
          shipment {
            id
            name
            price
            duration
          }
          address {
            id
            receiver
            phone
            address
            label
            city
            postalCode
            main
          }
          details {
            id
            quantity
            review {
              id
              images {
                image
              }
              rating
              message
              anonymous
            }
            product {
              id
              name
              price
              discount
              images {
                image
              }
              shop {
                id
                name
                image
                slug
              }
            }
            transaction {
              id
              date
            }
          }
        }
        chats {
          id
          details {
            id
            content
            sender
            receiver
            createdAt
          }
          customer {
            id
            name
            image
          }
          shop {
            id
            name
            slug
            image
          }
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(USER_DATA_QUERY, {
    pollInterval: pollInterval,
    variables: {
      query: addressQuery,
    },
  });

  return (
    <userDetailsContext.Provider value={data?.getCurrentUser}>
      {props.children}
    </userDetailsContext.Provider>
  );
};

export default UserDataProvider;
