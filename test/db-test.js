module.exports = {
    '@tags': ['database'],
    afterEach: async (browser) => {
      await browser.navigateTo('http://localhost:3000/reset'); // Updated to use the correct port
    },
    'Verify only one Jane Doe': function (browser) {
      browser.assert.recordCountIs(
        1,
        'people',
        "first_name = 'Jane' AND last_name = 'Doe'"
      );
    },
    'Verify only one John Doe': function (browser) {
      browser.assert.recordCountIs(
        1,
        'people',
        "first_name = 'John' AND last_name = 'Doe'"
      );
    },
    'Verify only 3 people exist': function (browser) {
      browser.assert.recordCountIs(3, 'people');
    },
    'Verify John Wick count': function (browser) {
      const addJohnWick = 'http://localhost:3000/addPerson/4/John/Wick'; // Updated ID and URL
      const removeJohnWick = 'http://localhost:3000/removePerson/4'; // Updated ID and URL
      const whereJohnWick = "first_name = 'John' AND last_name = 'Wick'";
      
      browser.assert
        .recordCountIs(0, 'people', whereJohnWick)
        .url(addJohnWick)
        .assert.containsText('body', 'Added John Wick with ID 4') // Updated message
        .url(addJohnWick)
        .url(addJohnWick)
        .assert.recordCountIs(3, 'people', whereJohnWick)
        .url(removeJohnWick)
        .assert.containsText('body', 'Removed person with ID 4') // Updated message
        .assert.recordCountIs(0, 'people', whereJohnWick)
        .assert.recordCountIs(
          1,
          'people',
          "first_name = 'Jane' AND last_name = 'Doe'"
        );
    },
    'Can getSqlValue': async (browser) => {
      let result = await browser.getSqlValue(
        "SELECT first_name FROM people WHERE first_name = 'John' AND last_name = 'Doe'"
      );
      expect(result).to.have.property('first_name', 'John');
    },
    'Can change and getSqlValue': async (browser) => {
      let changeResult = await browser.runSql(
        "INSERT INTO people (first_name, last_name) VALUES ('Jon', 'Doughey')"
      );
      let result = await browser.getSqlValue(
        "SELECT first_name FROM people WHERE last_name = 'Doughey'"
      );
      expect(result).to.have.property('first_name', 'Jon');
    },
  };