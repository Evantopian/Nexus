export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? null : "Invalid email format.";
};
  
export const validatePassword = (password) => {
    const longEnough = password.length >= 15;
    const complexEnough = password.length >= 8 && /[a-z]/.test(password) && /\d/.test(password);
    
    return longEnough || complexEnough
      ? null
      : "Password must be at least 15 characters OR at least 8 characters including a number and a lowercase letter.";
};
  
export const validateUsername = (username) => {
    const usernameRegex = /^(?!-)([A-Za-z0-9-]+)(?<!-)$/;
    return usernameRegex.test(username) 
      ? null 
      : "Username can only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.";
};
  