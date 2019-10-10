 exports.handleSQLError = ((err, req, res, next) => {
  switch (err.code) {
    case '42703': 
      res.status(404).send({msg: 'column not found'})
      break;
    default: 
      res.status(500).send({msg: 'internal SQL error'})
  }
})