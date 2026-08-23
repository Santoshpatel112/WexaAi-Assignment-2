// 08_graph_exploration.cypher
// Lazy node expansion query

MATCH (n {id: $nodeId})
MATCH (n)-[r]-(neighbor)
RETURN n, r, neighbor
LIMIT $limit;
