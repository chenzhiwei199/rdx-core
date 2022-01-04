import { AdvancedGraph } from "../../newGraph"
import { findCycles, isAcyclic } from "../../newGraph/alg"

test('闭环检测', async () => {
  const graph = new AdvancedGraph({})
  graph.setEdge('c', 'a')
  graph.setEdge('a', 'b')
  graph.setEdge('b', 'c')

  const graph2 = new AdvancedGraph({})
  graph.setEdge('c', 'a')
  graph.setEdge('a', 'b')
  console.log(isAcyclic(graph), findCycles(graph))
  console.log(isAcyclic(graph2), findCycles(graph2))
  // try {
  //   graph.circleExceptionCheck()  
  // } catch (error) {
  //   expect(error instanceof Error ).toBeTruthy()
  // }
  
})
