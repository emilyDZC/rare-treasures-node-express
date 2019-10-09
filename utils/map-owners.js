exports.mapOwners = owners => {
  const obj = {};
  owners.forEach((owner, index) => {
    obj[owner.owner_id] = owner.forename;
  });
  return obj;
};
