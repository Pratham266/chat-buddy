export const sortUserIdString = (input) => {
  // Match all user@id patterns using regex
  const matches = input.match(/[a-zA-Z]+@\d+/g);

  if (!matches || matches.length < 2) return input;

  // Sort alphabetically
  matches.sort();

  // Join and return
  return matches.join("");
};
