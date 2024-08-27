export const BasicUserSelect = {
  id: true,
  firstName: true,
  lastName: true,
  username: true,
  avatarUrl: true,
  role: true,
  isGuide: true,
  countryIsoCode: true,
}

export const ExtendedUserSelect = {
  ...BasicUserSelect,
  email: true,
  createdAt: true,
  updatedAt: true,
  phone: true,
  telegram: true,
  about: true,
}
