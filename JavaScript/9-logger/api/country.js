module.exports = ({ db }) => {
  const country = db('country');

  return {
    ...country,

    async read(id) {
      console.log({ db });
      return await country.read(id);
    },

    async find(mask) {
      const sql = 'SELECT * from country where name like $1';
      return await country.query(sql, [mask]);
    },
  };
};

//? Why in the initial example there is no ...country?
