export const generateHasDuplicatedFullNameQuery = (fullName: string) => `
  query hasDuplicatedFullName {
    hasDuplicatedFullName(fullName: "${fullName}")
  }
`;

export const generateHasDuplicatedEmailWithoutLoginQuery = (email: string) => `
  query hasDuplicatedEmailWithoutLogin {
    hasDuplicatedEmailWithoutLogin(email: "${email}")
  }
`;

export const generateHasDuplicatedEmailQuery = (email: string) => `
  query hasDuplicatedEmail {
    hasDuplicatedEmail(email: "${email}")
  }
`;