
export const GoogleGenAI = jest.fn().mockImplementation(() => {
  return { getGenerativeModel: jest.fn() };
});
