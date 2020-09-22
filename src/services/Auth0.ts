/* eslint-disable camelcase */
export interface Auth0Metadata {
  phone_number: string
  pronoun: string
  title: string
}

export interface Auth0User {
  given_name: string
  family_name: string
  name: string
  username: string
  nickname: string
  user_metadata: Auth0Metadata
}

export interface Auth0Token {
  user: Auth0User
  authorize_again: string
}
