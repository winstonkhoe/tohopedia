import { gql } from "@apollo/client";
import { Shop } from "./Shop";
import { Topay } from "./Topay";

class User {
  constructor(
    public id: string = "",
    public name: string = "",
    public email: string = "",
    public password: string = "",
    public phone: string = "",
    public gender: number = -1,
    public dob: string = "",
    public image: string = "",
    public isAdmin: boolean = false,
    public isSuspended: boolean = false,
    public requestUnsuspend: boolean = false,
    public emailVerified: boolean = false,
    public verification: number = -1,
    public shop: Shop,
    public topay: Topay
  ) {}

  static getAllUser() {
    return gql`
      query AllUser($limit: Int!, $offset: Int!) {
        users(limit: $limit, offset: $offset) {
          id
          name
          image
          dob
          gender
          email
          phone
          isSuspended
          isAdmin
          requestUnsuspend
        }
      }
    `;
  }

  static LOGIN_MUTATION = gql`
    mutation auth($email: String!, $password: String!) {
      auth {
        login(email: $email, password: $password)
      }
    }
  `;

  static REGISTER_MUTATION = gql`
    mutation register($name: String!, $email: String!, $password: String!) {
      auth {
        register(input: { name: $name, email: $email, password: $password })
      }
    }
  `;

  static UPDATE_USER_NAME_MUTATION = gql`
    mutation updateUserName($name: String!) {
      updateUserName(name: $name) {
        id
        name
      }
    }
  `;

  static UPDATE_USER_PHONE_MUTATION = gql`
    mutation updateUserPhone($phone: String!) {
      updateUserPhone(phone: $phone) {
        id
        phone
      }
    }
  `;

  static UPDATE_USER_EMAIL_MUTATION = gql`
    mutation updateUserEmail($email: String!) {
      updateUserEmail(email: $email) {
        id
        email
      }
    }
  `;

  static CREATE_VERIFY_EMAIL_MUTATION = gql`
    mutation createVerifyEmailToken($email: String!) {
      createEmailToken(email: $email) {
        id
      }
    }
  `;

  static UPDATE_USER_GENDER_MUTATION = gql`
    mutation updateUserGender($gender: String!) {
      updateUserGender(gender: $gender) {
        id
        gender
      }
    }
  `;

  static UPDATE_USER_IMAGE_MUTATION = gql`
    mutation updateUserImage($image: String!) {
      updateUserImage(image: $image) {
        id
        image
      }
    }
  `;

  static UPDATE_USER_DOB_MUTATION = gql`
    mutation updateUserDOB($dob: String!) {
      updateUserDOB(dob: $dob) {
        id
      }
    }
  `;

  static UPDATE_USER_AUTHENTICATION_MUTATION = gql`
    mutation toggleVerification($verification: Int!) {
      toggleUserVerification(verification: $verification) {
        id
      }
    }
  `;
}

export { User };
