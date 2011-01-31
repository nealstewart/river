Application = {};

Application.namespace = function(namespaceToCreate) {
  var namespaces = namespaceToCreate.split(".");
  var currentPointInNamespaces = window;

  for(var i = 0, length = namespaces.length; i < length; i++) {
    if (!currentPointInNamespaces[namespaces[i]]) {
      currentPointInNamespaces[namespaces[i]] = {};
    }

    currentPointInNamespaces = currentPointInNamespaces[namespaces[i]];
  }
};
