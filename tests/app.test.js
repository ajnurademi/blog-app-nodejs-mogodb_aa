const User = require('../server/models/User');
const connectDB = require('../server/config/db');


/* Der Test scheiterte aufgrund Verzögerung bei der Datenbankverbindung. */

describe('User Model', () => {
  beforeAll(async () => {
    await connectDB();
  });

  it('should fetch user from database and store in array', async () => {
    const testUsername = 'testuser';

    // Testdaten
    const user = new User({
      username: testUsername,
      password: 'password123' 
    });
    await user.save();

    const fetchedUsers = await User.find({ username: testUsername });

    expect(Array.isArray(fetchedUsers)).toBe(true);
    expect(fetchedUsers.length).toBe(1);

    expect(fetchedUsers[0].username).toBe(testUsername);
  }, 15000);
});
