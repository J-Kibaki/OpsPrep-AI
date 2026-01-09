export const getAuth = jest.fn(() => ({
  onAuthStateChanged: jest.fn((cb) => {
    cb(null);
    return jest.fn();
  }),
  signOut: jest.fn(),
}));
export const signInWithEmailAndPassword = jest.fn();
export const createUserWithEmailAndPassword = jest.fn();
export const signInWithPopup = jest.fn();
export const GoogleAuthProvider = jest.fn();
export const onAuthStateChanged = jest.fn();
export const signOut = jest.fn();
