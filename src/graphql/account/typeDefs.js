import { gql } from '@apollo/client/core';

export default gql`
  scalar Date

  scalar Time

  scalar DateTime

  scalar Duration

  scalar UtcOffset

  scalar LocalDate

  scalar LocalTime

  scalar LocalEndTime

  scalar EmailAddress

  scalar NegativeFloat

  scalar NegativeInt

  scalar NonEmptyString

  scalar NonNegativeFloat

  scalar NonNegativeInt

  scalar NonPositiveFloat

  scalar NonPositiveInt

  scalar PhoneNumber

  scalar PositiveFloat

  scalar PositiveInt

  scalar PostalCode

  scalar UnsignedFloat

  scalar UnsignedInt

  scalar URL

  scalar ObjectID

  scalar BigInt

  scalar Long

  scalar SafeInt

  scalar UUID

  scalar GUID

  scalar HexColorCode

  scalar HSL

  scalar HSLA

  scalar IPv4

  scalar IPv6

  scalar ISBN

  scalar JWT

  scalar Latitude

  scalar Longitude

  scalar MAC

  scalar Port

  scalar RGB

  scalar RGBA

  scalar USCurrency

  scalar Currency

  scalar JSON

  scalar JSONObject

  scalar Byte

  scalar Void

  #type Mutation {
  #  updateCurrentUser(user: User!): Boolean
  #}
`;
