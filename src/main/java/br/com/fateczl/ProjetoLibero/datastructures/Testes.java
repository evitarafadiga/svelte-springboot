package br.com.fateczl.ProjetoLibero.datastructures;

import java.util.List;

public class Testes {

	public static void main(String[] args) throws Exception {

		Grafo g = new Grafo();
		Vertice e = new Vertice("E");
		
		g.getVertices().add(e);
		
		g.adicionarVertice("A");
		g.adicionarVertice("B");
		g.adicionarVertice("C");
		g.adicionarVertice("D");
		
		g.conectarVertices("A", "B");
		g.conectarVertices("A", "C");
		g.conectarVertices("A", "D");
		
		System.out.println("grau do vertice A: " + g.getVertice("A").getGrau());
		
		
		System.out.println("o vertice C possui as seguintes adjacencias: /n");
		List<Vertice> adjacentes = g.getAdjacencias("A");
		for(Vertice vertice: adjacentes) {
			System.out.println(vertice.getRotulo()+" /n");
		}
	}

}
