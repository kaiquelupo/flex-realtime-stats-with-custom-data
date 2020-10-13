//Create or update incresing by 1 the object path
const increaseValueByPath = (obj, path) => {
    var parts = path.split('.');
    var o = obj;
    if (parts.length > 1) {
      for (var i = 0; i < parts.length - 1; i++) {
          if (!o[parts[i]])
              o[parts[i]] = {};
          o = o[parts[i]];
      }
    }

    o[parts[parts.length - 1]] = (o[parts[parts.length - 1]] || 0) + 1;
}

module.exports = {
    increaseValueByPath
}